import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from '@/app/store/slices/WeatherSlice';
import Forecast from '@/app/components/Forecast';

// mock for react-native-reanimated
jest.mock('react-native-reanimated', () => ({
 useSharedValue: jest.fn(() => ({ value: 0 })),
 useAnimatedStyle: jest.fn(() => ({})),
 withSpring: jest.fn(value => value),
 View: require('react-native').View,
}));

// mock for Ionicons
jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');

// Mock weather API
jest.mock('@/app/services/weatherApi', () => ({
 getForecast: jest.fn(() => Promise.resolve([])),
}));

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

describe('Forecast', () => {
 let mockStore: ReturnType<typeof createMockStore>;

 beforeEach(() => {
  jest.clearAllMocks();
  mockStore = createMockStore();
 });

 it('renders without crashing', () => {
  expect(() => {
   render(
    <Provider store={mockStore}>
     <Forecast city="London" />
    </Provider>,
   );
  }).not.toThrow();
 });
});
