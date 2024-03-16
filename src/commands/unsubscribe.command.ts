import { Telegraf } from 'telegraf';
import { DatabaseService } from '../db/database.service';
import { LoggerService } from '../services/logger.service';
import { BotCommandInterface } from '../interfaces/bot.command.interface';
import { BotResponse } from '../types/types';
import { CustomContext } from '../interfaces/custom.context';

export class UnsubscribeCommand implements BotCommandInterface {
   command: string;
   description: string;

   private bot: Telegraf<CustomContext>;
   private database: DatabaseService;
   private logger: LoggerService;

   constructor(
      command: string,
      description: string,
      bot: Telegraf<CustomContext>,
      database: DatabaseService,
      logger: LoggerService,
   ) {
      this.command = command;
      this.description = description;
      this.bot = bot;
      this.database = database;
      this.logger = logger;
   }

   execute() {
      this.bot.command(this.command, async (ctx) => {
         const chatId = ctx.chat.id;

         const userToDelete = await this.database.findUser(chatId);

         if (userToDelete) {
            await this.database.deleteUser(chatId);
            this.logger.logInfo(`User deleted from db`);

            await ctx.reply(BotResponse.UNSUBSCRIBE);
         } else {
            await ctx.reply(BotResponse.NO_SUBSCRIPTION);
         }
      });
   }
}
