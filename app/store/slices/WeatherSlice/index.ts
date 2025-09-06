import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchWeatherData } from '@/app/services/WeatherApi/';
import { WeatherState, WeatherData, ForecastData } from '../../types';

const initialState: WeatherState = {
 data: null,
 loading: false,
 error: null,
 recentSearches: [],
 weatherCache: {},
 forecastCache: {},
 lastFetchTime: {},
};

export const fetchWeather = createAsyncThunk(
 'weather/fetchWeather',
 async (city: string, { getState }) => {
  const state = getState() as { weather: WeatherState };
  const cityKey = city.toLowerCase();
  const now = Date.now();
  const CACHE_DURATION = 30000;

  // Check if we have cached data and it's recent enough
  if (
   state.weather.weatherCache[cityKey] &&
   state.weather.lastFetchTime[cityKey] &&
   now - state.weather.lastFetchTime[cityKey] < CACHE_DURATION
  ) {
   return state.weather.weatherCache[cityKey];
  }

  console.debug('🔄 Fetching fresh weather data for:', city);
  const response = await fetchWeatherData(city);
  return response;
 },
);

export const refreshWeather = createAsyncThunk(
 'weather/refreshWeather',
 async (city: string) => {
  console.debug('Refreshing weather data for:', city);
  const response = await fetchWeatherData(city);
  return response;
 },
);

export const fetchForecast = createAsyncThunk(
 'weather/fetchForecast',
 async (city: string, { getState }) => {
  const state = getState() as { weather: WeatherState };
  const cityKey = city.toLowerCase();
  const now = Date.now();
  const CACHE_DURATION = 300000;

  // Check if we have cached forecast data and it's recent enough
  if (
   state.weather.forecastCache[cityKey] &&
   state.weather.lastFetchTime[`${cityKey}_forecast`] &&
   now - state.weather.lastFetchTime[`${cityKey}_forecast`] < CACHE_DURATION
  ) {
   console.debug('🔄 Using cached forecast data for:', city);
   return { city: cityKey, data: state.weather.forecastCache[cityKey] };
  }

  console.debug('🔄 Fetching fresh forecast data for:', city);
  const response = await fetch(
   `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY}&units=metric&cnt=40`,
  );

  if (!response.ok) {
   throw new Error('Failed to fetch forecast data');
  }

  const data = await response.json();

  // Get one forecast per day
  const dailyForecasts = data.list
   .filter((_: any, index: number) => index % 8 === 0)
   .slice(0, 5);

  return { city: cityKey, data: dailyForecasts };
 },
);

const weatherSlice = createSlice({
 name: 'weather',
 initialState,
 reducers: {
  clearWeather: state => {
   state.data = null;
   state.error = null;
  },
  addRecentSearch: (state, action: PayloadAction<string>) => {
   const city = action.payload;
   // Remove if already exists to avoid duplicates
   state.recentSearches = state.recentSearches.filter(
    search => search !== city,
   );
   state.recentSearches.unshift(city);
   // Store only last 10 searches
   if (state.recentSearches.length > 10) {
    state.recentSearches = state.recentSearches.slice(0, 10);
   }
  },
  clearRecentSearches: state => {
   state.recentSearches = [];
  },
  setCachedWeather: (
   state,
   action: PayloadAction<{ city: string; data: WeatherData }>,
  ) => {
   state.weatherCache[action.payload.city.toLowerCase()] = action.payload.data;
  },
  loadCachedWeather: (state, action: PayloadAction<string>) => {
   const city = action.payload.toLowerCase();
   if (state.weatherCache[city]) {
    state.data = state.weatherCache[city];
    state.loading = false;
    state.error = null;
   }
  },
  setCachedForecast: (
   state,
   action: PayloadAction<{ city: string; data: ForecastData[] }>,
  ) => {
   state.forecastCache[action.payload.city.toLowerCase()] = action.payload.data;
  },
 },
 extraReducers: builder => {
  builder
   .addCase(fetchWeather.pending, state => {
    state.loading = true;
    state.error = null;
   })
   .addCase(
    fetchWeather.fulfilled,
    (state, action: PayloadAction<WeatherData>) => {
     state.loading = false;
     state.data = action.payload;
     state.error = null;
     // Cache the weather data and timestamp
     const cityKey = action.payload.name.toLowerCase();
     state.weatherCache[cityKey] = action.payload;
     state.lastFetchTime[cityKey] = Date.now();

     state.recentSearches = state.recentSearches.filter(
      search => search !== action.payload.name,
     );
     state.recentSearches.unshift(action.payload.name);
     // Keep only last 10 searches
     if (state.recentSearches.length > 10) {
      state.recentSearches = state.recentSearches.slice(0, 10);
     }
    },
   )
   .addCase(fetchWeather.rejected, (state, action) => {
    state.loading = false;
    state.data = null; // Clear weather data on error
    const errorMessage = action.error.message || 'Failed to fetch weather data';
    if (errorMessage === 'City not found') {
     state.error = 'City not found. Please check the spelling and try again.';
    } else {
     state.error = errorMessage;
    }
   })
   // Refresh weather cases
   .addCase(
    refreshWeather.fulfilled,
    (state, action: PayloadAction<WeatherData>) => {
     state.data = action.payload;
     state.error = null;
     const cityKey = action.payload.name.toLowerCase();
     state.weatherCache[cityKey] = action.payload;
     state.lastFetchTime[cityKey] = Date.now();
    },
   )
   .addCase(refreshWeather.rejected, (state, action) => {
    state.error = action.error.message || 'Failed to refresh weather data';
   })
   .addCase(
    fetchForecast.fulfilled,
    (state, action: PayloadAction<{ city: string; data: ForecastData[] }>) => {
     // Cache the forecast data and timestamp
     state.forecastCache[action.payload.city] = action.payload.data;
     state.lastFetchTime[`${action.payload.city}_forecast`] = Date.now();
    },
   )
   .addCase(fetchForecast.rejected, (state, action) => {
    console.error('Forecast fetch failed:', action.error.message);
   });
 },
});

export const {
 clearWeather,
 addRecentSearch,
 clearRecentSearches,
 setCachedWeather,
 loadCachedWeather,
 setCachedForecast,
} = weatherSlice.actions;
export default weatherSlice.reducer;
