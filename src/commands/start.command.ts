import {CommandClass} from './command.class.js';
import {Context} from 'telegraf';

export class StartCommand extends CommandClass {
  constructor(command: string, description: string) {
    super(command, description);
  }

  async execute(ctx: Context): Promise<void> {
    await ctx.reply('To subscribe on daily weather forecasts type /subscribe');
  }
}
