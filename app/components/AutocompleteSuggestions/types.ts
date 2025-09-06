import { CitySuggestion } from '@/app/services/GeocodingApi/types';

export interface AutocompleteSuggestionsProps {
 suggestions: CitySuggestion[];
 onSelectSuggestion: (suggestion: CitySuggestion) => void;
 visible: boolean;
 loading?: boolean;
}
