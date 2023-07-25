import {BaseScene} from 'telegraf/scenes';
import {Markup, Scenes} from 'telegraf';
import {KeyboardButton} from 'typegram';

export class SceneCreator {
  createWeatherScene() {
    const weatherBaseScene = new BaseScene<Scenes.SceneContext>('weatherScene');

    weatherBaseScene.enter(async ctx => {
      const keyboardButtons: KeyboardButton[] = [];

      for (let hour = 0; hour < 24; hour++) {
        keyboardButtons.push(Markup.button.text(`${hour < 10 ? `0${hour}` : hour}:00`));
      }

      const replyKeyboard = Markup.keyboard(keyboardButtons, {columns: 4})
        .resize()
        .oneTime()
        .placeholder('Time in HH:MM format');

      await ctx.deleteMessage();
      await ctx.reply('Choose time:', replyKeyboard);
    });

    weatherBaseScene.hears(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, async ctx => {
      await ctx.reply(
        'Thanks. Now share your location:',
        Markup.keyboard([Markup.button.locationRequest('Location 📍')])
          .resize()
          .oneTime()
      );
    });

    weatherBaseScene.on('location', async ctx => {
      const {latitude, longitude} = ctx.message.location;
      await ctx.reply(`Thanks. You are here ${latitude}, ${longitude}`);
    });

    return weatherBaseScene;
  }
}
