import { StatusBar } from 'expo-status-bar';
import './global.css';
import { Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ProfileScreen from './screens/ProfileScreen';
import { useFonts } from 'expo-font';
import LoginScreen from 'screens/auth/LoginScreen';
import Button from 'components/Button';
import { Gosuslugi } from 'components/icons';
import { UilVk } from 'components/icons';


export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Onest-Medium': require('./assets/fonts/Onest-Medium.ttf'),
    'Onest-Regular': require('./assets/fonts/Onest-Regular.ttf'),
    'Onest-SemiBold': require('./assets/fonts/Onest-SemiBold.ttf'),
    'Onest-ExtraBold': require('./assets/fonts/Onest-ExtraBold.ttf'), 

     });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
     <LoginScreen/>
  );
}