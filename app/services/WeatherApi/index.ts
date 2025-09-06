import axios from 'axios';
import { WeatherData } from '@/app/store/types';
import { API_CONFIG } from '@/app/config/api';

export const fetchWeatherData = async (city: string): Promise<WeatherData> => {
 try {
  const response = await axios.get(
   `${API_CONFIG.OPENWEATHER.BASE_URL}/weather`,
   {
    params: {
     q: city,
     appid: API_CONFIG.OPENWEATHER.API_KEY,
     units: API_CONFIG.OPENWEATHER.UNITS,
    },
   },
  );

  return response.data;
 } catch (error) {
  if (axios.isAxiosError(error)) {
   if (error.response?.status === 404) {
    throw new Error('City not found');
   }
   if (error.response?.status === 401) {
    throw new Error('Invalid API key');
   }
   throw new Error('Failed to fetch weather data');
  }
  throw error;
 }
};
