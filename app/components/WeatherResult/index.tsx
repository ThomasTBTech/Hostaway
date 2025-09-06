import { FC, useEffect, useState } from 'react';
import {
 StyleSheet,
 Text,
 View,
 TouchableOpacity,
 ActivityIndicator,
} from 'react-native';
import Animated, {
 useSharedValue,
 useAnimatedStyle,
 withSpring,
 withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { FONT_SIZES, COLORS } from '@/app/utils/SharedEnums';
import { formatTemperature } from '@/app/utils/Tempareture';
import { useAppSelector } from '@/app/store/hooks';
import { WeatherResultProps } from './types';

const WeatherResult: FC<WeatherResultProps> = ({ weather, onRefresh }) => {
 const [refreshing, setRefreshing] = useState<boolean>(false);
 const error = useAppSelector(state => state.weather.error);

 const handleRefresh = () => {
  setRefreshing(true);
  onRefresh();
 };

 // Reset refreshing state when weather data changes or error occurs
 useEffect(() => {
  if (refreshing) {
   setRefreshing(false);
  }
 }, [weather, error]);
 // Function to get weather icon based on condition
 const getWeatherIcon = (condition: string, isDay: boolean = true) => {
  const conditionLower = condition.toLowerCase();

  if (conditionLower.includes('clear')) {
   return isDay ? 'sunny' : 'moon';
  } else if (conditionLower.includes('cloud')) {
   return 'cloudy';
  } else if (conditionLower.includes('rain')) {
   return 'rainy';
  } else if (conditionLower.includes('snow')) {
   return 'snow';
  } else if (conditionLower.includes('thunder')) {
   return 'thunderstorm';
  } else if (
   conditionLower.includes('fog') ||
   conditionLower.includes('mist')
  ) {
   return 'cloudy';
  } else if (conditionLower.includes('drizzle')) {
   return 'rainy';
  } else {
   return 'partly-sunny';
  }
 };
 // Animation
 const opacity = useSharedValue(0);
 const scale = useSharedValue(0.8);
 const translateY = useSharedValue(20);

 // Styling animation
 const containerStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,
  transform: [{ scale: scale.value }, { translateY: translateY.value }],
 }));

 useEffect(() => {
  opacity.value = withTiming(1, { duration: 300 });
  scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
 }, [weather.name]);

 return (
  <Animated.View style={[styles.container, containerStyle]}>
   <View style={styles.header}>
    <Text style={styles.cityName}>{weather.name}</Text>
    <TouchableOpacity
     style={styles.refreshButton}
     onPress={handleRefresh}
     disabled={refreshing}
    >
     {refreshing ? (
      <ActivityIndicator size="small" color={COLORS.TEXT_INVERSE} />
     ) : (
      <Text style={styles.refreshButtonText}>↻</Text>
     )}
    </TouchableOpacity>
   </View>
   <Text style={styles.temperature}>
    {formatTemperature(weather.main.temp)}
   </Text>
   <View style={styles.descriptionContainer}>
    <Ionicons
     name={getWeatherIcon(weather.weather[0]?.main || '')}
     size={24}
     color={COLORS.TEXT_SECONDARY}
     style={styles.weatherIcon}
    />
    <Text style={styles.description}>{weather.weather[0]?.description}</Text>
   </View>

   <View style={styles.detailsContainer}>
    <View style={styles.detailItem}>
     <Text style={styles.detailLabel}>Feels like</Text>
     <Text style={styles.detailValue}>
      {formatTemperature(weather.main.feels_like)}
     </Text>
    </View>

    <View style={styles.detailItem}>
     <Text style={styles.detailLabel}>Humidity</Text>
     <Text style={styles.detailValue}>{weather.main.humidity}%</Text>
    </View>

    <View style={styles.detailItem}>
     <Text style={styles.detailLabel}>Wind</Text>
     <Text style={styles.detailValue}>{weather.wind.speed} m/s</Text>
    </View>

    <View style={styles.detailItem}>
     <Text style={styles.detailLabel}>Pressure</Text>
     <Text style={styles.detailValue}>{weather.main.pressure} hPa</Text>
    </View>
   </View>
  </Animated.View>
 );
};

export default WeatherResult;

const styles = StyleSheet.create({
 container: {
  backgroundColor: COLORS.SURFACE,
  padding: 20,
  borderRadius: 12,
  shadowColor: COLORS.SHADOW,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
 },
 header: {
  position: 'relative',
  alignItems: 'center',
  marginBottom: 10,
 },
 cityName: {
  fontSize: FONT_SIZES.XXL,
  fontWeight: 'bold',
  color: COLORS.TEXT_PRIMARY,
  textAlign: 'center',
 },

 refreshButton: {
  position: 'absolute',
  top: 0,
  right: 0,
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: COLORS.PRIMARY,
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: COLORS.SHADOW,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  elevation: 2,
 },
 refreshButtonText: {
  fontSize: FONT_SIZES.LG,
  color: COLORS.TEXT_INVERSE,
  fontWeight: 'bold',
 },
 temperature: {
  fontSize: 48,
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: 10,
  color: COLORS.PRIMARY,
 },
 description: {
  fontSize: FONT_SIZES.LG,
  textAlign: 'center',
  color: COLORS.TEXT_SECONDARY,
  textTransform: 'capitalize',
 },
 detailsContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
 },
 detailItem: {
  width: '48%',
  alignItems: 'center',
  marginBottom: 15,
 },
 detailLabel: {
  fontSize: FONT_SIZES.SM,
  color: COLORS.TEXT_SECONDARY,
  marginBottom: 5,
 },
 detailValue: {
  fontSize: FONT_SIZES.BASE,
  fontWeight: '600',
  color: COLORS.TEXT_PRIMARY,
 },
 descriptionContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 20,
 },
 weatherIcon: {
  marginRight: 8,
 },
});
