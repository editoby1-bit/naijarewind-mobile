// src/screens/MovieDetailScreen.jsx
import { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native'
import { supabase } from '../lib/supabase'
import { useActiveProfile } from '../lib/ProfileContext'
import { colors, spacing, fontSizes } from '../theme'
import Button from '../components/Button'

export default function MovieDetailScreen({ route, navigation }) {
  const { movieId } = route.params
  const { activeProfile } = useActiveProfile()
  const [movie, setMovie] = useState(null)
  const [inWatchlist, setInWatchlist] = useState(false)

  useEffect(() => {
    supabase.from('movies').select('*').eq('id', movieId).single()
      .then(({ data }) => setMovie(data))
  }, [movieId])

  useEffect(() => {
    if (!activeProfile) return
    supabase.from('watchlists').select('id').eq('profile_id', activeProfile.id).eq('movie_id', movieId).maybeSingle()
      .then(({ data }) => setInWatchlist(!!data))
  }, [activeProfile, movieId])

  async function toggleWatchlist() {
    if (!activeProfile) return
    if (inWatchlist) {
      await supabase.from('watchlists').delete().eq('profile_id', activeProfile.id).eq('movie_id', movieId)
      setInWatchlist(false)
    } else {
      await supabase.from('watchlists').insert({ profile_id: activeProfile.id, movie_id: movieId })
      setInWatchlist(true)
    }
  }

  if (!movie) return <View style={styles.container}><Text style={styles.loading}>Loading…</Text></View>

  return (
    <ScrollView style={styles.container}>
      {movie.thumbnail_url && <Image source={{ uri: movie.thumbnail_url }} style={styles.hero} resizeMode="cover" />}
      <View style={{ padding: spacing.lg }}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.meta}>{movie.year} · {movie.category}</Text>
        {movie.description && <Text style={styles.description}>{movie.description}</Text>}

        <Button title="▶ Watch Now" onPress={() => navigation.navigate('Watch', { movieId: movie.id, title: movie.title })} style={{ marginTop: spacing.lg }} />
        <Button title={inWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'} variant="outline" onPress={toggleWatchlist} style={{ marginTop: spacing.sm }} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  loading: { color: colors.text3, padding: spacing.lg },
  hero: { width: '100%', height: 260, backgroundColor: colors.bg3 },
  title: { fontSize: fontSizes.xl, fontWeight: '900', color: colors.text, marginBottom: spacing.xs },
  meta: { fontSize: fontSizes.sm, color: colors.text3, marginBottom: spacing.md },
  description: { fontSize: fontSizes.md, color: colors.text2, lineHeight: 22 },
})
