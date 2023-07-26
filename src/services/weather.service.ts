import {ConfigService} from './config.service.js';
import {EnvironmentVariableKeys, WeatherAPI} from '../types/types.js';
import axios from 'axios';

class WeatherService {
  private readonly apiKey: string;
  constructor() {
    this.apiKey = new ConfigService().getToken(EnvironmentVariableKeys.WEATHER_API_KEY);
  }

  async getForecast(lat: string, lon: string) {
    const urlString = `${
      WeatherAPI.BASE_URL
    }data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=${1}&appid=${this.apiKey}`;

    try {
      const response = await axios.get(urlString);

      const weatherData = response.data.list;
      console.log(weatherData);
    } catch (err) {}
  }
}
