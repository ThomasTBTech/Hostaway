import { FC, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Animated, {
 useSharedValue,
 useAnimatedStyle,
 withSpring,
 withDelay,
} from 'react-native-reanimated';
import { FONT_SIZES, COLORS } from '@/app/utils/SharedEnums';
import { RecentSearchesProps } from './types';

// Animated item component for staggered animations
const AnimatedRecentSearchItem: FC<{
 city: string;
 index: number;
 onPress: () => void;
 onRemove: () => void;
}> = ({ city, index, onPress, onRemove }) => {
 const opacity = useSharedValue(0);
 const scale = useSharedValue(0.8);
 const translateY = useSharedValue(20);

 const animatedStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,
  transform: [{ scale: scale.value }, { translateY: translateY.value }],
 }));

 useEffect(() => {
  // Staggered entrance animation
  opacity.value = withDelay(
   index * 100,
   withSpring(1, { damping: 15, stiffness: 150 }),
  );
  scale.value = withDelay(
   index * 100,
   withSpring(1, { damping: 15, stiffness: 150 }),
  );
  translateY.value = withDelay(
   index * 100,
   withSpring(0, { damping: 15, stiffness: 150 }),
  );
 }, [city, index]);

 return (
  <Animated.View style={animatedStyle}>
   <View style={styles.itemContainer}>
    <TouchableOpacity
     style={[styles.item, styles.recentItem]}
     onPress={onPress}
    >
     <Text style={[styles.text, styles.recentText]}>{city}</Text>
    </TouchableOpacity>
    <TouchableOpacity
     style={styles.removeButton}
     onPress={onRemove}
     hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
    >
     <Text style={styles.removeButtonText}>×</Text>
    </TouchableOpacity>
   </View>
  </Animated.View>
 );
};

const RecentSearches: FC<RecentSearchesProps> = ({
 recentSearches,
 currentCity,
 onCitySelect,
 onRemoveSearch,
}) => {
 if (recentSearches.length === 0) {
  return null;
 }

 // Filter out the current city from recent searches
 const filteredSearches = recentSearches.filter(
  city => city.toLowerCase() !== currentCity?.toLowerCase(),
 );

 if (filteredSearches.length === 0) {
  return null;
 }

 return (
  <View style={styles.container}>
   <View style={styles.titleContainer}></View>
   <View style={styles.list}>
    {filteredSearches.map((city: string, index: number) => (
     <AnimatedRecentSearchItem
      key={city}
      city={city}
      index={index}
      onPress={() => onCitySelect(city)}
      onRemove={() => onRemoveSearch(city)}
     />
    ))}
   </View>
  </View>
 );
};

export default RecentSearches;

const styles = StyleSheet.create({
 container: {
  marginBottom: 20,
 },
 titleContainer: {
  alignItems: 'center',
  marginBottom: 10,
 },
 title: {
  fontSize: FONT_SIZES.LG,
  fontWeight: '600',
  marginBottom: 4,
  color: COLORS.TEXT_PRIMARY,
 },
 subtitle: {
  fontSize: FONT_SIZES.SM,
  color: COLORS.TEXT_SECONDARY,
  fontStyle: 'italic',
 },
 list: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
 },
 itemContainer: {
  position: 'relative',
  flexDirection: 'row',
  alignItems: 'center',
 },
 item: {
  paddingHorizontal: 12,
  paddingVertical: 8,
  paddingRight: 30,
  borderRadius: 16,
  borderWidth: 1,
  minWidth: 100,
 },
 recentItem: {
  backgroundColor: COLORS.WEATHER_BLUE,
  borderColor: COLORS.WEATHER_BLUE_BORDER,
 },
 text: {
  fontSize: FONT_SIZES.SM,
  fontWeight: '500',
 },
 recentText: {
  color: COLORS.WEATHER_BLUE_TEXT,
 },
 removeButton: {
  position: 'absolute',
  right: 5,
  top: '50%',
  transform: [{ translateY: -10 }],
  justifyContent: 'center',
  alignItems: 'center',
  width: 20,
  height: 20,
  borderRadius: 10,
  backgroundColor: COLORS.SHADOW,
 },
 removeButtonText: {
  fontSize: FONT_SIZES.SM,
  color: COLORS.TEXT_INVERSE,
  fontWeight: 'bold',
  lineHeight: 16,
 },
});
