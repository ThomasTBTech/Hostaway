import { FC, useEffect, useState } from 'react';
import {
 StyleSheet,
 Text,
 View,
 ActivityIndicator,
 TouchableOpacity,
 ScrollView,
 Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONT_SIZES, COLORS } from '@/app/utils/SharedEnums';
import { formatTemperature } from '@/app/utils/Tempareture';
import { API_CONFIG } from '@/app/config/api';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCachedForecast } from '@/app/store/slices/WeatherSlice';
import { ForecastProps, ForecastData } from './types';

const Forecast: FC<ForecastProps> = ({ city }) => {
 const dispatch = useAppDispatch();
 const [forecast, setForecast] = useState<ForecastData[]>([]);
 const [loading, setLoading] = useState<boolean>(false);
 const [error, setError] = useState<string | null>(null);
 const [forceRefresh, setForceRefresh] = useState<boolean>(false);
 const [refreshing, setRefreshing] = useState<boolean>(false);

 // Get cached forecast from Redux
 const cachedForecast = useAppSelector(
  state => state.weather.forecastCache[city.toLowerCase()],
 );

 // Switch case to get weather icon based on condition
 const getWeatherIcon = (condition: string) => {
  const conditionLower = condition.toLowerCase();

  switch (true) {
   case conditionLower.includes('clear'):
    return 'sunny';
   case conditionLower.includes('cloud'):
    return 'cloudy';
   case conditionLower.includes('rain'):
    return 'rainy';
   case conditionLower.includes('snow'):
    return 'snow';
   case conditionLower.includes('thunder'):
    return 'thunderstorm';
   case conditionLower.includes('fog'):
   case conditionLower.includes('mist'):
    return 'cloudy';
   case conditionLower.includes('drizzle'):
    return 'rainy';
   default:
    return 'partly-sunny';
  }
 };

 // Function to get day name from date
 const getDayName = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
 };

 // Fetch forecast data
 useEffect(() => {
  if (!city) return;

  // Check if we have cached forecast data
  if (cachedForecast && !forceRefresh) {
   setForecast(cachedForecast);
   setLoading(false);
   setError(null);
   return;
  }

  const fetchForecast = async () => {
   setLoading(true);
   setError(null);

   try {
    const response = await fetch(
     `${API_CONFIG.OPENWEATHER.BASE_URL}/forecast?q=${city}&appid=${API_CONFIG.OPENWEATHER.API_KEY}&units=${API_CONFIG.OPENWEATHER.UNITS}&cnt=40`,
    );

    if (!response.ok) {
     throw new Error('Failed to fetch forecast data');
    }

    const data = await response.json();

    // Get one forecast per day
    const dailyForecasts = data.list
     .filter((_: any, index: number) => index % 8 === 0)
     .slice(0, 5);

    setForecast(dailyForecasts);

    // Cache the forecast data
    dispatch(setCachedForecast({ city, data: dailyForecasts }));
   } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to fetch forecast');
   } finally {
    setLoading(false);
   }
  };

  fetchForecast();
 }, [city, cachedForecast, dispatch, forceRefresh]);

 // Reset refreshing state when forecast data changes or error occurs
 useEffect(() => {
  if (refreshing) {
   setRefreshing(false);
  }
 }, [forecast, error]);

 if (error) {
  return (
   <View style={styles.container}>
    <View style={styles.header}>
     <Text style={styles.title}>5-Day Forecast</Text>
    </View>
    <Text style={styles.errorText}>{error}</Text>
   </View>
  );
 }

 if (loading) {
  return (
   <View style={styles.container}>
    <View style={styles.header}>
     <Text style={styles.title}>5-Day Forecast</Text>
    </View>
    <View style={styles.loadingContainer}>
     <ActivityIndicator size="small" color={COLORS.PRIMARY} />
     <Text style={styles.loadingText}>Loading forecast...</Text>
    </View>
   </View>
  );
 }

 if (forecast.length === 0) {
  return null;
 }

 return (
  <View style={styles.container}>
   <View style={styles.header}>
    <Text style={styles.title}>5-Day Forecast</Text>
    <TouchableOpacity
     style={styles.refreshButton}
     onPress={() => {
      setRefreshing(true);
      // Force fresh fetch
      setForceRefresh(true);
      setError(null);
      // Reset force refresh after a short delay
      setTimeout(() => setForceRefresh(false), 100);
     }}
     disabled={refreshing}
     hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
     {refreshing ? (
      <ActivityIndicator size="small" color={COLORS.TEXT_INVERSE} />
     ) : (
      <Text style={styles.refreshButtonText}>↻</Text>
     )}
    </TouchableOpacity>
   </View>
   <ScrollView
    horizontal
    showsHorizontalScrollIndicator={true}
    contentContainerStyle={styles.forecastList}
    style={styles.scrollContainer}
   >
    {forecast.map((day, index) => (
     <View key={index} style={styles.forecastItem}>
      <Text style={styles.dayName}>{getDayName(day.dt_txt)}</Text>
      <Ionicons
       name={getWeatherIcon(day.weather[0]?.main || '')}
       size={24}
       color={COLORS.TEXT_SECONDARY}
       style={styles.weatherIcon}
      />
      <View style={styles.tempContainer}>
       <Text style={styles.tempMin}>
        {formatTemperature(day.main.temp_min)}°
       </Text>
       <Text style={styles.tempSeparator}>/</Text>
       <Text style={styles.tempMax}>
        {formatTemperature(day.main.temp_max)}°
       </Text>
      </View>
      <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
       {day.weather[0]?.description}
      </Text>
     </View>
    ))}
   </ScrollView>
  </View>
 );
};

