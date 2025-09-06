import { API_CONFIG } from '@/app/config/api';
import { CitySuggestion } from './types';

export const fetchCitySuggestions = async (
 query: string,
 limit: number = 5,
): Promise<CitySuggestion[]> => {
 if (!query || query.length < 2) {
  return [];
 }

 try {
  const response = await fetch(
   `${API_CONFIG.OPENWEATHER.GEOCODING_URL}/direct?q=${encodeURIComponent(
    query,
   )}&limit=${limit}&appid=${API_CONFIG.OPENWEATHER.API_KEY}`,
  );

  if (!response.ok) {
   throw new Error('Failed to fetch city suggestions');
  }

  const data = await response.json();

  return data.map((item: any) => ({
   name: item.name,
   country: item.country,
   state: item.state,
   lat: item.lat,
   lon: item.lon,
  }));
 } catch (error) {
  console.error('Error fetching city suggestions:', error);
  return [];
 }
};
