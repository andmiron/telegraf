import {Scenes, session, Telegraf} from 'telegraf';
import {LoggerService} from './logger.service.js';
import {DatabaseService} from '../db/database.service.js';
import {CronService} from './cron.service.js';
import {BaseScene, Stage} from 'telegraf/scenes';
import {BotCommandInterface} from '../interfaces/bot.command.interface.js';
import {CustomContext} from '../interfaces/custom.context.js';

export class TelegrafService {
  private readonly bot: Telegraf<CustomContext>;
  private readonly loggerService: LoggerService;
  private readonly databaseService: DatabaseService;
  private cron: CronService;
  private commands: BotCommandInterface[];
  private scenes: Scenes.BaseScene<CustomContext>[];

  constructor(
    bot: Telegraf<CustomContext>,
    logger: LoggerService,
    database: DatabaseService,
    cron: CronService
  ) {
    this.bot = bot;
    this.loggerService = logger;
    this.databaseService = database;
    this.cron = cron;
    this.commands = [];
    this.scenes = [];
  }

  registerCommand(command: BotCommandInterface) {
    this.commands.push(command);
  }

  registerScenes(scene: BaseScene<CustomContext>) {
    this.scenes.push(scene);
  }

  createCommandsMenu() {
    this.bot.telegram
      .setMyCommands(this.commands)
      .then(() => {
        this.loggerService.logInfo('Commands menu set');
      })
      .catch(err => {
        this.loggerService.logError(err.message);
      });
  }

  handleCommands() {
    for (const command of this.commands) {
      command.execute();
    }
  }

  createStage() {
    const stage = new Stage<CustomContext>(this.scenes);
    this.bot.use(stage.middleware());
  }

  registerMiddlewares() {
    this.bot.use(async (ctx, next) => {
      this.loggerService.logInfo(
        `${ctx.message!.from.first_name}:${ctx.chat!.id} sent ${ctx.updateType}`
      );
      await next();
    });
    this.bot.use(session());
  }

  startCronJob() {
    this.cron.start();
  }

  connectDatabase() {
    this.databaseService
      .connectDb()
      .then(() => this.loggerService.logInfo('Database connected!'))
      .catch(err => this.loggerService.logError(err.messagge));
  }

  launchBot() {
    this.bot.telegram
      .getMe()
      .then(botInfo => {
        this.bot.launch({allowedUpdates: ['message']});
        this.loggerService.logInfo(`Bot ${botInfo.username} launched`);
      })
      .catch(err => {
        this.loggerService.logError(err);
        throw new Error(err.message);
      });
  }
}
