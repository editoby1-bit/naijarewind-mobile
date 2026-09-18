// src/screens/games/MatchFacesScreen.jsx
import { useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Share, Alert } from 'react-native'
import { apiGet, apiPost } from '../../lib/api'
import { useAuth } from '../../lib/AuthContext'
import { colors, spacing, fontSizes, radii } from '../../theme'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MatchFacesScreen({ route, navigation }) {
  const { session } = useAuth()
  const challengeIds = route?.params?.challengeIds
  const challengeId = route?.params?.challengeId

  const [actors, setActors] = useState(null)
  const [notEnough, setNotEnough] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [matched, setMatched] = useState({}) // id -> true
  const [attempted, setAttempted] = useState({}) // id -> true (first attempt used, whether right or wrong)
  const [score, setScore] = useState(0)
  const [wrongFlash, setWrongFlash] = useState(null)
  const [done, setDone] = useState(false)
  const [creatingChallenge, setCreatingChallenge] = useState(false)
  const [challengeUrl, setChallengeUrl] = useState(null)
  const [attemptRecorded, setAttemptRecorded] = useState(false)

  useEffect(() => {
    const url = challengeIds ? `/api/games/match-faces?ids=${challengeIds}` : `/api/games/match-faces?limit=6`
    setActors(null)
    apiGet(url)
      .then(({ actors, notEnoughActors }) => { setActors(actors || []); setNotEnough(!!notEnoughActors) })
      .catch(() => setActors([]))
  }, [challengeIds])

  const namesOrder = useMemo(() => actors ? shuffle(actors) : [], [actors])

  function pickPhoto(actor) {
    if (matched[actor.id]) return
    setSelectedPhoto(actor)
  }

  function pickName(actor) {
    if (!selectedPhoto || matched[actor.id]) return
    const correct = selectedPhoto.id === actor.id
    const wasFirstAttempt = !attempted[selectedPhoto.id]

    if (correct) {
      setMatched(m => {
        const next = { ...m, [selectedPhoto.id]: true }
        if (Object.keys(next).length === actors.length) finish(next)
        return next
      })
      if (wasFirstAttempt) setScore(s => s + 1)
      setAttempted(a => ({ ...a, [selectedPhoto.id]: true }))
      setSelectedPhoto(null)
    } else {
      setAttempted(a => ({ ...a, [selectedPhoto.id]: true }))
      setWrongFlash(actor.id)
      setTimeout(() => setWrongFlash(null), 500)
      setSelectedPhoto(null)
    }
  }

  function finish(matchedMap) {
    setDone(true)
    if (session) apiPost('/api/engagement/log', { eventType: 'match_faces_completed' }).catch(() => {})
    if (challengeId && session) {
      apiPost(`/api/games/challenge/${challengeId}`, {
        score, total: actors.length,
        label: session.user.user_metadata?.full_name || 'A friend',
      }).then(() => {
        setAttemptRecorded(true)
        apiPost('/api/engagement/log', { eventType: 'challenge_accepted' }).catch(() => {})
      }).catch(() => {})
    }
  }

  async function createChallenge() {
    if (!session) { Alert.alert('Sign in required', 'Sign in to challenge a friend'); return }
    setCreatingChallenge(true)
    try {
      const questionIds = actors.map(a => a.id)
      const data = await apiPost('/api/games/challenge/create', {
        gameType: 'match_faces', questionIds, score, total: actors.length,
        label: session.user.user_metadata?.full_name || 'A friend',
      })
      if (data.challengeId) {
        const url = `https://nollyvault.vercel.app/games/challenge/${data.challengeId}`
        setChallengeUrl(url)
        apiPost('/api/engagement/log', { eventType: 'challenge_created' }).catch(() => {})
        Share.share({ message: `I scored ${score}/${actors.length} on Match the Faces — beat that: ${url}` }).catch(() => {})
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
      <Text style={styles.title}>Match the <Text style={{ color: colors.gold }}>Faces</Text></Text>

      {actors === null && <Text style={styles.muted}>Loading…</Text>}
      {actors && notEnough && <Text style={styles.muted}>Not enough onboarded legends with photos yet — check back soon.</Text>}

      {actors && actors.length > 0 && !done && (
        <>
          <Text style={styles.hint}>Tap a photo, then tap the matching name.</Text>
          <View style={styles.photoGrid}>
            {actors.map(a => (
              <TouchableOpacity
                key={a.id}
                disabled={matched[a.id]}
                onPress={() => pickPhoto(a)}
                style={[
                  styles.photoWrap,
                  selectedPhoto?.id === a.id && styles.photoSelected,
                  matched[a.id] && styles.photoMatched,
                ]}
              >
                <Image source={{ uri: a.profile_image_url }} style={styles.photo} resizeMode="cover" />
                {matched[a.id] && <View style={styles.checkBadge}><Text style={{ color: '#fff', fontWeight: '700' }}>✓</Text></View>}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.nameList}>
            {namesOrder.map(a => (
              <TouchableOpacity
                key={a.id}
                disabled={matched[a.id]}
                onPress={() => pickName(a)}
                style={[
                  styles.nameBtn,
                  matched[a.id] && styles.nameMatched,
                  wrongFlash === a.id && styles.nameWrong,
                ]}
              >
                <Text style={[styles.nameText, matched[a.id] && { color: colors.text4 }]}>{a.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {done && (
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.scoreBig}>{score}/{actors.length}</Text>
          <Text style={styles.scoreMsg}>
            {score === actors.length ? 'Perfect score!' : score >= actors.length / 2 ? 'Solid outing.' : 'Room to grow — try again.'}
          </Text>
          {!challengeIds && !challengeUrl && (
            <TouchableOpacity style={styles.goldBtn} disabled={creatingChallenge} onPress={createChallenge}>
              <Text style={styles.goldBtnText}>{creatingChallenge ? 'Creating…' : 'Challenge a Friend'}</Text>
            </TouchableOpacity>
          )}
          {challengeUrl && (
            <TouchableOpacity style={styles.goldBtn} onPress={() => Share.share({ message: `Beat my Match the Faces score: ${challengeUrl}` })}>
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
  title: { fontSize: fontSizes.xl, fontWeight: '900', color: colors.text, marginBottom: spacing.sm },
  hint: { color: colors.text2, fontSize: fontSizes.sm, marginBottom: spacing.md },
  muted: { color: colors.text4, textAlign: 'center', paddingVertical: spacing.xxl },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  photoWrap: { width: '31%', aspectRatio: 1, borderRadius: radii.md, borderWidth: 2, borderColor: colors.bg4, overflow: 'hidden' },
  photoSelected: { borderColor: colors.gold },
  photoMatched: { opacity: 0.35, borderColor: colors.green },
  photo: { width: '100%', height: '100%', backgroundColor: colors.bg3 },
  checkBadge: { position: 'absolute', top: 4, right: 4, backgroundColor: colors.green, borderRadius: radii.full, width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  nameList: { gap: spacing.sm },
  nameBtn: { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.bg4, borderRadius: radii.md, padding: spacing.md },
  nameMatched: { backgroundColor: 'rgba(90,190,120,0.08)', borderColor: colors.green },
  nameWrong: { backgroundColor: 'rgba(220,90,90,0.15)', borderColor: colors.red },
  nameText: { color: colors.text, fontSize: fontSizes.md },
  scoreBig: { fontSize: 44, fontWeight: '900', color: colors.gold, marginBottom: 6 },
  scoreMsg: { color: colors.text2, marginBottom: spacing.lg },
  goldBtn: { backgroundColor: colors.gold, borderRadius: radii.md, paddingVertical: 12, paddingHorizontal: 28 },
  goldBtnText: { color: '#000', fontWeight: '600', fontSize: fontSizes.md },
  linkText: { color: colors.text2, fontSize: fontSizes.sm },
})
