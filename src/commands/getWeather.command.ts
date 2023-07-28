import {BotCommandInterface} from './bot.command.interface.js';
import {Markup, Scenes, Telegraf} from 'telegraf';
import {WeatherService} from '../services/weather.service.js';

export class GetWeatherCommand implements BotCommandInterface {
  command: string;
  description: string;

  private bot: Telegraf<Scenes.SceneContext>;
  private weatherService: WeatherService;

  constructor(
    command: string,
    description: string,
    bot: Telegraf<Scenes.SceneContext>,
    weatherService: WeatherService
  ) {
    this.command = command;
    this.description = description;
    this.bot = bot;
    this.weatherService = weatherService;
  }

  execute() {
    this.bot.command(this.command, async ctx => {
      await ctx.reply(
        'Share your location with button below 📲',
        Markup.keyboard([Markup.button.locationRequest('Send my location 📍')])
          .resize()
          .oneTime()
      );
    });

    this.bot.on('location', async ctx => {
      const {latitude, longitude} = ctx.message.location;

      const weatherData = await this.weatherService.getForecast(latitude, longitude);

      await ctx.reply(weatherData ?? 'Weather data unavailable. Try again later.', {
        reply_markup: {
          remove_keyboard: true,
        },
      });
    });
  }
}
