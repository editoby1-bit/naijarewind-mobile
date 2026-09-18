// src/screens/games/ChallengeScoreboardScreen.jsx
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native'
import { apiGet } from '../../lib/api'
import { colors, spacing, fontSizes, radii } from '../../theme'

const GAME_LABELS = {
  trivia: 'Nollywood Trivia',
  name_that_actor: 'Name That Actor',
  match_faces: 'Match the Faces',
}
const GAME_SCREENS = {
  trivia: 'Trivia',
  name_that_actor: 'NameThatActor',
  match_faces: 'MatchFaces',
}

export default function ChallengeScoreboardScreen({ route, navigation }) {
  const { challengeId } = route.params
  const [challenge, setChallenge] = useState(null)
  const [attempts, setAttempts] = useState([])
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    apiGet(`/api/games/challenge/${challengeId}`)
      .then(({ challenge, attempts }) => { setChallenge(challenge); setAttempts(attempts || []) })
      .catch(() => setNotFound(true))
  }, [challengeId])

  if (notFound) {
    return (
      <View style={styles.container}>
        <Text style={styles.muted}>Challenge not found — the link may be broken.</Text>
      </View>
    )
  }

  const gameLabel = challenge ? GAME_LABELS[challenge.game_type] || challenge.game_type : ''

  const board = challenge ? [
    { label: challenge.creator_label, score: challenge.creator_score, total: challenge.creator_total, isCreator: true },
    ...attempts.map(a => ({ label: a.player_label, score: a.score, total: a.total })),
  ].sort((a, b) => (b.score / b.total) - (a.score / a.total)) : []

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.xxl }}>
      <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Games' })}>
        <Text style={styles.back}>← Games Hub</Text>
      </TouchableOpacity>

      {!challenge ? (
        <Text style={styles.muted}>Loading…</Text>
      ) : (
        <>
          <Text style={styles.title}>{gameLabel} <Text style={{ color: colors.gold }}>Challenge</Text></Text>
          <Text style={styles.subtitle}>{challenge.creator_label} started this — see who comes out on top.</Text>

          <View style={{ gap: spacing.sm, marginTop: spacing.lg, marginBottom: spacing.lg }}>
            {board.map((p, i) => (
              <View key={i} style={[styles.row, i === 0 && styles.rowTop]}>
                <Text style={[styles.rank, i === 0 && styles.rankGold]}>{i === 0 ? '🥇' : i + 1}</Text>
                <Text style={styles.name}>{p.label}{p.isCreator ? ' (started it)' : ''}</Text>
                <Text style={styles.points}>{p.score}/{p.total}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.goldBtn}
            onPress={() => navigation.navigate(GAME_SCREENS[challenge.game_type], {
              challengeIds: challenge.question_ids.join(','), challengeId,
            })}
          >
            <Text style={styles.goldBtnText}>Play This Challenge</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginTop: spacing.md, alignItems: 'center' }}
            onPress={() => Share.share({ message: `Think you can beat this ${gameLabel} score? https://nollyvault.vercel.app/games/challenge/${challengeId}` })}
          >
            <Text style={styles.linkText}>Share this challenge</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  back: { color: colors.text2, fontSize: fontSizes.sm, marginBottom: spacing.md },
  title: { fontSize: fontSizes.xl, fontWeight: '900', color: colors.text, marginBottom: 4 },
  subtitle: { color: colors.text2, fontSize: fontSizes.sm },
  muted: { color: colors.text4, textAlign: 'center', paddingVertical: spacing.xxl },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.bg4, borderRadius: radii.md },
  rowTop: { backgroundColor: 'rgba(200,168,75,0.06)' },
  rank: { width: 28, fontWeight: '800', color: colors.text4 },
  rankGold: { color: colors.gold },
  name: { flex: 1, color: colors.text, fontWeight: '500' },
  points: { color: colors.text2, fontSize: fontSizes.sm },
  goldBtn: { backgroundColor: colors.gold, borderRadius: radii.md, paddingVertical: 12, alignItems: 'center' },
  goldBtnText: { color: '#000', fontWeight: '600', fontSize: fontSizes.md },
  linkText: { color: colors.text2, fontSize: fontSizes.sm },
})
