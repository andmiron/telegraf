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
exports.WeatherClient = void 0;
const types_1 = require("../types/types");
const axios_1 = __importDefault(require("axios"));
const moment_1 = __importDefault(require("moment/moment"));
class WeatherClient {
    constructor() {
        this.apiKey = process.env[types_1.EnvironmentVariableKeys.WEATHER_API_KEY];
    }
    getForecast(lat, lon) {
        return __awaiter(this, void 0, void 0, function* () {
            const urlString = `${types_1.WeatherAPI.BASE_URL}data/2.5/weather?lat=${+lat}&lon=${+lon}&appid=${this.apiKey}`;
            try {
                const response = yield axios_1.default.get(urlString);
                const weatherData = response.data;
                const { name: cityName } = weatherData;
                const { description: weatherDescription, main: weatherGroup } = weatherData.weather[0];
                const minTemp = Math.ceil(weatherData.main.temp_min - 273);
                const maxTemp = Math.ceil(weatherData.main.temp_max - 273);
                const feels_like = Math.ceil(weatherData.main.feels_like - 273);
                const humidity = weatherData.main.humidity;
                const windSpeed = weatherData.wind.speed;
                const icon = types_1.WeatherGroup[weatherGroup];
                const sunset = moment_1.default.unix(weatherData.sys.sunset + weatherData.timezone).format('HH:mm');
                const sunrise = moment_1.default.unix(weatherData.sys.sunrise + weatherData.timezone).format('HH:mm');
                const weatherObject = {
                    cityName,
                    weatherDescription,
                    weatherGroup,
                    minTemp,
                    maxTemp,
                    feels_like,
                    humidity,
                    windSpeed,
                    icon,
                    sunset,
                    sunrise,
                };
                return weatherObject;
            }
            catch (err) {
                throw new Error('Weather client error!');
            }
        });
    }
}
exports.WeatherClient = WeatherClient;
