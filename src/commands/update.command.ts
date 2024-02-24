import {Telegraf} from 'telegraf';
import {DatabaseService} from '../db/database.service.js';
import {BotCommandInterface} from '../interfaces/bot.command.interface.js';
import {BotResponse, ScenesId} from '../types/types.js';
import {CustomContext} from '../interfaces/custom.context.js';

export class UpdateCommand implements BotCommandInterface {
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
      const user = await this.database.findUser(ctx.chat.id);

      if (user) {
        await ctx.scene.enter(ScenesId.WEATHER_SCENE);
      } else {
        await ctx.reply(BotResponse.NO_SUBSCRIPTION);
      }
    });
  }
}
