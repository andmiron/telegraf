import {Telegraf} from 'telegraf';
import {LoggerService} from './logger.service.js';
import {CommandClass} from '../commands/command.class.js';

export class TelegrafService {
  private readonly bot: Telegraf;
  private logger: LoggerService;
  private commands: CommandClass[];

  constructor(bot: Telegraf) {
    this.bot = bot;
    this.logger = new LoggerService();
    this.commands = [];
  }

  addCommand(command: CommandClass): void {
    this.commands.push(command);
  }

  registerMiddlewares(): void {
    this.bot.use(async (ctx, next) => {
      this.logger.logInfo(
        `${ctx.from ? ctx.from.username : 'Unknown user'}: sent ${ctx.updateType}`
      );
      await next();
    });
  }

  createCommandsMenu(): void {
    this.bot.telegram
      .setMyCommands(this.commands)
      .then(() => {
        this.logger.logInfo('Commands menu successfully set!');
      })
      .catch(err => {
        this.logger.logError(err);
      });
  }

  launchBot(): void {
    this.bot.telegram.getMe().then(user => {
      this.bot.launch();
      this.logger.logInfo(`Bot ${user.username} started`);
    });
  }

  handleCommands(): void {
    this.bot.command(/\S+/, ctx => {
      const userInput = ctx.message.text.slice(1);
      const commandToExecute = this.commands.find(command => command.command === userInput);
      const response = 'Unknown command...';

      if (commandToExecute) {
        commandToExecute.execute(ctx);
      } else {
        ctx.reply(response);
      }
    });
  }

  handleCallbackQuery() {
    this.bot.action('subscribe', async ctx => {
      await ctx.reply('You have been subscribed.').then(() => {
        ctx.answerCbQuery();
      });
    });
  }
}
