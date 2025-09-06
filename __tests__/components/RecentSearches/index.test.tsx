import { render } from '@testing-library/react-native';
import RecentSearches from '@/app/components/RecentSearches';

// Simple mock for react-native-reanimated
jest.mock('react-native-reanimated', () => ({
 useSharedValue: jest.fn(() => ({ value: 0 })),
 useAnimatedStyle: jest.fn(() => ({})),
 withDelay: jest.fn((_, value) => value),
 withSpring: jest.fn(value => value),
 View: require('react-native').View,
}));

describe('RecentSearches', () => {
 const mockOnCitySelect = jest.fn();
 const mockOnRemoveSearch = jest.fn();

 beforeEach(() => {
  jest.clearAllMocks();
 });

 it('renders without crashing when no searches', () => {
  expect(() => {
   render(
    <RecentSearches
     recentSearches={[]}
     currentCity={undefined}
     onCitySelect={mockOnCitySelect}
     onRemoveSearch={mockOnRemoveSearch}
    />,
   );
  }).not.toThrow();
 });

 it('renders without crashing with searches', () => {
  expect(() => {
   render(
    <RecentSearches
     recentSearches={['London', 'Paris']}
     currentCity={undefined}
     onCitySelect={mockOnCitySelect}
     onRemoveSearch={mockOnRemoveSearch}
    />,
   );
  }).not.toThrow();
 });
});
