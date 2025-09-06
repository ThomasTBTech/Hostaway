export interface RecentSearchesProps {
 recentSearches: string[];
 currentCity?: string;
 onCitySelect: (city: string) => void;
 onRemoveSearch: (city: string) => void;
}
