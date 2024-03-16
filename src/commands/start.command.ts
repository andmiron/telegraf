import { Markup, Telegraf } from 'telegraf';
import { BotCommandInterface } from '../interfaces/bot.command.interface';
import { BotResponse } from '../types/types';
import { CustomContext } from '../interfaces/custom.context';

export class StartCommand implements BotCommandInterface {
   command: string;
   description: string;

   private bot: Telegraf<CustomContext>;

   constructor(command: string, description: string, bot: Telegraf<CustomContext>) {
      this.command = command;
      this.description = description;
      this.bot = bot;
   }

   execute() {
      this.bot.command(this.command, async (ctx) => {
         const commands = await ctx.telegram.getMyCommands();

         const replyKeyboard = [];
         for (const command of commands) {
            replyKeyboard.push(Markup.button.text(`/${command.command}`));
         }

         await ctx.reply(BotResponse.START, Markup.keyboard(replyKeyboard).resize());
      });
   }
}
