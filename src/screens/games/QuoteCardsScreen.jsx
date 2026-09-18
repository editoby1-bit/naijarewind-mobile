// src/screens/games/QuoteCardsScreen.jsx
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Share } from 'react-native'
import { apiGet, apiPost } from '../../lib/api'
import { useAuth } from '../../lib/AuthContext'
import { colors, spacing, fontSizes, radii } from '../../theme'

export default function QuoteCardsScreen({ navigation }) {
  const { session } = useAuth()
  const [quotes, setQuotes] = useState(null)

  useEffect(() => {
    apiGet('/api/quotes/list').then(({ quotes }) => setQuotes(quotes || [])).catch(() => setQuotes([]))
  }, [])

  async function handleShare(q) {
    const attribution = [q.character_name, q.movie_title_snapshot].filter(Boolean).join(' — ')
    const message = `"${q.quote_text}"${attribution ? `\n— ${attribution}` : ''}\n\nvia NaijaRewind`
    try {
      await Share.share({ message })
      if (session) apiPost('/api/engagement/log', { eventType: 'quote_shared' }).catch(() => {})
    } catch {}
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.xxl }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Games Hub</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Quote <Text style={{ color: colors.gold }}>Cards</Text></Text>
      <Text style={styles.subtitle}>Iconic lines from the classics. Share your favorite.</Text>

      {quotes === null && <Text style={styles.muted}>Loading…</Text>}
      {quotes && quotes.length === 0 && <Text style={styles.muted}>No quote cards published yet — check back soon.</Text>}

      <View style={{ gap: spacing.lg }}>
        {quotes && quotes.map(q => {
          const attribution = [q.character_name, q.movie_title_snapshot].filter(Boolean).join(' — ')
          const Wrapper = q.background_image_url ? ImageBackground : View
          const wrapperProps = q.background_image_url
            ? { source: { uri: q.background_image_url }, imageStyle: { borderRadius: radii.lg } }
            : {}
          return (
            <View key={q.id} style={styles.card}>
              <Wrapper {...wrapperProps} style={styles.cardImage}>
                <View style={styles.overlay} />
                <Text style={styles.quoteMark}>“</Text>
                <Text style={styles.quoteText}>{q.quote_text}</Text>
                {attribution ? <Text style={styles.attribution}>{attribution}</Text> : null}
              </Wrapper>
              <TouchableOpacity style={styles.shareBtn} onPress={() => handleShare(q)}>
                <Text style={styles.shareBtnText}>Share</Text>
              </TouchableOpacity>
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  back: { color: colors.text2, fontSize: fontSizes.sm, marginBottom: spacing.md },
  title: { fontSize: fontSizes.xl, fontWeight: '900', color: colors.text, marginBottom: 4 },
  subtitle: { color: colors.text2, fontSize: fontSizes.sm, marginBottom: spacing.lg },
  muted: { color: colors.text4, textAlign: 'center', paddingVertical: spacing.xxl },
  card: { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.bg4, borderRadius: radii.lg, padding: spacing.sm, overflow: 'hidden' },
  cardImage: { minHeight: 220, borderRadius: radii.md, backgroundColor: '#1a0f00', padding: spacing.lg, justifyContent: 'center', overflow: 'hidden' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8,8,8,0.5)' },
  quoteMark: { color: 'rgba(200,168,75,0.5)', fontSize: 48, fontWeight: '900', lineHeight: 48 },
  quoteText: { color: colors.text, fontSize: fontSizes.lg, fontWeight: '600', lineHeight: 26, marginTop: 4 },
  attribution: { color: colors.gold, fontSize: fontSizes.sm, fontWeight: '600', marginTop: spacing.md },
  shareBtn: { marginTop: spacing.sm, backgroundColor: colors.gold, borderRadius: radii.md, paddingVertical: 11, alignItems: 'center' },
  shareBtnText: { color: '#000', fontWeight: '600', fontSize: fontSizes.md },
})
