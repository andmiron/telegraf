import {ConfigService} from './config.service.js';
import {EnvironmentVariableKeys, WeatherAPI, WeatherDto, WeatherGroup} from '../types/types.js';
import axios from 'axios';
import {LoggerService} from './logger.service.js';
import moment from 'moment/moment.js';

export class WeatherClient {
  private readonly apiKey: string;
  constructor() {
    this.apiKey = new ConfigService().getToken(EnvironmentVariableKeys.WEATHER_API_KEY);
  }

  async getForecast(lat: number, lon: number) {
    const urlString = `${WeatherAPI.BASE_URL}data/2.5/weather?lat=${+lat}&lon=${+lon}&appid=${
      this.apiKey
    }`;

    try {
      const response = await axios.get(urlString);

      const weatherData = response.data;

      const {name: cityName} = weatherData;
      const {description: weatherDescription, main: weatherGroup} = weatherData.weather[0];
      const minTemp = Math.ceil(weatherData.main.temp_min - 273);
      const maxTemp = Math.ceil(weatherData.main.temp_max - 273);
      const feels_like = Math.ceil(weatherData.main.feels_like - 273);
      const humidity = weatherData.main.humidity;
      const windSpeed = weatherData.wind.speed;
      const icon = WeatherGroup[weatherGroup];
      const sunset = moment.unix(weatherData.sys.sunset + weatherData.timezone).format('HH:mm');
      const sunrise = moment.unix(weatherData.sys.sunrise + weatherData.timezone).format('HH:mm');

      const weatherObject: WeatherDto = {
        cityName: cityName,
        weatherDescription: weatherDescription,
        weatherGroup: weatherGroup,
        minTemp: minTemp,
        maxTemp: maxTemp,
        feels_like: feels_like,
        humidity: humidity,
        windSpeed: windSpeed,
        icon: icon,
        sunset: sunset,
        sunrise: sunrise,
      };

      return weatherObject;
    } catch (err) {
      new LoggerService().logError(err as Error);
    }
  }
}
