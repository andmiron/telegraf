"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetWeatherCommand = void 0;
const telegraf_1 = require("telegraf");
const types_1 = require("../types/types");
const string_generator_1 = require("../utils/string.generator");
class GetWeatherCommand {
    constructor(command, description, bot, weatherClient) {
        this.command = command;
        this.description = description;
        this.bot = bot;
        this.weatherClient = weatherClient;
    }
    execute() {
        this.bot.command(this.command, (ctx) => __awaiter(this, void 0, void 0, function* () {
            yield ctx.reply(types_1.BotResponse.SHARE_LOCATION, telegraf_1.Markup.keyboard([telegraf_1.Markup.button.locationRequest(types_1.BotResponse.SHARE_BUTTON)])
                .resize()
                .oneTime());
        }));
        this.bot.on('location', (ctx) => __awaiter(this, void 0, void 0, function* () {
            const { latitude, longitude } = ctx.message.location;
            const weatherData = yield this.weatherClient.getForecast(latitude, longitude);
            if (weatherData) {
                const weatherMessage = (0, string_generator_1.generateWeatherString)(weatherData);
                yield ctx.reply(weatherMessage, {
                    reply_markup: {
                        remove_keyboard: true,
                    },
                });
            }
            else {
                yield ctx.reply(types_1.BotResponse.WEATHER_FETCH_ERROR);
            }
        }));
    }
}
exports.GetWeatherCommand = GetWeatherCommand;
