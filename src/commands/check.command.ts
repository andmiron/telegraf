import {CommandClass} from './command.class.js';
import {Context} from 'telegraf';

export class CheckCommand extends CommandClass {
  constructor(command: string, description: string) {
    super(command, description);
  }

  async execute(ctx: Context): Promise<void> {
    const userId = ctx.from!.id;
    const user = await this.dbInstance.findUser(userId);

    if (user) {
      await ctx.reply(`You will receive weather update at ${user.time}.`);
    } else {
      await ctx.reply('You have not subscribed yet.');
    }
  }
}
