// src/screens/games/TriviaScreen.jsx
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Alert } from 'react-native'
import { apiGet, apiPost } from '../../lib/api'
import { useAuth } from '../../lib/AuthContext'
import { colors, spacing, fontSizes, radii } from '../../theme'

const OPTION_KEYS = ['a', 'b', 'c', 'd']

export default function TriviaScreen({ route, navigation }) {
  const { session } = useAuth()
  // When arriving via a challenge link: route.params = { challengeIds, challengeId }
  const challengeIds = route?.params?.challengeIds
  const challengeId = route?.params?.challengeId

  const [actorOptions, setActorOptions] = useState([])
  const [actorFilter, setActorFilter] = useState('')
  const [categoryOptions, setCategoryOptions] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('')

  const [questions, setQuestions] = useState(null)
  const [step, setStep] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [done, setDone] = useState(false)
  const [creatingChallenge, setCreatingChallenge] = useState(false)
  const [challengeUrl, setChallengeUrl] = useState(null)
  const [attemptRecorded, setAttemptRecorded] = useState(false)

  useEffect(() => {
    if (challengeIds) return // filters are only for the freeform start screen
    apiGet('/api/veterans/list-lite').then(({ actors }) => setActorOptions(actors || [])).catch(() => {})
    apiGet('/api/trivia/categories').then(({ categories }) => setCategoryOptions(categories || [])).catch(() => {})
  }, [])

  useEffect(() => {
    let url
    if (challengeIds) {
      url = `/api/trivia/questions?ids=${challengeIds}`
    } else {
      const params = new URLSearchParams({ limit: '10' })
      if (actorFilter) params.set('actorId', actorFilter)
      if (categoryFilter) params.set('category', categoryFilter)
      url = `/api/trivia/questions?${params.toString()}`
    }
    setQuestions(null)
    apiGet(url).then(({ questions }) => setQuestions(questions || [])).catch(() => setQuestions([]))
  }, [challengeIds, actorFilter, categoryFilter])

  function answer(opt) {
    if (selected) return
    setSelected(opt)
    const correct = questions[step].correct_option
    const finalScore = opt === correct ? score + 1 : score
    if (opt === correct) setScore(s => s + 1)

    setTimeout(() => {
      if (step + 1 < questions.length) {
        setStep(step + 1)
        setSelected(null)
      } else {
        setDone(true)
        if (session) apiPost('/api/engagement/log', { eventType: 'trivia_completed' }).catch(() => {})
        if (challengeId && session) {
          apiPost(`/api/games/challenge/${challengeId}`, {
            score: finalScore, total: questions.length,
            label: session.user.user_metadata?.full_name || 'A friend',
          }).then(() => {
            setAttemptRecorded(true)
            apiPost('/api/engagement/log', { eventType: 'challenge_accepted' }).catch(() => {})
          }).catch(() => {})
        }
      }
    }, 800)
  }

  async function createChallenge() {
    if (!session) { Alert.alert('Sign in required', 'Sign in to challenge a friend'); return }
    setCreatingChallenge(true)
    try {
      const questionIds = questions.map(q => q.id)
      const data = await apiPost('/api/games/challenge/create', {
        gameType: 'trivia', questionIds, score, total: questions.length,
        label: session.user.user_metadata?.full_name || 'A friend',
      })
      if (data.challengeId) {
        const url = `https://nollyvault.vercel.app/games/challenge/${data.challengeId}`
        setChallengeUrl(url)
        apiPost('/api/engagement/log', { eventType: 'challenge_created' }).catch(() => {})
        Share.share({ message: `I scored ${score}/${questions.length} on Nollywood Trivia — beat that: ${url}` }).catch(() => {})
      }
    } catch {
      Alert.alert('Error', 'Could not create challenge link — try again')
    }
    setCreatingChallenge(false)
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Games Hub</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Nollywood <Text style={{ color: colors.gold }}>Trivia</Text></Text>

      {!challengeIds && !done && step === 0 && !selected && (categoryOptions.length > 0 || actorOptions.length > 0) && (
        <View style={styles.filterRow}>
          {categoryOptions.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.sm }}>
              <Chip label="All categories" active={!categoryFilter} onPress={() => setCategoryFilter('')} />
              {categoryOptions.map(c => (
                <Chip key={c} label={c} active={categoryFilter === c} onPress={() => setCategoryFilter(c)} />
              ))}
            </ScrollView>
          )}
          {actorOptions.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Chip label="All legends" active={!actorFilter} onPress={() => setActorFilter('')} />
              {actorOptions.map(a => (
                <Chip key={a.id} label={a.name} active={actorFilter === a.id} onPress={() => setActorFilter(a.id)} />
              ))}
            </ScrollView>
          )}
        </View>
      )}

      {questions === null && <Text style={styles.muted}>Loading…</Text>}

      {questions && questions.length === 0 && (
        <Text style={styles.muted}>No trivia questions available yet — check back soon.</Text>
      )}

      {questions && questions.length > 0 && !done && (
        <>
          <Text style={styles.progress}>Question {step + 1} of {questions.length}</Text>
          <Text style={styles.question}>{questions[step].question}</Text>
          <View style={{ gap: spacing.sm }}>
            {OPTION_KEYS.map(opt => {
              const label = questions[step][`option_${opt}`]
              if (!label) return null
              const isCorrect = selected && opt === questions[step].correct_option
              const isWrongPick = selected === opt && opt !== questions[step].correct_option
              return (
                <TouchableOpacity
                  key={opt}
                  disabled={!!selected}
                  onPress={() => answer(opt)}
                  style={[
                    styles.optionBtn,
                    isCorrect && styles.optionCorrect,
                    isWrongPick && styles.optionWrong,
                  ]}
                >
                  <Text style={styles.optionText}>{label}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </>
      )}

      {done && (
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.scoreBig}>{score}/{questions.length}</Text>
          <Text style={styles.scoreMsg}>
            {score === questions.length ? 'Perfect score!' : score >= questions.length / 2 ? 'Solid outing.' : 'Room to grow — try again.'}
          </Text>
          {!challengeIds && !challengeUrl && (
            <TouchableOpacity style={styles.goldBtn} disabled={creatingChallenge} onPress={createChallenge}>
              <Text style={styles.goldBtnText}>{creatingChallenge ? 'Creating…' : 'Challenge a Friend'}</Text>
            </TouchableOpacity>
          )}
          {challengeUrl && (
            <TouchableOpacity style={styles.goldBtn} onPress={() => Share.share({ message: `Beat my Nollywood Trivia score: ${challengeUrl}` })}>
              <Text style={styles.goldBtnText}>Share Challenge Link</Text>
            </TouchableOpacity>
          )}
          {challengeId && (
            <TouchableOpacity
              style={{ marginTop: spacing.sm }}
              onPress={() => attemptRecorded && navigation.navigate('ChallengeScoreboard', { challengeId })}
            >
              <Text style={styles.linkText}>
                {attemptRecorded ? 'See the scoreboard →' : session ? 'Saving your score…' : 'Sign in to save your score'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  )
}

function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.xxl },
  back: { color: colors.text2, fontSize: fontSizes.sm, marginBottom: spacing.md },
  title: { fontFamily: undefined, fontSize: fontSizes.xl, fontWeight: '900', color: colors.text, marginBottom: spacing.lg },
  filterRow: { marginBottom: spacing.lg },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: radii.full, borderWidth: 1, borderColor: colors.bg4, backgroundColor: colors.bg2, marginRight: spacing.sm },
  chipActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  chipText: { color: colors.text2, fontSize: fontSizes.xs },
  chipTextActive: { color: '#000', fontWeight: '600' },
  muted: { color: colors.text4, textAlign: 'center', paddingVertical: spacing.xxl },
  progress: { fontSize: fontSizes.xs, color: colors.text4, marginBottom: spacing.sm },
  question: { fontSize: fontSizes.lg, fontWeight: '600', color: colors.text, marginBottom: spacing.lg },
  optionBtn: { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.bg4, borderRadius: radii.md, padding: spacing.md },
  optionCorrect: { backgroundColor: 'rgba(90,190,120,0.15)', borderColor: colors.green },
  optionWrong: { backgroundColor: 'rgba(220,90,90,0.15)', borderColor: colors.red },
  optionText: { color: colors.text, fontSize: fontSizes.md },
  scoreBig: { fontSize: 44, fontWeight: '900', color: colors.gold, marginBottom: 6 },
  scoreMsg: { color: colors.text2, marginBottom: spacing.lg },
  goldBtn: { backgroundColor: colors.gold, borderRadius: radii.md, paddingVertical: 12, paddingHorizontal: 28 },
  goldBtnText: { color: '#000', fontWeight: '600', fontSize: fontSizes.md },
  linkText: { color: colors.text2, fontSize: fontSizes.sm },
})
