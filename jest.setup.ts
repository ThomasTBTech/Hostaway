/* eslint-disable @typescript-eslint/no-require-imports */
import { jest } from '@jest/globals';

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Mock React Navigation
export const mockNavigate = jest.fn();
export const mockGoBack = jest.fn();
export const mockDispatch = jest.fn();
export const mockSetOptions = jest.fn();
export const mockCanGoBack = jest.fn(() => true);

// Mock React Navigation's linking functionality
jest.mock('@react-navigation/native', () => {
 const actualNav = jest.requireActual('@react-navigation/native') as Record<
  string,
  unknown
 >;
 return Object.assign({}, actualNav, {
  useNavigation: () => ({
   navigate: mockNavigate,
   goBack: mockGoBack,
   dispatch: mockDispatch,
   setOptions: mockSetOptions,
   canGoBack: mockCanGoBack,
   isFocused: () => true,
   addListener: jest.fn(() => jest.fn()),
   removeListener: jest.fn(),
  }),
  useRoute: () => ({
   params: {},
   key: 'mockRouteKey',
   name: 'MockScreenName',
  }),
  NavigationContainer: ({ children }: { children: React.ReactNode }) =>
   children,
  useLinking: () => ({
   getInitialState: () => Promise.resolve(null),
   subscribe: () => () => {},
   getStateFromPath: () => null,
   getPathFromState: () => '',
  }),
 });
});

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => ({
 useSharedValue: jest.fn(() => ({ value: 0 })),
 useAnimatedStyle: jest.fn(() => ({})),
 withSpring: jest.fn(value => value),
 withTiming: jest.fn(value => value),
 withDelay: jest.fn((_, value) => value),
 runOnJS: jest.fn(fn => fn),
 interpolate: jest.fn(value => value),
 Extrapolate: {
  CLAMP: 'clamp',
  EXTEND: 'extend',
  IDENTITY: 'identity',
 },
 View: require('react-native').View,
 Text: require('react-native').Text,
 Image: require('react-native').Image,
 ScrollView: require('react-native').ScrollView,
 FlatList: require('react-native').FlatList,
}));

jest.mock('@expo/vector-icons/Ionicons', () => {
 const React = require('react');
 return function Ionicons(props: any) {
  return React.createElement('IoniconsIcon', props);
 };
});

// Mock the main @expo/vector-icons export
jest.mock('@expo/vector-icons', () => ({
 Ionicons: require('@expo/vector-icons/Ionicons'),
}));

// Mock React Native Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
 alert: jest.fn(),
}));

// Mock expo-location
jest.mock('expo-location', () => ({
 requestForegroundPermissionsAsync: jest.fn(() =>
  Promise.resolve({ status: 'granted' }),
 ),
 getCurrentPositionAsync: jest.fn(() =>
  Promise.resolve({
   coords: { latitude: 51.5074, longitude: -0.1278 },
  }),
 ),
 reverseGeocodeAsync: jest.fn(() => Promise.resolve([{ city: 'London' }])),
 Accuracy: {
  Balanced: 'balanced',
  High: 'high',
  Low: 'low',
 },
}));

// Mock the geolocation utility
jest.mock('./app/utils/GeoLocation/geolocation', () => ({
 getCurrentLocation: jest.fn(() => Promise.resolve({ city: 'London' })),
}));

beforeAll(() => {
 jest.spyOn(console, 'error').mockImplementation((message, ...args) => {
  const messageStr = typeof message === 'string' ? message : String(message);
  if (
   messageStr.includes('act(...)') ||
   messageStr.includes('Icon inside a test')
  ) {
   return;
  }
  originalConsoleError(message, ...args);
 });

 jest.spyOn(console, 'warn').mockImplementation((message, ...args) => {
  const messageStr = typeof message === 'string' ? message : String(message);
  if (
   messageStr.includes(
    'react-i18next:: useTranslation: You will need to pass in an i18next instance',
   )
  ) {
   return;
  }
  originalConsoleWarn(message, ...args);
 });
});

afterAll(() => {
 jest.restoreAllMocks();
});
