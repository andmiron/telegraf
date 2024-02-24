import {Scenes, session, Telegraf} from 'telegraf';
import {LoggerService} from './logger.service.js';
import {DatabaseService} from '../db/database.service.js';
import {ConfigService} from './config.service.js';
import {EnvironmentVariableKeys} from '../types/types.js';
import {CronService} from './cron.service.js';
import {BaseScene, Stage} from 'telegraf/scenes';
import {BotCommandInterface} from '../interfaces/bot.command.interface.js';
import {WeatherClient} from './weather.client.js';
import {CustomContext} from '../interfaces/custom.context.js';

export class TelegrafService {
  private readonly bot: Telegraf<CustomContext>;
  private readonly configService: ConfigService;
  private readonly loggerService: LoggerService;
  private readonly databaseService: DatabaseService;
  private readonly weatherClient: WeatherClient;
  private cron: CronService;
  private commands: BotCommandInterface[];
  private scenes: Scenes.BaseScene<CustomContext>[];

  constructor(
    bot: Telegraf<CustomContext>,
    config: ConfigService,
    logger: LoggerService,
    database: DatabaseService,
    weather: WeatherClient,
    cron: CronService
  ) {
    this.bot = bot;
    this.configService = config;
    this.loggerService = logger;
    this.databaseService = database;
    this.weatherClient = weather;
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
        this.loggerService.logInfo('Command menu set');
      })
      .catch(err => {
        this.loggerService.logError(err);
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
      .connectDb(this.configService.getToken(EnvironmentVariableKeys.MONGO_DB_STRING))
      .then(() => {
        this.loggerService.logInfo('Database connected');
      })
      .catch(err => {
        this.loggerService.logError(err);
        throw new Error(err.message);
      });
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
