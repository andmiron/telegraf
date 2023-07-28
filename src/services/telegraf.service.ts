import {Scenes, session, Telegraf} from 'telegraf';
import {LoggerService} from './logger.service.js';
import {DatabaseClass} from '../db/database.class.js';
import {ConfigService} from './config.service.js';
import {EnvironmentVariableKeys} from '../types/types.js';
import {CronService} from './cron.service.js';
import {BaseScene} from 'telegraf/scenes';
import {BotCommandInterface} from '../commands/bot.command.interface.js';
import {StartCommand} from '../commands/start.command.js';
import {GetWeatherCommand} from '../commands/getWeather.command.js';
import {SubscribeCommand} from '../commands/subscribe.command.js';
import {UnsubscribeCommand} from '../commands/unsubscribe.command.js';
import {UpdateCommand} from '../commands/update.command.js';
import {CheckCommand} from '../commands/check.command.js';
import {SubscribeScene} from '../scenes/subscribe.scene.js';
import {WeatherService} from './weather.service.js';

export class TelegrafService {
  private bot: Telegraf<Scenes.SceneContext>;
  private configService: ConfigService;
  private loggerService: LoggerService;
  private databaseService: DatabaseClass;
  private weatherService: WeatherService;
  private cron: CronService;
  private commands: BotCommandInterface[];
  private scenes: BaseScene<any>[];

  constructor() {
    this.configService = new ConfigService();
    this.loggerService = new LoggerService();
    this.databaseService = new DatabaseClass();
    this.weatherService = new WeatherService();
    this.bot = new Telegraf<Scenes.SceneContext>(
      this.configService.getToken(EnvironmentVariableKeys.TELEGRAM_BOT_TOKEN)
    );
    this.cron = new CronService(
      this.configService,
      this.databaseService,
      this.weatherService,
      this.loggerService,
      this.bot
    );
    this.commands = [];
    this.scenes = [];
  }

  registerCommands() {
    this.commands.push(new StartCommand('start', 'Start the bot', this.bot));
    this.commands.push(
      new GetWeatherCommand('weather', 'Get current weather', this.bot, this.weatherService)
    );
    this.commands.push(
      new SubscribeCommand('subscribe', 'Get daily weather updates', this.bot, this.databaseService)
    );
    this.commands.push(
      new UnsubscribeCommand(
        'unsubscribe',
        'Stop getting weather updates',
        this.bot,
        this.databaseService,
        this.loggerService
      )
    );
    this.commands.push(
      new UpdateCommand('update', 'Update subscription data', this.bot, this.databaseService)
    );
    this.commands.push(
      new CheckCommand('check', 'Check subscription status', this.bot, this.databaseService)
    );
  }

  registerScenes() {
    this.scenes.push(
      new SubscribeScene('weatherScene', this.databaseService, this.loggerService).getScene()
    );
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
    const stage = new Scenes.Stage<Scenes.SceneContext>(this.scenes);
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
      });
  }
}
