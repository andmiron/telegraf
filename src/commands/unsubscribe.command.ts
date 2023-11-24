import {Telegraf} from 'telegraf';
import {DatabaseClass} from '../db/database.class.js';
import {LoggerService} from '../services/logger.service.js';
import {BotCommandInterface} from '../interfaces/bot.command.interface.js';
import {BotResponse} from '../types/types.js';
import {CustomContext} from '../interfaces/custom.context.js';

export class UnsubscribeCommand implements BotCommandInterface {
  command: string;
  description: string;

  private bot: Telegraf<CustomContext>;
  private database: DatabaseClass;
  private logger: LoggerService;

  constructor(
    command: string,
    description: string,
    bot: Telegraf<CustomContext>,
    database: DatabaseClass,
    logger: LoggerService
  ) {
    this.command = command;
    this.description = description;
    this.bot = bot;
    this.database = database;
    this.logger = logger;
  }

  execute() {
    this.bot.command(this.command, async ctx => {
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
