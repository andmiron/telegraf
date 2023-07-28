import {SceneCreator} from './scene.creator.js';
import {BaseScene} from 'telegraf/scenes';
import {KeyboardButton} from 'typegram';
import {Markup} from 'telegraf';
import {TimeConverterClass} from '../utils/timeConverter.class.js';
import {DatabaseClass} from '../db/database.class.js';
import {LoggerService} from '../services/logger.service.js';

export class SubscribeScene extends SceneCreator {
  private scene: BaseScene<any>;
  private database: DatabaseClass;
  private logger: LoggerService;

  constructor(sceneId: string, database: DatabaseClass, logger: LoggerService) {
    super();
    this.scene = new BaseScene<any>(sceneId);
    this.database = database;
    this.logger = logger;
  }

  createScene() {
    this.scene.enter(async ctx => {
      this.logger.logInfo(`User ${ctx.message.from.first_name} entered the scene`);

      const keyboardButtons: KeyboardButton[] = [];

      for (let hour = 0; hour < 24; hour++) {
        keyboardButtons.push(Markup.button.text(`${hour < 10 ? `0${hour}` : hour}:00`));
      }

      const replyKeyboard = Markup.keyboard(keyboardButtons, {columns: 3})
        .resize()
        .oneTime()
        .placeholder('HH:MM');

      await ctx.reply(
        'Enter desired time ⌛ in HH:MM format\nor use keyboard below ⬇️\n(or /cancel to exit)',
        replyKeyboard
      );
    });

    this.scene.hears(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, async ctx => {
      ctx.session.time = new TimeConverterClass().convertHoursStringToMinutes(ctx.message.text);

      await ctx.reply(
        `Got it! Now share your location 📍\n(or /cancel to exit)`,
        Markup.keyboard([
          Markup.button.locationRequest('Location 📍'),
          Markup.button.text('/cancel'),
        ])
          .resize()
          .oneTime()
      );
    });

    this.scene.on('location', async ctx => {
      const {latitude, longitude} = ctx.message.location;
      ctx.session.latitude = latitude;
      ctx.session.longitude = longitude;

      ctx.session.offset = await new TimeConverterClass().getUtcOffsetMinutesFromCoordinates(
        latitude,
        longitude
      );

      await ctx.reply(
        `Good. Submit to subscribe ⬇️\n(or /cancel to exit)`,
        Markup.keyboard([Markup.button.text('Subscribe 🔔'), Markup.button.text('/cancel')])
          .resize()
          .oneTime()
      );
    });

    this.scene.hears('Subscribe 🔔', async ctx => {
      try {
        ctx.session.chatId = ctx.chat.id;
        const {chatId, time, latitude, longitude, offset} = ctx.session;

        await this.database.createOrUpdateUser(chatId, time, latitude, longitude, offset);
        this.logger.logInfo(`User ${ctx.message.from.first_name} saved to db`);

        await ctx.reply(`Cool! Your subscription is set ✔️`);

        await ctx.scene.leave();
        this.logger.logInfo(`User ${ctx.message.from.first_name} exited the scene`);
      } catch (err) {
        await ctx.reply(`An error occurred... Please try again with /subscribe command`);
        await ctx.scene.leave();
      }
    });

    this.scene.hears('/cancel', async ctx => {
      await ctx.scene.leave();
      await ctx.reply('Exited the process 🤚');

      this.logger.logInfo(`User ${ctx.message.from.first_name} exited the scene`);
    });
  }

  getScene() {
    this.createScene();
    return this.scene;
  }
}
