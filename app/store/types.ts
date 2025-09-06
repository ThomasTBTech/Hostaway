export interface WeatherData {
 name: string;
 main: {
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
 };
 weather: Array<{
  main: string;
  description: string;
  icon: string;
 }>;
 wind: {
  speed: number;
 };
}

export interface ForecastData {
 dt: number;
 main: {
  temp: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
 };
 weather: Array<{
  main: string;
  description: string;
  icon: string;
 }>;
 dt_txt: string;
}

export interface WeatherState {
 data: WeatherData | null;
 loading: boolean;
 error: string | null;
 recentSearches: string[];
 weatherCache: Record<string, WeatherData>;
 forecastCache: Record<string, ForecastData[]>;
 lastFetchTime: Record<string, number>;
}
