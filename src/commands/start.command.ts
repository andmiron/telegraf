import {Markup, Scenes, Telegraf} from 'telegraf';
import {BotCommandInterface} from './bot.command.interface.js';
import {BotResponse} from '../types/types.js';

export class StartCommand implements BotCommandInterface {
  command: string;
  description: string;

  private bot: Telegraf<Scenes.SceneContext>;

  constructor(command: string, description: string, bot: Telegraf<Scenes.SceneContext>) {
    this.command = command;
    this.description = description;
    this.bot = bot;
  }

  execute() {
    this.bot.command(this.command, async ctx => {
      const commands = await ctx.telegram.getMyCommands();

      const replyKeyboard = [];
      for (const command of commands) {
        replyKeyboard.push(Markup.button.text(`/${command.command}`));
      }

      await ctx.reply(BotResponse.START, Markup.keyboard(replyKeyboard).resize());
    });
  }
}
