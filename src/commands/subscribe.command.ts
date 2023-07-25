import {CommandClass} from './command.class.js';
import {Context, Markup} from 'telegraf';

export class SubscribeCommand extends CommandClass {
  constructor(command: string, description: string) {
    super(command, description);
  }

  async execute(ctx: Context): Promise<void> {
    await ctx.reply(
      'Start subscription ⛅',
      Markup.inlineKeyboard([Markup.button.callback('Choose time ⌛', 'startWeatherScene')])
    );
  }
}
