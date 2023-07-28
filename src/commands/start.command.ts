import {Markup, Scenes, Telegraf} from 'telegraf';
import {BotCommandInterface} from './bot.command.interface.js';

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

      await ctx.reply(
        'I will help you be aware of the weather every day. To find available commands use bot menu or reply keyboard below:',
        Markup.keyboard(replyKeyboard).resize()
      );
    });
  }
}
