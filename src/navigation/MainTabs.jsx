// src/navigation/MainTabs.jsx
import { Text } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import BrowseScreen from '../screens/BrowseScreen'
import GamesScreen from '../screens/GamesScreen'
import WatchlistScreen from '../screens/WatchlistScreen'
import AccountScreen from '../screens/AccountScreen'
import { colors } from '../theme'

const Tab = createBottomTabNavigator()
const ICONS = { Browse: '🏠', Games: '🎮', Watchlist: '🔖', Account: '👤' }

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.text3,
        tabBarStyle: { backgroundColor: colors.bg2, borderTopColor: colors.bg4 },
        tabBarIcon: () => <Text style={{ fontSize: 18 }}>{ICONS[route.name]}</Text>,
      })}
    >
      <Tab.Screen name="Browse" component={BrowseScreen} />
      <Tab.Screen name="Games" component={GamesScreen} />
      <Tab.Screen name="Watchlist" component={WatchlistScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  )
}
