import { FC } from 'react';
import {
 StyleSheet,
 View,
 Text,
 TouchableOpacity,
 ScrollView,
 ActivityIndicator,
} from 'react-native';
import { FONT_SIZES, COLORS } from '@/app/utils/SharedEnums';
import { CitySuggestion } from '@/app/services/GeocodingApi/types';
import { AutocompleteSuggestionsProps } from './types';

const AutocompleteSuggestions: FC<AutocompleteSuggestionsProps> = ({
 suggestions,
 onSelectSuggestion,
 visible,
 loading = false,
}) => {
 if (!visible) {
  return null;
 }

 if (loading) {
  return (
   <View style={styles.container}>
    <View style={styles.loadingContainer}>
     <ActivityIndicator size="small" color={COLORS.PRIMARY} />
     <Text style={styles.loadingText}>Loading suggestions...</Text>
    </View>
   </View>
  );
 }

 if (suggestions.length === 0) {
  return null;
 }

 const renderSuggestion = ({ item }: { item: CitySuggestion }) => {
  const displayName = item.state
   ? `${item.name}, ${item.state}, ${item.country}`
   : `${item.name}, ${item.country}`;

  return (
   <TouchableOpacity
    style={styles.suggestionItem}
    onPress={() => onSelectSuggestion(item)}
    activeOpacity={0.7}
   >
    <Text style={styles.suggestionText}>{displayName}</Text>
   </TouchableOpacity>
  );
 };

 return (
  <View style={styles.container}>
   <ScrollView
    style={styles.list}
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps="handled"
    nestedScrollEnabled={true}
   >
    {suggestions.map((item, index) => (
     <View key={`${item.name}-${item.country}-${index}`}>
      {renderSuggestion({ item })}
     </View>
    ))}
   </ScrollView>
  </View>
 );
};

export default AutocompleteSuggestions;

const styles = StyleSheet.create({
 container: {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  backgroundColor: COLORS.SURFACE,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: COLORS.BORDER,
  shadowColor: COLORS.SHADOW,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
  zIndex: 1000,
  maxHeight: 200,
 },
 list: {
  maxHeight: 200,
 },
 suggestionItem: {
  paddingHorizontal: 15,
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: COLORS.BORDER,
 },
 suggestionText: {
  fontSize: FONT_SIZES.SM,
  color: COLORS.TEXT_PRIMARY,
  textAlign: 'left',
 },
 loadingContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 15,
  paddingHorizontal: 15,
 },
 loadingText: {
  fontSize: FONT_SIZES.SM,
  color: COLORS.TEXT_SECONDARY,
  marginLeft: 8,
 },
});
