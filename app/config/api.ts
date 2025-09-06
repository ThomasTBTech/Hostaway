export const API_CONFIG = {
 OPENWEATHER: {
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  GEOCODING_URL: 'https://api.openweathermap.org/geo/1.0',
  API_KEY: 'e8a74c17daf2d2008a256eb9856ce9c6', // This would be in a .env file otherwise
  UNITS: 'metric', // Defaulting to metric for temperature
 },
};

export const getApiKey = (): string => {
 return API_CONFIG.OPENWEATHER.API_KEY;
};
