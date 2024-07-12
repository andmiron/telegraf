import { SceneCreator } from './scene.creator';
import { KeyboardButton } from '@grammyjs/types';
import { Markup } from 'telegraf';
import { DatabaseService } from '../db/database.service';
import { LoggerService } from '../services/logger.service';
import { BotResponse, RegExpTriggers } from '../types/types';
import { BaseScene } from 'telegraf/scenes';
import { CustomContext } from '../interfaces/custom.context';
import { UserDto } from '../dto/user.dto';
import { convertHoursStringToMinutes, getUtcOffsetMinutesFromCoordinates } from '../utils/timeConverter.class';

export class SubscribeScene extends SceneCreator {
   private scene: BaseScene<CustomContext>;
   private database: DatabaseService;
   private logger: LoggerService;

   constructor(sceneId: string, database: DatabaseService, logger: LoggerService) {
      super();
      this.scene = new BaseScene<CustomContext>(sceneId);
      this.database = database;
      this.logger = logger;
   }

   createScene() {
      this.scene.enter(async (ctx) => {
         this.logger.logInfo(`User ${ctx.message!.from.first_name} entered the scene`);

         const keyboardButtons: KeyboardButton[] = [];

         for (let hour = 0; hour < 24; hour++) {
            keyboardButtons.push(Markup.button.text(`${hour < 10 ? `0${hour}` : hour}:00`));
         }

         const replyKeyboard = Markup.keyboard(keyboardButtons, { columns: 3 }).resize().oneTime().placeholder('HH:MM');

         await ctx.reply(BotResponse.TIME_INPUT, replyKeyboard);
      });

      this.scene.hears(RegExpTriggers['TIME_INPUT'], async (ctx) => {
         ctx.scene.session.time = convertHoursStringToMinutes(ctx.message.text);
         ctx.scene.session.timeInput = ctx.message.text;

         await ctx.reply(
            BotResponse.SHARE_LOCATION,
            Markup.keyboard([Markup.button.locationRequest(BotResponse.SHARE_BUTTON), Markup.button.text('/cancel')])
               .resize()
               .oneTime(),
         );
      });

      this.scene.on('location', async (ctx) => {
         const { latitude, longitude } = ctx.message.location;
         ctx.scene.session.latitude = latitude;
         ctx.scene.session.longitude = longitude;

         ctx.scene.session.offset = await getUtcOffsetMinutesFromCoordinates(latitude, longitude);

         await ctx.reply(
            BotResponse.SUBMIT_SUBSCRIPTION,
            Markup.keyboard([Markup.button.text(BotResponse.SUBSCRIBE_BUTTON), Markup.button.text('/cancel')])
               .resize()
               .oneTime(),
         );

      });
      this.scene.hears(BotResponse.SUBSCRIBE_BUTTON, async (ctx) => {
         try {
            ctx.scene.session.chatId = ctx.chat.id;

            const userData: UserDto = {
               time: ctx.scene.session.time,
               timeInput: ctx.scene.session.timeInput,
               latitude: ctx.scene.session.latitude,
               longitude: ctx.scene.session.longitude,
               offset: ctx.scene.session.offset,
               chatId: ctx.scene.session.chatId,
            };

            await this.database.upsert(userData);
            this.logger.logInfo(`User ${ctx.message.from.first_name} saved to db`);

            await ctx.reply(BotResponse.SUBSCRIBED + ctx.scene.session.timeInput);

            await ctx.scene.leave();
            this.logger.logInfo(`User ${ctx.message.from.first_name} exited the scene`);
         } catch (err) {
            this.logger.logError('Error saving the user to db!');
            await ctx.reply(BotResponse.WEATHER_FETCH_ERROR);
            await ctx.scene.leave();
         }
      });

      this.scene.hears('/cancel', async (ctx) => {
         await ctx.scene.leave();
         await ctx.reply(BotResponse.SCENE_EXIT);

         this.logger.logInfo(`User ${ctx.message.from.first_name} exited the scene`);
      });
   }

   getScene(): BaseScene<CustomContext> {
      this.createScene();
      return this.scene;
   }
}
