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
exports.CronService = void 0;
const cron_1 = require("cron");
const types_1 = require("../types/types");
const string_generator_1 = require("../utils/string.generator");
const timeConverter_class_1 = require("../utils/timeConverter.class");
class CronService {
    constructor(databaseService, weatherClient, loggerService, bot) {
        this.onTick = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.databaseService.findAllUsers();
                for (const user of users) {
                    const weatherData = yield this.weatherClient.getForecast(user.latitude, user.longitude);
                    if ((0, timeConverter_class_1.isMinuteToRunCron)(user.time, user.offset) && weatherData) {
                        const weatherString = (0, string_generator_1.generateWeatherString)(weatherData);
                        yield this.bot.telegram.sendMessage(user.chatId, weatherString);
                        this.loggerService.logInfo(`Chat ${user.chatId} received weather update.`);
                    }
                    if (!weatherData) {
                        yield this.bot.telegram.sendMessage(user.chatId, types_1.BotResponse.WEATHER_FETCH_ERROR);
                    }
                }
            }
            catch (err) {
                this.loggerService.logError('Cron job error!');
            }
        });
        this.databaseService = databaseService;
        this.weatherClient = weatherClient;
        this.loggerService = loggerService;
        this.bot = bot;
    }
    start() {
        new cron_1.CronJob(process.env[types_1.EnvironmentVariableKeys.CRON_TIME], this.onTick, null, true, process.env[types_1.EnvironmentVariableKeys.TZ]);
    }
}
exports.CronService = CronService;
