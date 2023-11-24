import {BotCommand} from 'typegram';

export interface BotCommandInterface extends BotCommand {
  command: string;
  description: string;
  execute(): void;
}
