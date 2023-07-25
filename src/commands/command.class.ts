import {BotCommand} from 'typegram';
import {Context} from 'telegraf';

export abstract class CommandClass implements BotCommand {
  command: string;
  description: string;

  protected constructor(command: string, description: string) {
    this.command = command;
    this.description = description;
  }

  abstract execute(ctx: Context): void;
}
