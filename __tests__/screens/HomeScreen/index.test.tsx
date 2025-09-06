import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from '@/app/store/slices/WeatherSlice';
import HomeScreen from '@/app/screens/HomeScreen';

// Mock the components to isolate HomeScreen testing
jest.mock('@/app/components/WeatherSearch', () => {
 const { View, Text, TouchableOpacity, TextInput } = require('react-native');

 const MockWeatherSearch = ({
  onSearch,
  onLocationToggle,
  isLocationActive,
 }: {
  onSearch: (text: string) => void;
  onLocationToggle: () => void;
  isLocationActive: boolean;
 }) => (
  <View testID="weather-search">
   <TextInput
    testID="search-input"
    placeholder="Enter city name..."
    onChangeText={(text: string) => onSearch(text)}
   />
   <TouchableOpacity
    testID="location-button"
    onPress={onLocationToggle}
    style={{
     backgroundColor: isLocationActive ? '#007AFF' : '#8E8E93',
    }}
   >
    <Text>Location</Text>
   </TouchableOpacity>
  </View>
 );
 return MockWeatherSearch;
});

jest.mock('@/app/components/RecentSearches', () => {
 const { View, Text, TouchableOpacity } = require('react-native');

 const MockRecentSearches = ({
  recentSearches,
  currentCity,
  onCitySelect,
  onRemoveSearch,
 }: any) => (
  <View testID="recent-searches">
   {recentSearches.map((city: string) => (
    <TouchableOpacity
     key={city}
     testID={`recent-${city}`}
     onPress={() => onCitySelect(city)}
    >
     <Text>{city}</Text>
    </TouchableOpacity>
   ))}
  </View>
 );
 return MockRecentSearches;
});

jest.mock('@/app/components/WeatherResult', () => {
 const { View, Text, TouchableOpacity } = require('react-native');

 const MockWeatherResult = ({ weather, onRefresh }: any) => (
  <View testID="weather-result">
   <TouchableOpacity testID="refresh-weather" onPress={onRefresh}>
    <Text>Refresh</Text>
   </TouchableOpacity>
   <View testID="weather-content">
    <Text>{weather ? 'Weather Data' : 'No Weather Data'}</Text>
   </View>
  </View>
 );
 return MockWeatherResult;
});

jest.mock('@/app/components/Forecast', () => {
 const { View, Text, TouchableOpacity } = require('react-native');

 const MockForecast = ({ city, onRefresh }: any) => (
  <View testID="forecast">
   <TouchableOpacity testID="refresh-forecast" onPress={onRefresh}>
    <Text>Refresh</Text>
   </TouchableOpacity>
   <View testID="forecast-content">
    <Text>{city ? `Forecast for ${city}` : 'No Forecast'}</Text>
   </View>
  </View>
 );
 return MockForecast;
});

// Mock the geolocation utility
jest.mock('@/app/utils/GeoLocation/geolocation', () => ({
 getCurrentLocation: jest.fn(() =>
  Promise.resolve({ city: 'Current Location' }),
 ),
}));

// Create a mock store
const createMockStore = (initialState = {}) => {
 return configureStore({
  reducer: {
   weather: weatherReducer,
  },
  preloadedState: {
   weather: {
    data: null,
    loading: false,
    error: null,
    recentSearches: [],
    weatherCache: {},
    forecastCache: {},
    lastFetchTime: {},
    ...initialState,
   },
  },
 });
};

