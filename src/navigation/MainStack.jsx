// src/navigation/MainStack.jsx
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MainTabs from './MainTabs'
import MovieDetailScreen from '../screens/MovieDetailScreen'
import WatchScreen from '../screens/WatchScreen'
import LeaderboardScreen from '../screens/LeaderboardScreen'
import TriviaScreen from '../screens/games/TriviaScreen'
import NameThatActorScreen from '../screens/games/NameThatActorScreen'
import MatchFacesScreen from '../screens/games/MatchFacesScreen'
import QuoteCardsScreen from '../screens/games/QuoteCardsScreen'
import ChallengeScoreboardScreen from '../screens/games/ChallengeScoreboardScreen'
import SearchScreen from '../screens/SearchScreen'
import TermsScreen from '../screens/TermsScreen'
import PrivacyScreen from '../screens/PrivacyScreen'

const Stack = createNativeStackNavigator()

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="MovieDetail" component={MovieDetailScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="Watch" component={WatchScreen} options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="Trivia" component={TriviaScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="NameThatActor" component={NameThatActorScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="MatchFaces" component={MatchFacesScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="QuoteCards" component={QuoteCardsScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="ChallengeScoreboard" component={ChallengeScoreboardScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="Search" component={SearchScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="Terms" component={TermsScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} options={{ presentation: 'card' }} />
    </Stack.Navigator>
  )
}
