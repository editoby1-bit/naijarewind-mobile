// src/screens/games/NameThatActorScreen.jsx
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Share, Alert } from 'react-native'
import { apiGet, apiPost } from '../../lib/api'
import { useAuth } from '../../lib/AuthContext'
import { colors, spacing, fontSizes, radii } from '../../theme'

export default function NameThatActorScreen({ route, navigation }) {
  const { session } = useAuth()
  const challengeIds = route?.params?.challengeIds
  const challengeId = route?.params?.challengeId

  const [questions, setQuestions] = useState(null)
  const [notEnough, setNotEnough] = useState(false)
  const [step, setStep] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [done, setDone] = useState(false)
  const [creatingChallenge, setCreatingChallenge] = useState(false)
  const [challengeUrl, setChallengeUrl] = useState(null)
  const [attemptRecorded, setAttemptRecorded] = useState(false)

  useEffect(() => {
    const url = challengeIds
      ? `/api/games/name-that-actor?ids=${challengeIds}`
      : `/api/games/name-that-actor?limit=8`
    setQuestions(null)
    apiGet(url)
      .then(({ questions, notEnoughActors }) => { setQuestions(questions || []); setNotEnough(!!notEnoughActors) })
      .catch(() => setQuestions([]))
  }, [challengeIds])

  function answer(opt) {
    if (selected) return
    setSelected(opt)
    const correct = questions[step].answer
    const finalScore = opt === correct ? score + 1 : score
    if (opt === correct) setScore(s => s + 1)

    setTimeout(() => {
      if (step + 1 < questions.length) {
        setStep(step + 1)
        setSelected(null)
      } else {
        setDone(true)
        if (session) apiPost('/api/engagement/log', { eventType: 'name_that_actor_completed' }).catch(() => {})
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
        gameType: 'name_that_actor', questionIds, score, total: questions.length,
        label: session.user.user_metadata?.full_name || 'A friend',
      })
      if (data.challengeId) {
        const url = `https://nollyvault.vercel.app/games/challenge/${data.challengeId}`
        setChallengeUrl(url)
        apiPost('/api/engagement/log', { eventType: 'challenge_created' }).catch(() => {})
        Share.share({ message: `I scored ${score}/${questions.length} on Name That Actor — beat that: ${url}` }).catch(() => {})
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
      <Text style={styles.title}>Name That <Text style={{ color: colors.gold }}>Actor</Text></Text>

      {questions === null && <Text style={styles.muted}>Loading…</Text>}

      {questions && notEnough && (
        <Text style={styles.muted}>Not enough onboarded legends with photos yet — check back soon.</Text>
      )}

      {questions && questions.length > 0 && !done && (
        <>
          <Text style={styles.progress}>Question {step + 1} of {questions.length}</Text>
          {questions[step].image && (
            <Image source={{ uri: questions[step].image }} style={styles.photo} resizeMode="cover" />
          )}
          <View style={{ gap: spacing.sm }}>
            {questions[step].options.map(opt => {
              const isCorrect = selected && opt === questions[step].answer
              const isWrongPick = selected === opt && opt !== questions[step].answer
              return (
                <TouchableOpacity
                  key={opt}
                  disabled={!!selected}
                  onPress={() => answer(opt)}
                  style={[styles.optionBtn, isCorrect && styles.optionCorrect, isWrongPick && styles.optionWrong]}
                >
                  <Text style={styles.optionText}>{opt}</Text>
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
            <TouchableOpacity style={styles.goldBtn} onPress={() => Share.share({ message: `Beat my Name That Actor score: ${challengeUrl}` })}>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.xxl },
  back: { color: colors.text2, fontSize: fontSizes.sm, marginBottom: spacing.md },
  title: { fontSize: fontSizes.xl, fontWeight: '900', color: colors.text, marginBottom: spacing.lg },
  muted: { color: colors.text4, textAlign: 'center', paddingVertical: spacing.xxl },
  progress: { fontSize: fontSizes.xs, color: colors.text4, marginBottom: spacing.sm },
  photo: { width: '100%', height: 280, borderRadius: radii.lg, marginBottom: spacing.lg, backgroundColor: colors.bg3 },
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