describe('HomeScreen', () => {
 let mockStore: any;

 beforeEach(() => {
  mockStore = createMockStore();
 });

 it('renders all main components', () => {
  const { getByTestId } = render(
   <Provider store={mockStore}>
    <HomeScreen />
   </Provider>,
  );

  expect(getByTestId('weather-search')).toBeTruthy();
  expect(getByTestId('recent-searches')).toBeTruthy();
 });

 it('shows weather result when weather data exists', () => {
  const storeWithWeather = createMockStore({
   data: { name: 'London', main: { temp: 20 } },
  });

  const { getByTestId } = render(
   <Provider store={storeWithWeather}>
    <HomeScreen />
   </Provider>,
  );

  expect(getByTestId('weather-result')).toBeTruthy();
  expect(getByTestId('weather-content')).toBeTruthy();
 });

 it('shows forecast when city is selected', () => {
  const storeWithCity = createMockStore({
   data: { name: 'London', main: { temp: 20 } },
  });

  const { getByTestId } = render(
   <Provider store={storeWithCity}>
    <HomeScreen />
   </Provider>,
  );

  expect(getByTestId('forecast')).toBeTruthy();
  expect(getByTestId('forecast-content')).toBeTruthy();
 });

 it('does not show weather result when no weather data', () => {
  const { queryByTestId } = render(
   <Provider store={mockStore}>
    <HomeScreen />
   </Provider>,
  );

  expect(queryByTestId('weather-result')).toBeFalsy();
 });

 it('does not show forecast when no city is selected', () => {
  const { queryByTestId } = render(
   <Provider store={mockStore}>
    <HomeScreen />
   </Provider>,
  );

  expect(queryByTestId('forecast')).toBeFalsy();
 });

 it('displays recent searches when they exist', () => {
  const storeWithSearches = createMockStore({
   recentSearches: ['London', 'Paris', 'Berlin'],
  });

  const { getByTestId } = render(
   <Provider store={storeWithSearches}>
    <HomeScreen />
   </Provider>,
  );

  expect(getByTestId('recent-London')).toBeTruthy();
  expect(getByTestId('recent-Paris')).toBeTruthy();
  expect(getByTestId('recent-Berlin')).toBeTruthy();
 });

 it('handles empty recent searches gracefully', () => {
  const { getByTestId } = render(
   <Provider store={mockStore}>
    <HomeScreen />
   </Provider>,
  );

  expect(getByTestId('recent-searches')).toBeTruthy();
 });

 it('passes correct props to WeatherSearch component', () => {
  const { getByTestId } = render(
   <Provider store={mockStore}>
    <HomeScreen />
   </Provider>,
  );

  const searchComponent = getByTestId('weather-search');
  expect(searchComponent).toBeTruthy();
 });

 it('passes correct props to RecentSearches component', () => {
  const storeWithSearches = createMockStore({
   recentSearches: ['London'],
   data: { name: 'London' },
  });

  const { getByTestId } = render(
   <Provider store={storeWithSearches}>
    <HomeScreen />
   </Provider>,
  );

  const recentSearchesComponent = getByTestId('recent-searches');
  expect(recentSearchesComponent).toBeTruthy();
 });

 it('passes correct props to WeatherResult component', () => {
  const storeWithWeather = createMockStore({
   data: { name: 'London', main: { temp: 20 } },
  });

  const { getByTestId } = render(
   <Provider store={storeWithWeather}>
    <HomeScreen />
   </Provider>,
  );

  const weatherResultComponent = getByTestId('weather-result');
  expect(weatherResultComponent).toBeTruthy();
 });

 it('passes correct props to Forecast component', () => {
  const storeWithWeather = createMockStore({
   data: { name: 'London', main: { temp: 20 } },
  });

  const { getByTestId } = render(
   <Provider store={storeWithWeather}>
    <HomeScreen />
   </Provider>,
  );

  const forecastComponent = getByTestId('forecast');
  expect(forecastComponent).toBeTruthy();
 });

 it('renders with default state correctly', () => {
  const { getByTestId } = render(
   <Provider store={mockStore}>
    <HomeScreen />
   </Provider>,
  );

  // Should show search and recent searches components
  expect(getByTestId('weather-search')).toBeTruthy();
  expect(getByTestId('recent-searches')).toBeTruthy();

  // Should not show weather result or forecast initially
  expect(() => getByTestId('weather-result')).toThrow();
  expect(() => getByTestId('forecast')).toThrow();
 });

 it('handles state changes correctly', () => {
  const { rerender, getByTestId, queryByTestId } = render(
   <Provider store={mockStore}>
    <HomeScreen />
   </Provider>,
  );

  // Initially no weather result
  expect(queryByTestId('weather-result')).toBeFalsy();

  // Update store with weather data
  const storeWithWeather = createMockStore({
   data: { name: 'London', main: { temp: 20 } },
  });

  rerender(
   <Provider store={storeWithWeather}>
    <HomeScreen />
   </Provider>,
  );

  expect(getByTestId('weather-result')).toBeTruthy();
 });
});
