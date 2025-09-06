import { WeatherData } from '@/app/store/types';

export interface WeatherResultProps {
 weather: WeatherData;
 onRefresh: () => void;
}
