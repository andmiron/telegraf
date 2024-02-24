import {Telegraf} from 'telegraf';
import {TelegrafService} from './services/telegraf.service.js';
import {Commands, CommandsDescription, EnvironmentVariableKeys, ScenesId} from './types/types.js';
import {CustomContext} from './interfaces/custom.context.js';
import {ConfigService} from './services/config.service.js';
import {LoggerService} from './services/logger.service.js';
import {DatabaseService} from './db/database.service.js';
import {WeatherClient} from './services/weather.client.js';
import {CronService} from './services/cron.service.js';
import {StartCommand} from './commands/start.command.js';
import {GetWeatherCommand} from './commands/getWeather.command.js';
import {SubscribeCommand} from './commands/subscribe.command.js';
import {UnsubscribeCommand} from './commands/unsubscribe.command.js';
import {UpdateCommand} from './commands/update.command.js';
import {CheckCommand} from './commands/check.command.js';
import {SubscribeScene} from './scenes/subscribe.scene.js';

class App {
  private configService: ConfigService = new ConfigService();
  private bot: Telegraf<CustomContext> = new Telegraf<CustomContext>(
    this.configService.getToken(EnvironmentVariableKeys.TELEGRAM_BOT_TOKEN)
  );
  private loggerService: LoggerService = new LoggerService();
  private databaseService: DatabaseService = new DatabaseService();
  private weatherClient: WeatherClient = new WeatherClient();
  private cron: CronService = new CronService(
    this.configService,
    this.databaseService,
    this.weatherClient,
    this.loggerService,
    this.bot
  );
  private telegrafService = new TelegrafService(
    this.bot,
    this.loggerService,
    this.databaseService,
    this.cron
  );

  build(): App {
    this.telegrafService.registerCommand(
      new StartCommand(Commands.START, CommandsDescription.START, this.bot)
    );
    this.telegrafService.registerCommand(
      new GetWeatherCommand(
        Commands.WEATHER,
        CommandsDescription.WEATHER,
        this.bot,
        this.weatherClient
      )
    );
    this.telegrafService.registerCommand(
      new SubscribeCommand(
        Commands.SUBSCRIBE,
        CommandsDescription.SUBSCRIBE,
        this.bot,
        this.databaseService
      )
    );
    this.telegrafService.registerCommand(
      new UnsubscribeCommand(
        Commands.UNSUBSCRIBE,
        CommandsDescription.UNSUBSCRIBE,
        this.bot,
        this.databaseService,
        this.loggerService
      )
    );
    this.telegrafService.registerCommand(
      new UpdateCommand(Commands.UPDATE, CommandsDescription.UPDATE, this.bot, this.databaseService)
    );
    this.telegrafService.registerCommand(
      new CheckCommand(Commands.CHECK, CommandsDescription.CHECK, this.bot, this.databaseService)
    );

    this.telegrafService.registerScenes(
      new SubscribeScene(
        ScenesId.WEATHER_SCENE,
        this.databaseService,
        this.loggerService
      ).getScene()
    );
    this.telegrafService.registerMiddlewares();
    this.telegrafService.createStage();
    this.telegrafService.createCommandsMenu();
    this.telegrafService.handleCommands();
    this.telegrafService.connectDatabase();
    this.telegrafService.startCronJob();

    return this;
  }

  launch() {
    this.telegrafService.launchBot();
  }
}

new App().build().launch();
