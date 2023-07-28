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

export enum ScenesId {
  WEATHER_SCENE = 'weatherScene',
}

export enum BotResponse {
  START = 'I will help you be aware of the weather every day.\nTo find available commands use bot menu or keyboard below 📲',
  CHECK = 'Next weather update coming at: ⌚',
  NO_SUBSCRIPTION = 'You have not subscribed yet.\nTo subscribe use /subscribe',
  SHARE_LOCATION = 'Share your location with button below 📲',
  SHARE_BUTTON = 'Send my location 📍',
  WEATHER_FETCH_ERROR = 'An error occurred.\nTry again later with /subscribe',
  ALREADY_SUBSCRIBE = `You already have subscription.\nTo update data use /update`,
  UNSUBSCRIBE = 'Your subscription has been declined 🔕',
  TIME_INPUT = 'Enter desired time ⌛ in HH:MM format\nor use keyboard below ⬇️\n(or /cancel to exit)',
  SUBMIT_SUBSCRIPTION = `Good. Submit to subscribe ⬇️\n(or /cancel to exit)`,
  SUBSCRIBED = `Cool! Your subscription is set at ✔️`,
  SCENE_EXIT = 'Exited the process 🤚',
}
