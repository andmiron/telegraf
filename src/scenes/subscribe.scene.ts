import {SceneCreator} from './scene.creator.js';
import {BaseScene} from 'telegraf/scenes';
import {KeyboardButton} from 'typegram';
import {Markup} from 'telegraf';

export class SubscribeScene extends SceneCreator {
  private scene: BaseScene<any>;
  constructor(sceneId: string) {
    super();
    this.scene = new BaseScene<any>(sceneId);
  }

  createScene() {
    this.scene.enter(async ctx => {
      this.logger.logInfo(`User ${ctx.from.username} entered the scene`);

      const keyboardButtons: KeyboardButton[] = [];

      for (let hour = 0; hour < 24; hour++) {
        keyboardButtons.push(Markup.button.text(`${hour < 10 ? `0${hour}` : hour}:00`));
      }

      const replyKeyboard = Markup.keyboard(keyboardButtons, {columns: 3})
        .resize()
        .oneTime()
        .placeholder('HH:MM');

      await ctx.reply(
        'Enter desired time in HH:MM format\nor use keyboard below ⌛\n(or /cancel to exit)',
        replyKeyboard
      );
    });

    this.scene.hears(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, async ctx => {
      ctx.session.time = ctx.message.text;

      await ctx.reply(
        `Your time is ${ctx.session.time}.\nNow share your location 📍\n(or /cancel to exit)`,
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

      await ctx.reply(
        `Good. Submit to subscribe\n(or /cancel to exit)`,
        Markup.keyboard([Markup.button.text('Subscribe 🔔'), Markup.button.text('/cancel')])
          .resize()
          .oneTime()
      );
    });

    this.scene.hears('Subscribe 🔔', async ctx => {
      try {
        ctx.session.userId = ctx.from!.id;
        const {userId, time, latitude, longitude} = ctx.session;

        await this.dbInstance.createOrUpdateUser(userId, time, latitude, longitude);
        this.logger.logInfo(`User ${ctx.session.userId} saved to db`);

        await ctx.reply("Cool! You've been subscribed ✅");

        await ctx.scene.leave();
        this.logger.logInfo(`User ${ctx.from.username} exited the scene`);
      } catch (err) {
        await ctx.reply(`An error occurred... Please try again with /subscribe command`);
        await ctx.scene.leave();
      }
    });

    this.scene.hears('/cancel', async ctx => {
      await ctx.scene.leave();
      await ctx.reply('Exited the process 🤚');

      this.logger.logInfo(`User ${ctx.from.username} exited the scene`);
    });
  }

  getScene() {
    this.createScene();
    return this.scene;
  }
}
