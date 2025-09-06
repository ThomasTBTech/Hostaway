import { render } from '@testing-library/react-native';
import WeatherSearch from '@/app/components/WeatherSearch';

// Simple mock for react-native-reanimated
jest.mock('react-native-reanimated', () => ({
 useSharedValue: jest.fn(() => ({ value: 0 })),
 useAnimatedStyle: jest.fn(() => ({})),
 withSpring: jest.fn(value => value),
 View: require('react-native').View,
}));

// Simple mock for Ionicons
jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');

describe('WeatherSearch', () => {
 const mockOnSearch = jest.fn();

 beforeEach(() => {
  jest.clearAllMocks();
 });

 it('renders without crashing', () => {
  expect(() => {
   render(<WeatherSearch onSearch={mockOnSearch} loading={false} />);
  }).not.toThrow();
 });

 it('renders with loading state', () => {
  expect(() => {
   render(<WeatherSearch onSearch={mockOnSearch} loading={true} />);
  }).not.toThrow();
 });
});
