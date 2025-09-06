import { FC, useState, useEffect, useRef } from 'react';
import {
 StyleSheet,
 View,
 TextInput,
 TouchableOpacity,
 Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WeatherSearchProps } from './types';
import { FONT_SIZES, COLORS } from '@/app/utils/SharedEnums';
import { getCurrentLocation } from '@/app/utils/GeoLocation/geolocation';
import { fetchCitySuggestions } from '@/app/services/GeocodingApi';
import { CitySuggestion } from '@/app/services/GeocodingApi/types';
import AutocompleteSuggestions from '@/app/components/AutocompleteSuggestions';

const WeatherSearch: FC<WeatherSearchProps> = ({
 onSearch,
 loading = false,
}) => {
 const [city, setCity] = useState<string>('');
 const [isUsingLocation, setIsUsingLocation] = useState<boolean>(false);
 const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
 const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
 const [isLoadingSuggestions, setIsLoadingSuggestions] =
  useState<boolean>(false);
 const onSearchRef = useRef(onSearch);
 const autocompleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);
 const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
 const isGeolocationUpdate = useRef<boolean>(false);
 const isSuggestionSelection = useRef<boolean>(false);

 useEffect(() => {
  onSearchRef.current = onSearch;
 }, [onSearch]);

 // Debounced autocomplete effect
 useEffect(() => {
  // Clear any existing timeout
  if (autocompleteTimeoutRef.current) {
   clearTimeout(autocompleteTimeoutRef.current);
  }

  autocompleteTimeoutRef.current = setTimeout(async () => {
   // Skip autocomplete if this is a geolocation update or suggestion selection
   if (isGeolocationUpdate.current) {
    console.debug('Autocomplete skipped (geolocation)');
    isGeolocationUpdate.current = false;
    return;
   }

   if (isSuggestionSelection.current) {
    isSuggestionSelection.current = false;
    return;
   }

   if (city.trim() && city.trim().length >= 2) {
    setIsLoadingSuggestions(true);
    try {
     const citySuggestions = await fetchCitySuggestions(city.trim());
     setSuggestions(citySuggestions);
     setShowSuggestions(true);
    } catch (error) {
     console.error('Error fetching suggestions:', error);
     setSuggestions([]);
     setShowSuggestions(false);
    } finally {
     setIsLoadingSuggestions(false);
    }
   } else {
    setSuggestions([]);
    setShowSuggestions(false);
   }
  }, 300);

  return () => {
   if (autocompleteTimeoutRef.current) {
    clearTimeout(autocompleteTimeoutRef.current);
   }
  };
 }, [city]);

 useEffect(() => {
  if (isGeolocationUpdate.current || isSuggestionSelection.current) {
   return;
  }

  // Clear any existing search timeout
  if (searchTimeoutRef.current) {
   clearTimeout(searchTimeoutRef.current);
  }

  searchTimeoutRef.current = setTimeout(() => {
   // Double-check flags in case they changed during timeout
   if (isGeolocationUpdate.current) {
    isGeolocationUpdate.current = false;
    return;
   }

   if (isSuggestionSelection.current) {
    isSuggestionSelection.current = false;
    return;
   }

   if (city.trim() && city.trim().length >= 2 && !showSuggestions) {
    console.debug('Debounced search triggered:', city.trim());
    onSearchRef.current(city.trim());
   }
  }, 800);

  return () => {
   if (searchTimeoutRef.current) {
    clearTimeout(searchTimeoutRef.current);
   }
  };
 }, [city, showSuggestions]);

 const handleCityChange = (text: string) => {
  setCity(text);
  if (isUsingLocation) {
   setIsUsingLocation(false);
  }
 };

 const handleSuggestionSelect = (suggestion: CitySuggestion) => {
  const cityName = suggestion.state
   ? `${suggestion.name}, ${suggestion.state}, ${suggestion.country}`
   : `${suggestion.name}, ${suggestion.country}`;

  console.debug('Suggestion selected:', cityName);

  // Clear any pending timeouts
  if (autocompleteTimeoutRef.current) {
   clearTimeout(autocompleteTimeoutRef.current);
   autocompleteTimeoutRef.current = null;
  }

  if (searchTimeoutRef.current) {
   clearTimeout(searchTimeoutRef.current);
   searchTimeoutRef.current = null;
  }

  // Set flag to prevent autocomplete and search effects from running after selection
  isSuggestionSelection.current = true;

  setCity(cityName);
  setShowSuggestions(false);
  setSuggestions([]);
  onSearch(cityName);
 };

 const handleClear = () => {
  // Clear any pending timeouts
  if (autocompleteTimeoutRef.current) {
   clearTimeout(autocompleteTimeoutRef.current);
   autocompleteTimeoutRef.current = null;
  }

  if (searchTimeoutRef.current) {
   clearTimeout(searchTimeoutRef.current);
   searchTimeoutRef.current = null;
  }

  // Reset flags
  isGeolocationUpdate.current = false;
  isSuggestionSelection.current = false;

  setCity('');
  setIsUsingLocation(false);
  setShowSuggestions(false);
  setSuggestions([]);

  onSearch('');
 };

 const handleLocationPress = async () => {
  // If already using location, turn it off
  if (isUsingLocation) {
   setIsUsingLocation(false);
   setCity('');
   onSearch('');
   return;
  }

  console.debug('Getting geolocation...');

  // Clear any pending timeouts
  if (autocompleteTimeoutRef.current) {
   clearTimeout(autocompleteTimeoutRef.current);
   autocompleteTimeoutRef.current = null;
  }

  if (searchTimeoutRef.current) {
   clearTimeout(searchTimeoutRef.current);
   searchTimeoutRef.current = null;
  }

  // get location
  try {
   const locationData = await getCurrentLocation();
   if (locationData) {
    console.debug('Geolocation found:', locationData.city);
    // Set flag to prevent autocomplete from running
    isGeolocationUpdate.current = true;
    setCity(locationData.city);
    setIsUsingLocation(true);
    onSearch(locationData.city);
   } else {
    // Show some feedback that location couldn't be determined
    console.debug('Could not determine location');
   }
  } catch (error) {
   console.error('Error getting location:', error);
  }
 };

 return (
  <View style={styles.searchContainer}>
   <View style={styles.inputContainer}>
    <TextInput
     style={styles.input}
     placeholder="Enter city name... (min 2 characters)"
     value={city}
     onChangeText={handleCityChange}
     onSubmitEditing={() => {
      if (city.trim() && city.trim().length >= 2) {
       // Clear any pending timeouts
       if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
       }
       if (autocompleteTimeoutRef.current) {
        clearTimeout(autocompleteTimeoutRef.current);
        autocompleteTimeoutRef.current = null;
       }

       // Hide suggestions and trigger search
       setShowSuggestions(false);
       setSuggestions([]);
       onSearchRef.current(city.trim());
      }
     }}
     editable={!loading}
     autoCorrect={false}
     autoCapitalize="words"
     returnKeyType="search"
    />
    {city.length > 0 && (
     <TouchableOpacity
      style={styles.clearButton}
      onPress={handleClear}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
     >
      <Text style={styles.clearButtonText}>✕</Text>
     </TouchableOpacity>
    )}
   </View>

   <AutocompleteSuggestions
    suggestions={suggestions}
    onSelectSuggestion={handleSuggestionSelect}
    visible={showSuggestions}
    loading={isLoadingSuggestions}
   />

   <TouchableOpacity
    style={[
     styles.locationButton,
     isUsingLocation && styles.locationButtonActive,
    ]}
    onPress={handleLocationPress}
    disabled={loading}
    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
   >
    <Ionicons
     name={isUsingLocation ? 'close-circle' : 'location'}
     size={16}
     color={COLORS.TEXT_INVERSE}
    />
   </TouchableOpacity>
  </View>
 );
};

