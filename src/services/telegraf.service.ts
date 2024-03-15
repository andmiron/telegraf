import { Scenes, session, Telegraf } from 'telegraf';
import { LoggerService } from './logger.service';
import { DatabaseService } from '../db/database.service';
import { CronService } from './cron.service';
import { Stage } from 'telegraf/scenes';
import { BotCommandInterface } from '../interfaces/bot.command.interface';
import { CustomContext } from '../interfaces/custom.context';
import { SubscribeCommand } from '../commands/subscribe.command';
import { Commands, CommandsDescription, EnvironmentVariableKeys, ScenesId } from '../types/types';
import { UnsubscribeCommand } from '../commands/unsubscribe.command';
import { UpdateCommand } from '../commands/update.command';
import { CheckCommand } from '../commands/check.command';
import { SubscribeScene } from '../scenes/subscribe.scene';
import { StartCommand } from '../commands/start.command';
import { GetWeatherCommand } from '../commands/getWeather.command';
import { WeatherClient } from './weather.client';
import { APIGatewayProxyEvent } from 'aws-lambda';
import 'dotenv/config';

export class TelegrafService {
   private loggerService: LoggerService = new LoggerService();
   private databaseService: DatabaseService = new DatabaseService();
   private weatherClient: WeatherClient = new WeatherClient();
   private bot: Telegraf<CustomContext> = new Telegraf<CustomContext>(
      process.env[EnvironmentVariableKeys.TELEGRAM_BOT_TOKEN]!,
   );
   private cron: CronService = new CronService(this.databaseService, this.weatherClient, this.loggerService, this.bot);
   private commands: BotCommandInterface[] = [];
   private scenes: Scenes.BaseScene<CustomContext>[] = [];

   registerCommands() {
      this.commands.push(new StartCommand(Commands.START, CommandsDescription.START, this.bot));
      this.commands.push(
         new GetWeatherCommand(Commands.WEATHER, CommandsDescription.WEATHER, this.bot, this.weatherClient),
      );
      this.commands.push(
         new SubscribeCommand(Commands.SUBSCRIBE, CommandsDescription.SUBSCRIBE, this.bot, this.databaseService),
      );
      this.commands.push(
         new UnsubscribeCommand(
            Commands.UNSUBSCRIBE,
            CommandsDescription.UNSUBSCRIBE,
            this.bot,
            this.databaseService,
            this.loggerService,
         ),
      );
      this.commands.push(
         new UpdateCommand(Commands.UPDATE, CommandsDescription.UPDATE, this.bot, this.databaseService),
      );
      this.commands.push(new CheckCommand(Commands.CHECK, CommandsDescription.CHECK, this.bot, this.databaseService));
   }

   registerScenes() {
      this.scenes.push(new SubscribeScene(ScenesId.WEATHER_SCENE, this.databaseService, this.loggerService).getScene());
   }

   createCommandsMenu() {
      this.bot.telegram
         .setMyCommands(this.commands)
         .then(() => {
            this.loggerService.logInfo('Commands menu set');
         })
         .catch((err) => {
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
         this.loggerService.logInfo(`${ctx.message!.from.first_name}:${ctx.chat!.id} sent ${ctx.updateType}`);
         await next();
      });
      this.bot.use(session());
   }

   startCronJob() {
      this.cron.start();
   }

   async connectDatabase() {
      try {
         await this.databaseService.connectDb(process.env[EnvironmentVariableKeys.MONGO_DB_STRING]!);
         this.loggerService.logInfo('database connected');
      } catch (err) {
         this.loggerService.logError('database connection error');
      }
   }

   launchBot() {
      this.bot.telegram
         .getMe()
         .then((botInfo) => {
            this.bot.launch({ allowedUpdates: ['message'] });
            this.loggerService.logInfo(`Bot ${botInfo.username} launched`);
         })
         .catch((err) => {
            this.loggerService.logError(err);
            throw new Error(err.message);
         });
   }

   async handleUpdate(event: APIGatewayProxyEvent) {
      await this.bot.handleUpdate(JSON.parse(event.body!));
   }
}
