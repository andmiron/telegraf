import {CommandClass} from './command.class.js';
import {Context, Markup} from 'telegraf';

export class SubscribeCommand extends CommandClass {
  constructor(command: string, description: string) {
    super(command, description);
  }

  async execute(ctx: Context): Promise<void> {
    const inlineKeyboard = Markup.inlineKeyboard([
      Markup.button.callback('Subscribe 🔔', 'subscribe'),
      Markup.button.callback('Unsubscribe 🔕', 'unsubscribe'),
    ]);

    await ctx.reply('Get daily weather updates:', inlineKeyboard);
  }
}
