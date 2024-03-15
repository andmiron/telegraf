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
exports.SubscribeCommand = void 0;
const types_1 = require("../types/types");
class SubscribeCommand {
    constructor(command, description, bot, database) {
        this.command = command;
        this.description = description;
        this.bot = bot;
        this.database = database;
    }
    execute() {
        this.bot.command(this.command, (ctx) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.database.findUser(ctx.from.id);
            if (!user) {
                yield ctx.scene.enter(types_1.ScenesId.WEATHER_SCENE);
            }
            else {
                yield ctx.reply(types_1.BotResponse.ALREADY_SUBSCRIBE);
            }
        }));
    }
}
exports.SubscribeCommand = SubscribeCommand;
