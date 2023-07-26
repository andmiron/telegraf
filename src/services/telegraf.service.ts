import {Scenes, session, Telegraf} from 'telegraf';
import {LoggerService} from './logger.service.js';
import {CommandClass} from '../commands/command.class.js';
import {DatabaseClass} from '../db/database.class.js';
import {ConfigService} from './config.service.js';
import {EnvironmentVariableKeys} from '../types/types.js';
import {SubscribeScene} from '../scenes/subscribe.scene.js';
import {CronJob} from 'cron';
import {CronService} from './cron.service.js';

export class TelegrafService {
  private readonly bot: Telegraf<Scenes.SceneContext>;
  private logger: LoggerService;
  private commands: CommandClass[];
  private database: DatabaseClass;

  constructor(bot: Telegraf<Scenes.SceneContext>) {
    this.bot = bot;
    this.logger = new LoggerService();
    this.commands = [];
    this.database = new DatabaseClass();
  }

  addCommand(command: CommandClass): void {
    this.commands.push(command);
  }

  registerMiddlewares(): void {
    this.bot.use(async (ctx, next) => {
      this.logger.logInfo(`${ctx.message!.from.first_name} sent ${ctx.updateType}`);

      await next();
    });

    const stage = this.createStage();

    this.bot.use(session());
    this.bot.use(stage.middleware());
  }

  createStage() {
    const scenes = [];

    scenes.push(new SubscribeScene('weatherScene').getScene());

    return new Scenes.Stage<Scenes.SceneContext>(scenes);
  }

  startCronJob() {
    const cron = new CronService(this.database);
    cron.start();
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
      this.bot.launch({allowedUpdates: ['message', 'callback_query']});
      this.logger.logInfo(`Bot ${user.username} started`);
    });

    this.database
      .connectDb(new ConfigService().getToken(EnvironmentVariableKeys.MONGO_DB_STRING))
      .then(() => {
        this.logger.logInfo('Database connected');
      })
      .catch(err => {
        this.logger.logError(err);
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
}
