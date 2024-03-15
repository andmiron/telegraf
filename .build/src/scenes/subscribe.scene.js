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
exports.SubscribeScene = void 0;
const scene_creator_1 = require("./scene.creator");
const telegraf_1 = require("telegraf");
const types_1 = require("../types/types");
const scenes_1 = require("telegraf/scenes");
const timeConverter_class_1 = require("../utils/timeConverter.class");
class SubscribeScene extends scene_creator_1.SceneCreator {
    constructor(sceneId, database, logger) {
        super();
        this.scene = new scenes_1.BaseScene(sceneId);
        this.database = database;
        this.logger = logger;
    }
    createScene() {
        this.scene.enter((ctx) => __awaiter(this, void 0, void 0, function* () {
            this.logger.logInfo(`User ${ctx.message.from.first_name} entered the scene`);
            const keyboardButtons = [];
            for (let hour = 0; hour < 24; hour++) {
                keyboardButtons.push(telegraf_1.Markup.button.text(`${hour < 10 ? `0${hour}` : hour}:00`));
            }
            const replyKeyboard = telegraf_1.Markup.keyboard(keyboardButtons, { columns: 3 }).resize().oneTime().placeholder('HH:MM');
            yield ctx.reply(types_1.BotResponse.TIME_INPUT, replyKeyboard);
        }));
        this.scene.hears(types_1.RegExpTriggers['TIME_INPUT'], (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.scene.session.time = (0, timeConverter_class_1.convertHoursStringToMinutes)(ctx.message.text);
            ctx.scene.session.timeInput = ctx.message.text;
            yield ctx.reply(types_1.BotResponse.SHARE_LOCATION, telegraf_1.Markup.keyboard([telegraf_1.Markup.button.locationRequest(types_1.BotResponse.SHARE_BUTTON), telegraf_1.Markup.button.text('/cancel')])
                .resize()
                .oneTime());
        }));
        this.scene.on('location', (ctx) => __awaiter(this, void 0, void 0, function* () {
            const { latitude, longitude } = ctx.message.location;
            ctx.scene.session.latitude = latitude;
            ctx.scene.session.longitude = longitude;
            ctx.scene.session.offset = yield (0, timeConverter_class_1.getUtcOffsetMinutesFromCoordinates)(latitude, longitude);
            yield ctx.reply(types_1.BotResponse.SUBMIT_SUBSCRIPTION, telegraf_1.Markup.keyboard([telegraf_1.Markup.button.text(types_1.BotResponse.SUBSCRIBE_BUTTON), telegraf_1.Markup.button.text('/cancel')])
                .resize()
                .oneTime());
        }));
        this.scene.hears(types_1.BotResponse.SUBSCRIBE_BUTTON, (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                ctx.scene.session.chatId = ctx.chat.id;
                const userData = {
                    time: ctx.scene.session.time,
                    timeInput: ctx.scene.session.timeInput,
                    latitude: ctx.scene.session.latitude,
                    longitude: ctx.scene.session.longitude,
                    offset: ctx.scene.session.offset,
                    chatId: ctx.scene.session.chatId,
                };
                yield this.database.upsert(userData);
                this.logger.logInfo(`User ${ctx.message.from.first_name} saved to db`);
                yield ctx.reply(types_1.BotResponse.SUBSCRIBED + ctx.scene.session.timeInput);
                yield ctx.scene.leave();
                this.logger.logInfo(`User ${ctx.message.from.first_name} exited the scene`);
            }
            catch (err) {
                this.logger.logError('Error saving the user to db!');
                yield ctx.reply(types_1.BotResponse.WEATHER_FETCH_ERROR);
                yield ctx.scene.leave();
            }
        }));
        this.scene.hears('/cancel', (ctx) => __awaiter(this, void 0, void 0, function* () {
            yield ctx.scene.leave();
            yield ctx.reply(types_1.BotResponse.SCENE_EXIT);
            this.logger.logInfo(`User ${ctx.message.from.first_name} exited the scene`);
        }));
    }
    getScene() {
        this.createScene();
        return this.scene;
    }
}
exports.SubscribeScene = SubscribeScene;
