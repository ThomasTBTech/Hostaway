import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from '@/app/store';
import MainStack from '@/app/navigation/MainStack';

export default function App() {
 return (
  <Provider store={store}>
   <NavigationContainer>
    <MainStack />
    <StatusBar style="auto" />
   </NavigationContainer>
  </Provider>
 );
}
