"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandsDescription = exports.Commands = exports.BotResponse = exports.RegExpTriggers = exports.ScenesId = exports.WeatherGroup = exports.WeatherAPI = exports.LoggerOptions = exports.EnvironmentVariableKeys = void 0;
var EnvironmentVariableKeys;
(function (EnvironmentVariableKeys) {
    EnvironmentVariableKeys["NODE_ENV"] = "NODE_ENV";
    EnvironmentVariableKeys["TZ"] = "TZ";
    EnvironmentVariableKeys["CRON_TIME"] = "CRON_TIME";
    EnvironmentVariableKeys["TELEGRAM_BOT_TOKEN"] = "TELEGRAM_BOT_TOKEN";
    EnvironmentVariableKeys["PRETTY_LOGGING"] = "PRETTY_LOGGING";
    EnvironmentVariableKeys["WEATHER_API_KEY"] = "WEATHER_API_KEY";
    EnvironmentVariableKeys["MONGO_DB_STRING"] = "MONGO_DB_STRING";
    EnvironmentVariableKeys["GOOGLE_MAPS_API_KEY"] = "GOOGLE_MAPS_API_KEY";
})(EnvironmentVariableKeys || (exports.EnvironmentVariableKeys = EnvironmentVariableKeys = {}));
var LoggerOptions;
(function (LoggerOptions) {
    LoggerOptions["DEVELOPMENT"] = "development";
    LoggerOptions["PINO_PRETTY"] = "pino-pretty";
    LoggerOptions["PINO_FILE"] = "pino/file";
    LoggerOptions["LOG_PATH"] = "src/logs/logs";
    LoggerOptions["IGNORE_FIELDS"] = "pid,hostname";
    LoggerOptions["LEVEL_INFO"] = "info";
})(LoggerOptions || (exports.LoggerOptions = LoggerOptions = {}));
var WeatherAPI;
(function (WeatherAPI) {
    WeatherAPI["BASE_URL"] = "https://api.openweathermap.org/";
})(WeatherAPI || (exports.WeatherAPI = WeatherAPI = {}));
exports.WeatherGroup = {
    Thunderstorm: '⚡️',
    Clouds: '☁️',
    Clear: '☀️',
    Atmosphere: '🌈',
    Snow: '❄️',
    Rain: '🌧',
    Drizzle: '🥶',
    Mist: '☁',
};
var ScenesId;
(function (ScenesId) {
    ScenesId["WEATHER_SCENE"] = "weatherScene";
})(ScenesId || (exports.ScenesId = ScenesId = {}));
exports.RegExpTriggers = {
    TIME_INPUT: /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
};
var BotResponse;
(function (BotResponse) {
    BotResponse["START"] = "I will help you be aware of the weather every day.\nTo find available commands use bot menu or keyboard below \uD83D\uDCF2";
    BotResponse["CHECK"] = "Next weather update coming at: \u231A";
    BotResponse["NO_SUBSCRIPTION"] = "You have not subscribed yet.\nTo subscribe use /subscribe";
    BotResponse["SHARE_LOCATION"] = "Share your location with button below \uD83D\uDCF2";
    BotResponse["SHARE_BUTTON"] = "Send my location \uD83D\uDCCD";
    BotResponse["WEATHER_FETCH_ERROR"] = "An error occurred.\nTry again later with /subscribe";
    BotResponse["ALREADY_SUBSCRIBE"] = "You already have subscription.\nTo update data use /update";
    BotResponse["UNSUBSCRIBE"] = "Your subscription has been declined \uD83D\uDD15";
    BotResponse["TIME_INPUT"] = "Enter desired time \u231B in HH:MM format\nor use keyboard below \u2B07\uFE0F\n(or /cancel to exit)";
    BotResponse["SUBMIT_SUBSCRIPTION"] = "Good. Submit to subscribe \u2B07\uFE0F\n(or /cancel to exit)";
    BotResponse["SUBSCRIBED"] = "Cool! Your subscription is set at: \u2714\uFE0F";
    BotResponse["SCENE_EXIT"] = "Exited the process \uD83E\uDD1A";
    BotResponse["SUBSCRIBE_BUTTON"] = "Subscribe \uD83D\uDD14";
})(BotResponse || (exports.BotResponse = BotResponse = {}));
var Commands;
(function (Commands) {
    Commands["START"] = "start";
    Commands["WEATHER"] = "weather";
    Commands["CHECK"] = "check";
    Commands["SUBSCRIBE"] = "subscribe";
    Commands["UNSUBSCRIBE"] = "unsubscribe";
    Commands["UPDATE"] = "update";
})(Commands || (exports.Commands = Commands = {}));
var CommandsDescription;
(function (CommandsDescription) {
    CommandsDescription["START"] = "Start the bot";
    CommandsDescription["WEATHER"] = "Get current weather";
    CommandsDescription["CHECK"] = "Check subscription status";
    CommandsDescription["SUBSCRIBE"] = "Get daily weather updates";
    CommandsDescription["UNSUBSCRIBE"] = "Stop getting weather updates";
    CommandsDescription["UPDATE"] = "Update subscription data";
})(CommandsDescription || (exports.CommandsDescription = CommandsDescription = {}));
