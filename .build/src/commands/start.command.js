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
exports.StartCommand = void 0;
const telegraf_1 = require("telegraf");
const types_1 = require("../types/types");
class StartCommand {
    constructor(command, description, bot) {
        this.command = command;
        this.description = description;
        this.bot = bot;
    }
    execute() {
        this.bot.command(this.command, (ctx) => __awaiter(this, void 0, void 0, function* () {
            const commands = yield ctx.telegram.getMyCommands();
            const replyKeyboard = [];
            for (const command of commands) {
                replyKeyboard.push(telegraf_1.Markup.button.text(`/${command.command}`));
            }
            yield ctx.reply(types_1.BotResponse.START, telegraf_1.Markup.keyboard(replyKeyboard).resize());
        }));
    }
}
exports.StartCommand = StartCommand;
