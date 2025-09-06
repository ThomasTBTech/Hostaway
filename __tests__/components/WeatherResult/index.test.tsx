import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from '@/app/store/slices/WeatherSlice';
import WeatherResult from '@/app/components/WeatherResult';

//  mock for react-native-reanimated
jest.mock('react-native-reanimated', () => ({
 useSharedValue: jest.fn(() => ({ value: 0 })),
 useAnimatedStyle: jest.fn(() => ({})),
 withSpring: jest.fn(value => value),
 withTiming: jest.fn(value => value),
 View: require('react-native').View,
}));

//  mock for Ionicons
jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');

// Create a mock store
const createMockStore = () => {
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
   },
  },
 });
};

describe('WeatherResult', () => {
 let mockStore: ReturnType<typeof createMockStore>;

 const mockWeather = {
  name: 'London',
  main: {
   temp: 20,
   feels_like: 18,
   humidity: 65,
   pressure: 1013,
  },
  weather: [
   {
    main: 'Clear',
    description: 'clear sky',
    icon: '01d',
   },
  ],
  wind: {
   speed: 5.2,
  },
 };

 const mockOnRefresh = jest.fn();

 beforeEach(() => {
  jest.clearAllMocks();
  mockStore = createMockStore();
 });

 it('renders without crashing', () => {
  expect(() => {
   render(
    <Provider store={mockStore}>
     <WeatherResult weather={mockWeather} onRefresh={mockOnRefresh} />
    </Provider>,
   );
  }).not.toThrow();
 });
});
