import {Composer, Markup, Scenes} from 'telegraf';
import {KeyboardButton} from 'typegram';
import {IBotContext} from '../types/types.js';

export class SceneCreator {
  createWeatherScene() {
    const weatherScene = new Scenes.BaseScene<IBotContext>('weatherScene');

    const step1 = new Composer();
    step1.action('subscribe', async ctx => {
      await ctx.reply(
        'First share your location',
        Markup.keyboard([Markup.button.locationRequest('Your location 📍')])
          .resize()
          .oneTime()
      );
    });

    const step2 = new Composer();
    step2.on('location', async ctx => {
      const {longitude, latitude} = ctx.message.location;
      console.log(longitude, latitude);

      const keyboardButtons: KeyboardButton[] = [];
      const replyKeyboard = Markup.keyboard(keyboardButtons)
        .resize()
        .oneTime()
        .placeholder('Choose time');

      for (let hour = 0; hour < 24; hour++) {
        keyboardButtons.push(Markup.button.text(`${hour < 10 ? `0${hour}` : hour}`));
      }

      await ctx.reply('Choose time', replyKeyboard);
    });

    return weatherScene;
  }
}
