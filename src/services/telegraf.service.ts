import {Scenes, session, Telegraf} from 'telegraf';
import {LoggerService} from './logger.service.js';
import {DatabaseClass} from '../db/database.class.js';
import {ConfigService} from './config.service.js';
import {Commands, CommandsDescription, EnvironmentVariableKeys, ScenesId} from '../types/types.js';
import {CronService} from './cron.service.js';
import {Stage} from 'telegraf/scenes';
import {BotCommandInterface} from '../interfaces/bot.command.interface.js';
import {StartCommand} from '../commands/start.command.js';
import {GetWeatherCommand} from '../commands/getWeather.command.js';
import {SubscribeCommand} from '../commands/subscribe.command.js';
import {UnsubscribeCommand} from '../commands/unsubscribe.command.js';
import {UpdateCommand} from '../commands/update.command.js';
import {CheckCommand} from '../commands/check.command.js';
import {SubscribeScene} from '../scenes/subscribe.scene.js';
import {WeatherClient} from './weather.client.js';
import {CustomContext} from '../interfaces/custom.context.js';

export class TelegrafService {
  private readonly bot: Telegraf<CustomContext>;
  private readonly configService: ConfigService;
  private readonly loggerService: LoggerService;
  private readonly databaseService: DatabaseClass;
  private readonly weatherClient: WeatherClient;
  private cron: CronService;
  private commands: BotCommandInterface[];
  private scenes: Scenes.BaseScene<CustomContext>[];

  constructor() {
    this.configService = new ConfigService();
    this.loggerService = new LoggerService();
    this.databaseService = new DatabaseClass();
    this.weatherClient = new WeatherClient();
    this.bot = new Telegraf<CustomContext>(
      this.configService.getToken(EnvironmentVariableKeys.TELEGRAM_BOT_TOKEN)
    );
    this.cron = new CronService(
      this.configService,
      this.databaseService,
      this.weatherClient,
      this.loggerService,
      this.bot
    );
    this.commands = [];
    this.scenes = [];
  }

  registerCommands() {
    this.commands.push(new StartCommand(Commands.START, CommandsDescription.START, this.bot));
    this.commands.push(
      new GetWeatherCommand(
        Commands.WEATHER,
        CommandsDescription.WEATHER,
        this.bot,
        this.weatherClient
      )
    );
    this.commands.push(
      new SubscribeCommand(
        Commands.SUBSCRIBE,
        CommandsDescription.SUBSCRIBE,
        this.bot,
        this.databaseService
      )
    );
    this.commands.push(
      new UnsubscribeCommand(
        Commands.UNSUBSCRIBE,
        CommandsDescription.UNSUBSCRIBE,
        this.bot,
        this.databaseService,
        this.loggerService
      )
    );
    this.commands.push(
      new UpdateCommand(Commands.UPDATE, CommandsDescription.UPDATE, this.bot, this.databaseService)
    );
    this.commands.push(
      new CheckCommand(Commands.CHECK, CommandsDescription.CHECK, this.bot, this.databaseService)
    );
  }

  registerScenes() {
    this.scenes.push(
      new SubscribeScene(
        ScenesId.WEATHER_SCENE,
        this.databaseService,
        this.loggerService
      ).getScene()
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
