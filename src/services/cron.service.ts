import {CronJob} from 'cron';
import {DatabaseClass} from '../db/database.class.js';
import User from '../db/model.user.js';
import {WeatherService} from './weather.service.js';
import {Scenes, Telegraf} from 'telegraf';
import {ConfigService} from './config.service.js';
import {BotResponse, EnvironmentVariableKeys} from '../types/types.js';
import {LoggerService} from './logger.service.js';

export class CronService {
  private configService: ConfigService;
  private databaseService: DatabaseClass;
  private weatherService: WeatherService;
  private loggerService: LoggerService;
  private bot: Telegraf<Scenes.SceneContext>;

  constructor(
    configService: ConfigService,
    databaseService: DatabaseClass,
    weatherService: WeatherService,
    loggerService: LoggerService,
    bot: Telegraf<Scenes.SceneContext>
  ) {
    this.configService = configService;
    this.databaseService = databaseService;
    this.weatherService = weatherService;
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

        if (currentMinute + user.offset === userMinute) {
          const weatherData =
            (await this.weatherService.getForecast(latitude, longitude)) ??
            BotResponse.WEATHER_FETCH_ERROR;

          await this.bot.telegram.sendMessage(chatId, weatherData);
          this.loggerService.logInfo(`Chat ${chatId} received weather update.`);
        }
      }
    } catch (err) {
      this.loggerService.logError(err as Error);
    }
  };

  start() {
    new CronJob(
      '* * * * *',
      this.onTick,
      null,
      true,
      this.configService.getToken(EnvironmentVariableKeys.TZ)
    );
  }
}
