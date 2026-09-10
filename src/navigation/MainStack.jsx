// src/navigation/MainStack.jsx
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MainTabs from './MainTabs'
import MovieDetailScreen from '../screens/MovieDetailScreen'
import WatchScreen from '../screens/WatchScreen'

const Stack = createNativeStackNavigator()

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="MovieDetail" component={MovieDetailScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="Watch" component={WatchScreen} options={{ presentation: 'fullScreenModal' }} />
    </Stack.Navigator>
  )
}
