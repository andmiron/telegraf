export enum EnvironmentVariableKeys {
  NODE_ENV = 'NODE_ENV',
  TZ = 'TZ',
  TELEGRAM_BOT_TOKEN = 'TELEGRAM_BOT_TOKEN',
  PRETTY_LOGGING = 'PRETTY_LOGGING',
  WEATHER_API_KEY = 'WEATHER_API_KEY',
  MONGO_DB_STRING = 'MONGO_DB_STRING',
  GOOGLE_MAPS_API_KEY = 'GOOGLE_MAPS_API_KEY',
}

export enum LoggerOptions {
  DEVELOPMENT = 'development',
  PINO_PRETTY = 'pino-pretty',
  PINO_FILE = 'pino/file',
  LOG_PATH = 'src/logs/logs.json',
  IGNORE_FIELDS = 'pid,hostname',
  LEVEL_INFO = 'info',
}

export enum WeatherAPI {
  BASE_URL = 'https://api.openweathermap.org/',
}

export const WeatherGroup: Record<string, string> = {
  Thunderstorm: '⚡️',
  Clouds: '☁️',
  Clear: '☀️',
  Atmosphere: '🌈',
  Snow: '❄️',
  Rain: '🌧',
  Drizzle: '🥶',
};
