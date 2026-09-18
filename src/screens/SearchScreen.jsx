// src/screens/SearchScreen.jsx
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native'
import { apiGet } from '../lib/api'
import { colors, spacing, fontSizes, radii } from '../theme'

export default function SearchScreen({ navigation }) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState(null)

  useEffect(() => {
    if (q.trim().length < 2) { setResults(null); return }
    const t = setTimeout(() => {
      apiGet(`/api/search?q=${encodeURIComponent(q.trim())}`)
        .then(setResults)
        .catch(() => setResults({ movies: [], actors: [] }))
    }, 300)
    return () => clearTimeout(t)
  }, [q])

  return (
    <View style={styles.container}>
      <TextInput
        autoFocus
        style={styles.input}
        placeholder="Search movies, legends…"
        placeholderTextColor={colors.text4}
        value={q}
        onChangeText={setQ}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        {q.trim().length >= 2 && results === null && <Text style={styles.muted}>Searching…</Text>}

        {results && results.movies.length === 0 && results.actors.length === 0 && (
          <Text style={styles.muted}>No matches for "{q}".</Text>
        )}

        {results && results.movies.length > 0 && (
          <View style={{ marginBottom: spacing.xl }}>
            <Text style={styles.sectionLabel}>Movies</Text>
            <View style={styles.movieGrid}>
              {results.movies.map(m => (
                <TouchableOpacity key={m.id} style={styles.movieCard} onPress={() => navigation.navigate('MovieDetail', { movieId: m.id })}>
                  <View style={styles.poster}>
                    {m.thumbnail_url ? <Image source={{ uri: m.thumbnail_url }} style={styles.posterImg} resizeMode="cover" /> : null}
                  </View>
                  <Text style={styles.movieTitle} numberOfLines={1}>{m.title}</Text>
                  <Text style={styles.movieYear}>{m.year}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {results && results.actors.length > 0 && (
          <View>
            <Text style={styles.sectionLabel}>Legends</Text>
            <View style={styles.actorGrid}>
              {results.actors.map(a => (
                <View key={a.id} style={styles.actorItem}>
                  {a.profile_image_url ? (
                    <Image source={{ uri: a.profile_image_url }} style={styles.actorPhoto} />
                  ) : (
                    <View style={[styles.actorPhoto, { backgroundColor: colors.bg3 }]} />
                  )}
                  <Text style={styles.actorName} numberOfLines={1}>{a.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const CARD_WIDTH = '31%'

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: spacing.xxl, paddingHorizontal: spacing.lg },
  input: { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.bg4, borderRadius: radii.md, color: colors.text, padding: 14, fontSize: fontSizes.md, marginBottom: spacing.lg },
  muted: { color: colors.text4, textAlign: 'center', paddingVertical: spacing.xxl },
  sectionLabel: { fontSize: fontSizes.xs, color: colors.text4, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.md },
  movieGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  movieCard: { width: CARD_WIDTH },
  poster: { aspectRatio: 2 / 3, borderRadius: radii.sm, overflow: 'hidden', backgroundColor: colors.bg3, marginBottom: 6 },
  posterImg: { width: '100%', height: '100%' },
  movieTitle: { fontSize: fontSizes.sm, fontWeight: '500', color: colors.text },
  movieYear: { fontSize: fontSizes.xs, color: colors.text4 },
  actorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  actorItem: { width: '22%', alignItems: 'center' },
  actorPhoto: { width: 56, height: 56, borderRadius: radii.full, marginBottom: 6 },
  actorName: { fontSize: fontSizes.xs, color: colors.text, textAlign: 'center' },
})
