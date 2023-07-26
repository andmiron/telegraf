import {BotCommand} from 'typegram';
import {Context} from 'telegraf';
import {LoggerService} from '../services/logger.service.js';
import {DatabaseClass} from '../db/database.class.js';

export abstract class CommandClass implements BotCommand {
  command: string;
  description: string;
  protected logger: LoggerService;
  protected dbInstance: DatabaseClass;

  protected constructor(command: string, description: string) {
    this.command = command;
    this.description = description;
    this.logger = new LoggerService();
    this.dbInstance = new DatabaseClass();
  }

  abstract execute(ctx: Context): void;
}
