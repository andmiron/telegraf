import { BotCommand } from '@grammyjs/types';

export interface BotCommandInterface extends BotCommand {
   command: string;
   description: string;
   execute(): void;
}
