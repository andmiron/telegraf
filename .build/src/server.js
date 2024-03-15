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
exports.cron = exports.handler = void 0;
const telegraf_service_1 = require("./services/telegraf.service");
const bot = new telegraf_service_1.TelegrafService();
bot.registerCommands();
bot.createCommandsMenu();
bot.registerScenes();
bot.registerMiddlewares();
bot.createStage();
bot.handleCommands();
function handler(event) {
    return __awaiter(this, void 0, void 0, function* () {
        yield bot.connectDatabase();
        yield bot.handleUpdate(event);
        return {
            statusCode: 200,
        };
    });
}
exports.handler = handler;
function cron() {
    return __awaiter(this, void 0, void 0, function* () {
        yield bot.connectDatabase();
        bot.startCronJob();
    });
}
exports.cron = cron;
