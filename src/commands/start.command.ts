import {CommandClass} from './command.class.js';
import {Context, Markup} from 'telegraf';

export class StartCommand extends CommandClass {
  constructor(command: string, description: string) {
    super(command, description);
  }

  async execute(ctx: Context): Promise<void> {
    const commands = await ctx.telegram.getMyCommands();

    const replyKeyboard = [];

    for (const command of commands) {
      replyKeyboard.push(Markup.button.text(`/${command.command}`));
    }

    await ctx.reply(
      'I will help you be aware of the weather every day. To find available commands use bot menu or reply keyboard below:',
      Markup.keyboard(replyKeyboard).resize()
    );
  }
}
