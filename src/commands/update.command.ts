import {CommandClass} from './command.class.js';

export class UpdateCommand extends CommandClass {
  constructor(command: string, description: string) {
    super(command, description);
  }

  async execute(ctx: any): Promise<void> {
    const user = await this.dbInstance.findUser(ctx.from.id);

    if (user) {
      await ctx.scene.enter('weatherScene');
    } else {
      await ctx.reply(`You do not have active subscription.\nUse /subscribe to obtain one.`);
    }
  }
}
