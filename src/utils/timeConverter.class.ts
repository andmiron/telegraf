import { EnvironmentVariableKeys } from '../types/types';
import axios from 'axios';

export function convertHoursStringToMinutes(time: string): number {
   const [hours, minutes] = time.split(':');
   return parseInt(hours) * 60 + parseInt(minutes);
}

export function isMinuteToRunCron(userTime: number, offset: number): boolean {
   const currentMinute = new Date().getHours() * 60 + new Date().getMinutes();
   const userTimeUtc = userTime - offset < 0 ? userTime - offset + 1440 : userTime - offset;
   return currentMinute === userTimeUtc;
}

export async function getUtcOffsetMinutesFromCoordinates(lat: number, lng: number) {
   const apiKey = process.env[EnvironmentVariableKeys.GOOGLE_MAPS_API_KEY]!;
   const timestamp = Math.floor(Date.now() / 1000);

   const requestString = `https://maps.googleapis.com/maps/api/timezone/json?location=${+lat}%2C${+lng}&timestamp=${+timestamp}&key=${apiKey}`;
   try {
      const axiosResponse = await axios.get(requestString);
      const { rawOffset, dstOffset } = axiosResponse.data;
      return rawOffset / 60 + dstOffset / 60;
   } catch (err) {
      throw new Error('Google Maps API error!');
   }
}
