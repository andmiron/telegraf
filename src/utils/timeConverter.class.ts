import {ConfigService} from '../services/config.service.js';
import {EnvironmentVariableKeys} from '../types/types.js';
import axios from 'axios';

export class TimeConverterClass {
  convertHoursStringToMinutes(time: string): number {
    const [hours, minutes] = time.split(':');
    return parseInt(hours) * 60 + parseInt(minutes);
  }

  async getUtcOffsetMinutesFromCoordinates(lat: number, lng: number) {
    const apiKey = new ConfigService().getToken(EnvironmentVariableKeys.GOOGLE_MAPS_API_KEY);
    const timestamp = Math.floor(Date.now() / 1000);

    const requestString = `https://maps.googleapis.com/maps/api/timezone/json?location=${+lat}%2C${+lng}&timestamp=${+timestamp}&key=${apiKey}`;
    const axiosResponse = await axios.get(requestString);

    const {rawOffset, dstOffset} = axiosResponse.data;

    return rawOffset / 60 + dstOffset / 60;
  }
}