export default Forecast;

const styles = StyleSheet.create({
 container: {
  backgroundColor: COLORS.SURFACE,
  padding: 20,
  borderRadius: 16,
  marginTop: 20,
  shadowColor: COLORS.SHADOW,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
 },
 header: {
  position: 'relative',
  alignItems: 'center',
  marginBottom: 20,
 },
 title: {
  fontSize: FONT_SIZES.LG,
  fontWeight: '600',
  color: COLORS.TEXT_PRIMARY,
  textAlign: 'center',
 },
 refreshButton: {
  position: 'absolute',
  top: 0,
  right: 0,
  width: 32,
  height: 32,
  borderRadius: 16,
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
  fontSize: FONT_SIZES.SM,
  color: COLORS.TEXT_INVERSE,
  fontWeight: 'bold',
 },
 loadingContainer: {
  alignItems: 'center',
  paddingVertical: 20,
 },
 loadingText: {
  marginTop: 8,
  fontSize: FONT_SIZES.SM,
  color: COLORS.TEXT_SECONDARY,
 },
 errorText: {
  textAlign: 'center',
  color: COLORS.ERROR,
  fontSize: FONT_SIZES.SM,
  paddingVertical: 20,
 },
 scrollContainer: {
  height: '15%',
 },
 forecastList: {
  flexDirection: 'row',
 },
 forecastItem: {
  alignItems: 'center',
  width: Dimensions.get('window').width / 3,
  paddingHorizontal: 8,
  minHeight: 160,
 },

 dayName: {
  fontSize: FONT_SIZES.XS,
  fontWeight: '600',
  color: COLORS.TEXT_PRIMARY,
  marginBottom: 8,
  textAlign: 'center',
 },

 weatherIcon: {
  marginBottom: 8,
 },

 tempContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 8,
  paddingHorizontal: 2,
 },
 tempMin: {
  fontSize: FONT_SIZES.XS,
  color: COLORS.TEXT_PRIMARY,
  fontWeight: '600',
  textAlign: 'center',
 },
 tempSeparator: {
  fontSize: FONT_SIZES.XS,
  color: COLORS.TEXT_SECONDARY,
  marginHorizontal: 2,
 },
 tempMax: {
  fontSize: FONT_SIZES.XS,
  color: COLORS.TEXT_PRIMARY,
  fontWeight: '600',
  textAlign: 'center',
 },
 description: {
  fontSize: FONT_SIZES.XS,
  color: COLORS.TEXT_SECONDARY,
  textAlign: 'center',
  textTransform: 'capitalize',
  marginTop: 4,
  maxWidth: 100,
  lineHeight: 12,
 },
});
