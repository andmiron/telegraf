import {BotCommandInterface} from './bot.command.interface.js';
import {Scenes, Telegraf} from 'telegraf';
import {DatabaseClass} from '../db/database.class.js';

export class CheckCommand implements BotCommandInterface {
  command: string;
  description: string;

  private bot: Telegraf<Scenes.SceneContext>;
  private database: DatabaseClass;

  constructor(
    command: string,
    description: string,
    bot: Telegraf<Scenes.SceneContext>,
    database: DatabaseClass
  ) {
    this.command = command;
    this.description = description;
    this.bot = bot;
    this.database = database;
  }

  execute() {
    this.bot.command(this.command, async ctx => {
      const userId = ctx.from!.id;
      const user = await this.database.findUser(userId);

      if (user) {
        await ctx.reply(`Next update coming at ${Math.trunc(user.time / 60)}:${user.time % 60}`);
      } else {
        await ctx.reply('You have not subscribed yet.');
      }
    });
  }
}
