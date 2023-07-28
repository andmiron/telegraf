import {CronJob} from 'cron';
import {DatabaseClass} from '../db/database.class.js';
import User from '../db/model.user.js';
import {WeatherClient} from './weather.client.js';
import {Scenes, Telegraf} from 'telegraf';
import {ConfigService} from './config.service.js';
import {BotResponse, EnvironmentVariableKeys} from '../types/types.js';
import {LoggerService} from './logger.service.js';
import {StringGenerator} from '../utils/string.generator.js';

export class CronService {
  private configService: ConfigService;
  private databaseService: DatabaseClass;
  private weatherClient: WeatherClient;
  private loggerService: LoggerService;
  private bot: Telegraf<Scenes.SceneContext>;

  constructor(
    configService: ConfigService,
    databaseService: DatabaseClass,
    weatherClient: WeatherClient,
    loggerService: LoggerService,
    bot: Telegraf<Scenes.SceneContext>
  ) {
    this.configService = configService;
    this.databaseService = databaseService;
    this.weatherClient = weatherClient;
    this.loggerService = loggerService;
    this.bot = bot;
  }

  onTick = async () => {
    const currentDate = new Date();
    const currentMinute = currentDate.getHours() * 60 + currentDate.getMinutes();

    try {
      for await (const user of User.find()) {
        const userMinute = user.time;
        const {latitude, longitude} = user;
        const {chatId} = user;
        const weatherData = await this.weatherClient.getForecast(latitude, longitude);

        if (currentMinute + user.offset === userMinute && weatherData) {
          const weatherString = new StringGenerator().generateWeatherString(weatherData);
          await this.bot.telegram.sendMessage(chatId, weatherString);
          this.loggerService.logInfo(`Chat ${chatId} received weather update.`);
        }

        if (!weatherData) {
          await this.bot.telegram.sendMessage(chatId, BotResponse.WEATHER_FETCH_ERROR);
        }
      }
    } catch (err) {
      this.loggerService.logError(err as Error);
    }
  };

  start() {
    new CronJob(
      this.configService.getToken(EnvironmentVariableKeys.CRON_TIME),
      this.onTick,
      null,
      true,
      this.configService.getToken(EnvironmentVariableKeys.TZ)
    );
  }
}
