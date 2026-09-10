// src/screens/WatchlistScreen.jsx
import { useState, useCallback } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { supabase } from '../lib/supabase'
import { useActiveProfile } from '../lib/ProfileContext'
import { colors, spacing, fontSizes } from '../theme'
import MovieCard from '../components/MovieCard'

export default function WatchlistScreen({ navigation }) {
  const { activeProfile } = useActiveProfile()
  const [movies, setMovies] = useState(null)

  const load = useCallback(() => {
    if (!activeProfile) return
    supabase.from('watchlists').select('movies(id, title, year, category, thumbnail_url)').eq('profile_id', activeProfile.id)
      .then(({ data }) => setMovies((data || []).map(r => r.movies).filter(Boolean)))
  }, [activeProfile])

  useFocusEffect(useCallback(() => { load() }, [load]))

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Naija<Text style={{ color: colors.gold }}>Rewind</Text></Text>
      <Text style={styles.title}>My Watchlist</Text>

      {movies === null && <Text style={styles.empty}>Loading…</Text>}
      {movies && movies.length === 0 && <Text style={styles.empty}>Nothing saved yet — add movies from their detail page.</Text>}

      <FlatList
        data={movies || []}
        keyExtractor={m => m.id}
        numColumns={2}
        columnWrapperStyle={{ paddingHorizontal: spacing.lg, justifyContent: 'space-between' }}
        contentContainerStyle={{ gap: spacing.md }}
        renderItem={({ item }) => (
          <View style={{ width: '48%' }}>
            <MovieCard movie={item} onPress={m => navigation.navigate('MovieDetail', { movieId: m.id })} width={150} />
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: spacing.xxl },
  logo: { fontSize: fontSizes.lg, fontWeight: '900', color: colors.text, paddingHorizontal: spacing.lg, marginBottom: spacing.xs },
  title: { fontSize: fontSizes.xl, fontWeight: '900', color: colors.text, paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  empty: { color: colors.text3, paddingHorizontal: spacing.lg, fontSize: fontSizes.sm },
})
