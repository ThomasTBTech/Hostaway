import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@/app/screens/HomeScreen';

const Stack = createNativeStackNavigator();

const MainStack = () => {
 return (
  <Stack.Navigator>
   <Stack.Screen
    options={{ headerTitle: 'Hostaway Weather App' }}
    name="Home"
    component={HomeScreen}
   />
  </Stack.Navigator>
 );
};

export default MainStack;
