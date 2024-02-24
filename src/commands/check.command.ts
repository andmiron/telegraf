import {BotCommandInterface} from '../interfaces/bot.command.interface.js';
import {Telegraf} from 'telegraf';
import {DatabaseService} from '../db/database.service.js';
import {BotResponse} from '../types/types.js';
import {CustomContext} from '../interfaces/custom.context.js';

export class CheckCommand implements BotCommandInterface {
  command: string;
  description: string;

  private bot: Telegraf<CustomContext>;
  private database: DatabaseService;

  constructor(
    command: string,
    description: string,
    bot: Telegraf<CustomContext>,
    database: DatabaseService
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
        await ctx.reply(BotResponse.CHECK + user.timeInput);
      } else {
        await ctx.reply(BotResponse.NO_SUBSCRIPTION);
      }
    });
  }
}