export default WeatherSearch;

const styles = StyleSheet.create({
 searchContainer: {
  marginBottom: 35,
  position: 'relative',
  zIndex: 10,
 },
 inputContainer: {
  position: 'relative',
  zIndex: 10,
 },
 input: {
  height: 50,
  borderWidth: 1,
  borderColor: COLORS.BORDER,
  borderRadius: 8,
  paddingHorizontal: 15,
  paddingRight: 65,
  fontSize: FONT_SIZES.BASE,
  backgroundColor: COLORS.SURFACE,
  textAlign: 'center',
 },
 clearButton: {
  position: 'absolute',
  right: 55,
  top: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  width: 30,
 },
 clearButtonText: {
  fontSize: FONT_SIZES.LG,
  color: COLORS.TEXT_SECONDARY,
  fontWeight: '600',
 },
 locationButton: {
  position: 'absolute',
  right: 12,
  top: 7,
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: COLORS.TEXT_SECONDARY,
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: COLORS.SHADOW,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 4,
  elevation: 5,
  zIndex: 20,
 },
 locationButtonActive: {
  backgroundColor: COLORS.SUCCESS,
 },
 clearedMessage: {
  alignItems: 'center',
  marginTop: 8,
  paddingVertical: 4,
 },
 clearedMessageText: {
  fontSize: FONT_SIZES.SM,
  color: COLORS.SUCCESS,
  fontWeight: '500',
 },
});
