import {
 StyleSheet,
 Text,
 View,
 ActivityIndicator,
 ScrollView,
 KeyboardAvoidingView,
 Platform,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
 fetchWeather,
 refreshWeather,
 loadCachedWeather,
 clearRecentSearches,
 addRecentSearch,
 clearWeather,
} from '@/app/store/slices/WeatherSlice';
import WeatherSearch from '@/app/components/WeatherSearch';
import RecentSearches from '@/app/components/RecentSearches';
import WeatherResult from '@/app/components/WeatherResult';
import Forecast from '@/app/components/Forecast';
import { FONT_SIZES, COLORS } from '@/app/utils/SharedEnums';

const HomeScreen = () => {
 const dispatch = useAppDispatch();

 const weather = useAppSelector(state => state.weather.data);
 const loading = useAppSelector(state => state.weather.loading);
 const error = useAppSelector(state => state.weather.error);

 const handleSearch = (city: string) => {
  if (!city.trim()) {
   // Clear all weather data when search is empty
   dispatch(clearWeather());
   return;
  }
  // Always fetch fresh data for new searches
  dispatch(fetchWeather(city));
 };

 const handleRecentSearch = (city: string) => {
  // Only load from cache for recent searches
  dispatch(loadCachedWeather(city));
 };

 const handleRemoveSearch = (city: string) => {
  // Remove from recent searches
  dispatch(clearRecentSearches());
  // Re-add all cities except the removed one
  const filteredSearches = recentSearches.filter(search => search !== city);
  filteredSearches.forEach(search => dispatch(addRecentSearch(search)));
 };

 const handleRefresh = () => {
  if (weather?.name) {
   dispatch(refreshWeather(weather.name));
  }
 };

 const recentSearches = useAppSelector(state => state.weather.recentSearches);

 return (
  <KeyboardAvoidingView
   style={styles.container}
   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
   keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
  >
   <ScrollView
    style={styles.scrollView}
    contentContainerStyle={styles.scrollContent}
    keyboardShouldPersistTaps="handled"
   >
    <View style={styles.content}>
     <WeatherSearch onSearch={handleSearch} loading={loading} />

     <RecentSearches
      recentSearches={recentSearches}
      currentCity={weather?.name}
      onCitySelect={handleRecentSearch}
      onRemoveSearch={handleRemoveSearch}
     />

     {loading && (
      <View style={styles.loadingContainer}>
       <ActivityIndicator size="large" color={COLORS.PRIMARY} />
       <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
     )}

     {error && (
      <View style={styles.errorContainer}>
       <Text style={styles.errorText}>{error}</Text>
      </View>
     )}

     {weather && !error && (
      <WeatherResult weather={weather} onRefresh={handleRefresh} />
     )}
     {weather && !error && <Forecast city={weather.name} />}
    </View>
   </ScrollView>
  </KeyboardAvoidingView>
 );
};

export default HomeScreen;

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: COLORS.BACKGROUND,
 },
 scrollView: {
  flex: 1,
 },
 scrollContent: {
  flexGrow: 1,
 },
 content: {
  flex: 1,
  padding: 20,
  paddingTop: 60,
 },
 title: {
  fontSize: FONT_SIZES.XXXL,
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: 30,
  color: COLORS.TEXT_PRIMARY,
 },

 loadingContainer: {
  alignItems: 'center',
  marginTop: 40,
 },
 loadingText: {
  marginTop: 10,
  fontSize: FONT_SIZES.BASE,
  color: COLORS.TEXT_SECONDARY,
 },
 errorContainer: {
  backgroundColor: COLORS.ERROR,
  padding: 15,
  borderRadius: 8,
  marginTop: 20,
 },
 errorText: {
  color: COLORS.TEXT_INVERSE,
  fontSize: FONT_SIZES.BASE,
  textAlign: 'center',
 },
});
