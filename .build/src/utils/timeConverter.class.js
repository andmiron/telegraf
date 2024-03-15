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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUtcOffsetMinutesFromCoordinates = exports.isMinuteToRunCron = exports.convertHoursStringToMinutes = void 0;
const types_1 = require("../types/types");
const axios_1 = __importDefault(require("axios"));
function convertHoursStringToMinutes(time) {
    const [hours, minutes] = time.split(':');
    return parseInt(hours) * 60 + parseInt(minutes);
}
exports.convertHoursStringToMinutes = convertHoursStringToMinutes;
function isMinuteToRunCron(userTime, offset) {
    const currentMinute = new Date().getHours() * 60 + new Date().getMinutes();
    const userTimeUtc = userTime - offset < 0 ? userTime - offset + 1440 : userTime - offset;
    return currentMinute === userTimeUtc;
}
exports.isMinuteToRunCron = isMinuteToRunCron;
function getUtcOffsetMinutesFromCoordinates(lat, lng) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiKey = process.env[types_1.EnvironmentVariableKeys.GOOGLE_MAPS_API_KEY];
        const timestamp = Math.floor(Date.now() / 1000);
        const requestString = `https://maps.googleapis.com/maps/api/timezone/json?location=${+lat}%2C${+lng}&timestamp=${+timestamp}&key=${apiKey}`;
        try {
            const axiosResponse = yield axios_1.default.get(requestString);
            const { rawOffset, dstOffset } = axiosResponse.data;
            return rawOffset / 60 + dstOffset / 60;
        }
        catch (err) {
            throw new Error('Google Maps API error!');
        }
    });
}
exports.getUtcOffsetMinutesFromCoordinates = getUtcOffsetMinutesFromCoordinates;
