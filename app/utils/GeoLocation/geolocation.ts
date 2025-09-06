import * as Location from 'expo-location';
import { LocationData } from './types';

export const requestLocationPermission = async (): Promise<boolean> => {
 const { status } = await Location.requestForegroundPermissionsAsync();
 return status === 'granted';
};

export const getCurrentLocation = async (): Promise<LocationData | null> => {
 try {
  // Check if permission exists
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
   console.debug('Location permission denied');
   return null;
  }

  // Get current position
  const location = await Location.getCurrentPositionAsync({
   accuracy: Location.Accuracy.Balanced,
   timeInterval: 10000,
   distanceInterval: 10,
  });

  // Reverse geocode to get city name
  const reverseGeocode = await Location.reverseGeocodeAsync({
   latitude: location.coords.latitude,
   longitude: location.coords.longitude,
  });

  if (reverseGeocode.length > 0) {
   const address = reverseGeocode[0];
   const city =
    address.city || address.subregion || address.region || 'Unknown City';
   const country = address.country || 'Unknown Country';

   return {
    city,
    country,
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
   };
  }

  return null;
 } catch (error) {
  console.error('Error getting location:', error);
  return null;
 }
};

export const getLocationStatus = async (): Promise<
 'granted' | 'denied' | 'undetermined'
> => {
 const { status } = await Location.getForegroundPermissionsAsync();
 return status;
};
