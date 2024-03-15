import { CronJob } from 'cron';
import { DatabaseService } from '../db/database.service';
import { WeatherClient } from './weather.client';
import { Telegraf } from 'telegraf';
import { BotResponse, EnvironmentVariableKeys } from '../types/types';
import { LoggerService } from './logger.service';
import { generateWeatherString } from '../utils/string.generator';
import { CustomContext } from '../interfaces/custom.context';
import { isMinuteToRunCron } from '../utils/timeConverter.class';

export class CronService {
   private databaseService: DatabaseService;
   private weatherClient: WeatherClient;
   private loggerService: LoggerService;
   private bot: Telegraf<CustomContext>;

   constructor(
      databaseService: DatabaseService,
      weatherClient: WeatherClient,
      loggerService: LoggerService,
      bot: Telegraf<CustomContext>,
   ) {
      this.databaseService = databaseService;
      this.weatherClient = weatherClient;
      this.loggerService = loggerService;
      this.bot = bot;
   }

   onTick = async () => {
      try {
         const users = await this.databaseService.findAllUsers();
         for (const user of users) {
            const weatherData = await this.weatherClient.getForecast(user.latitude, user.longitude);
            if (isMinuteToRunCron(user.time, user.offset) && weatherData) {
               const weatherString = generateWeatherString(weatherData);
               await this.bot.telegram.sendMessage(user.chatId, weatherString);
               this.loggerService.logInfo(`Chat ${user.chatId} received weather update.`);
            }
            if (!weatherData) {
               await this.bot.telegram.sendMessage(user.chatId, BotResponse.WEATHER_FETCH_ERROR);
            }
         }
      } catch (err) {
         this.loggerService.logError('Cron job error!');
      }
   };

   start() {
      new CronJob(
         process.env[EnvironmentVariableKeys.CRON_TIME]!,
         this.onTick,
         null,
         true,
         process.env[EnvironmentVariableKeys.TZ]!,
      );
   }
}
