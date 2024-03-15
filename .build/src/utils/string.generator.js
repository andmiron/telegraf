"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWeatherString = void 0;
function generateWeatherString(weatherObject) {
    const { cityName, icon, weatherDescription, sunrise, sunset, maxTemp, minTemp, feels_like, humidity, windSpeed } = weatherObject;
    return `Today in ${cityName}: ${icon} ${weatherDescription}\nSunrise: 🌄 at ${sunrise}\nSunset: 🌇 at ${sunset}\nMaximum temperature: 🔼 ${maxTemp}℃\nMinimal temperature: 🔽 ${minTemp}℃\nIt feels like: 🌡️ ${feels_like}℃\nHumidity level: 💧 ${humidity}%\nWind speed: 🍃 ${windSpeed} m/s`;
}
exports.generateWeatherString = generateWeatherString;
