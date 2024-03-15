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
exports.TelegrafService = void 0;
require("dotenv/config");
const telegraf_1 = require("telegraf");
const logger_service_1 = require("./logger.service");
const database_service_1 = require("../db/database.service");
const cron_service_1 = require("./cron.service");
const scenes_1 = require("telegraf/scenes");
const subscribe_command_1 = require("../commands/subscribe.command");
const types_1 = require("../types/types");
const unsubscribe_command_1 = require("../commands/unsubscribe.command");
const update_command_1 = require("../commands/update.command");
const check_command_1 = require("../commands/check.command");
const subscribe_scene_1 = require("../scenes/subscribe.scene");
const start_command_1 = require("../commands/start.command");
const getWeather_command_1 = require("../commands/getWeather.command");
const weather_client_1 = require("./weather.client");
class TelegrafService {
    constructor() {
        this.loggerService = new logger_service_1.LoggerService();
        this.databaseService = new database_service_1.DatabaseService();
        this.weatherClient = new weather_client_1.WeatherClient();
        this.bot = new telegraf_1.Telegraf(process.env[types_1.EnvironmentVariableKeys.TELEGRAM_BOT_TOKEN]);
        this.cron = new cron_service_1.CronService(this.databaseService, this.weatherClient, this.loggerService, this.bot);
        this.commands = [];
        this.scenes = [];
    }
    registerCommands() {
        this.commands.push(new start_command_1.StartCommand(types_1.Commands.START, types_1.CommandsDescription.START, this.bot));
        this.commands.push(new getWeather_command_1.GetWeatherCommand(types_1.Commands.WEATHER, types_1.CommandsDescription.WEATHER, this.bot, this.weatherClient));
        this.commands.push(new subscribe_command_1.SubscribeCommand(types_1.Commands.SUBSCRIBE, types_1.CommandsDescription.SUBSCRIBE, this.bot, this.databaseService));
        this.commands.push(new unsubscribe_command_1.UnsubscribeCommand(types_1.Commands.UNSUBSCRIBE, types_1.CommandsDescription.UNSUBSCRIBE, this.bot, this.databaseService, this.loggerService));
        this.commands.push(new update_command_1.UpdateCommand(types_1.Commands.UPDATE, types_1.CommandsDescription.UPDATE, this.bot, this.databaseService));
        this.commands.push(new check_command_1.CheckCommand(types_1.Commands.CHECK, types_1.CommandsDescription.CHECK, this.bot, this.databaseService));
    }
    registerScenes() {
        this.scenes.push(new subscribe_scene_1.SubscribeScene(types_1.ScenesId.WEATHER_SCENE, this.databaseService, this.loggerService).getScene());
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
        const stage = new scenes_1.Stage(this.scenes);
        this.bot.use(stage.middleware());
    }
    registerMiddlewares() {
        this.bot.use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
            this.loggerService.logInfo(`${ctx.message.from.first_name}:${ctx.chat.id} sent ${ctx.updateType}`);
            yield next();
        }));
        this.bot.use((0, telegraf_1.session)());
    }
    startCronJob() {
        this.cron.start();
    }
    connectDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.databaseService.connectDb(process.env[types_1.EnvironmentVariableKeys.MONGO_DB_STRING]);
                this.loggerService.logInfo('database connected');
            }
            catch (err) {
                this.loggerService.logError('database connection error');
            }
        });
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
    handleUpdate(event) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.bot.handleUpdate(JSON.parse(event.body));
        });
    }
}
exports.TelegrafService = TelegrafService;
