import {CommandClass} from './command.class.js';
import {Context} from 'telegraf';

export class UnsubscribeCommand extends CommandClass {
  constructor(command: string, description: string) {
    super(command, description);
  }

  async execute(ctx: Context): Promise<void> {
    const userId = ctx.from!.id;

    const userToDelete = await this.dbInstance.findUser(userId);

    if (userToDelete) {
      await this.dbInstance.deleteUser(userId);
      this.logger.logInfo(`User ${userId} deleted from db`);

      await ctx.reply('Your subscription declined.');
    } else {
      await ctx.reply('First you need to subscribe.');
    }
  }
}
