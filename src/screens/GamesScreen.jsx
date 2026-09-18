// src/screens/GamesScreen.jsx — Games Hub
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { colors, spacing, fontSizes, radii } from '../theme'

const GAMES = [
  { screen: 'Trivia', emoji: '🧠', title: 'Nollywood Trivia', desc: 'How well do you really know the classics?' },
  { screen: 'NameThatActor', emoji: '👤', title: 'Name That Actor', desc: 'One face, four guesses. How fast can you spot them?' },
  { screen: 'MatchFaces', emoji: '🖼️', title: 'Match the Faces', desc: 'Pair each legend to their name.' },
  { screen: 'QuoteCards', emoji: '💬', title: 'Quote Cards', desc: 'Iconic lines from the classics — share your favorite.' },
]

export default function GamesScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
      <Text style={styles.title}>Games <Text style={{ color: colors.gold }}>Hub</Text></Text>
      <Text style={styles.subtitle}>Test your Nollywood knowledge, challenge a friend, and share what you find.</Text>

      <View style={styles.grid}>
        {GAMES.map(g => (
          <TouchableOpacity
            key={g.screen}
            style={styles.card}
            activeOpacity={0.75}
            onPress={() => navigation.navigate(g.screen)}
          >
            <Text style={styles.emoji}>{g.emoji}</Text>
            <Text style={styles.cardTitle}>{g.title}</Text>
            <Text style={styles.cardDesc}>{g.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.leaderboardLink} onPress={() => navigation.navigate('Leaderboard')}>
        <Text style={styles.leaderboardText}>🏆 View Leaderboard →</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: spacing.xxl, paddingHorizontal: spacing.lg },
  title: { fontSize: fontSizes.xl, fontWeight: '900', color: colors.text, marginBottom: 6 },
  subtitle: { color: colors.text2, fontSize: fontSizes.sm, marginBottom: spacing.lg },
  grid: { gap: spacing.md },
  card: { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.bg4, borderRadius: radii.lg, padding: spacing.md },
  emoji: { fontSize: 30, marginBottom: 10 },
  cardTitle: { fontWeight: '700', fontSize: fontSizes.md, color: colors.text, marginBottom: 4 },
  cardDesc: { color: colors.text2, fontSize: fontSizes.sm },
  leaderboardLink: { marginTop: spacing.lg, alignItems: 'center', paddingVertical: spacing.md },
  leaderboardText: { color: colors.gold, fontWeight: '600', fontSize: fontSizes.md },
})
