// src/screens/BrowseScreen.jsx
import { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, ScrollView, FlatList, RefreshControl } from 'react-native'
import { supabase } from '../lib/supabase'
import { useActiveProfile } from '../lib/ProfileContext'
import { colors, spacing, fontSizes, radii } from '../theme'
import Button from '../components/Button'
import MovieCard from '../components/MovieCard'

export default function BrowseScreen({ navigation }) {
  const { activeProfile } = useActiveProfile()
  const [movies, setMovies] = useState(null)
  const [continueWatching, setContinueWatching] = useState([])
  const [legends, setLegends] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  async function load() {
    const { data, error } = await supabase
      .from('movies')
      .select('id, title, year, category, thumbnail_url, description, is_featured')
      .eq('is_active', true)
      .order('year', { ascending: false })
    if (error) { console.error(error.message); setMovies([]); return }
    setMovies(data || [])

    if (activeProfile) {
      const { data: history } = await supabase
        .from('watch_history')
        .select('progress_seconds, movies(id, title, year, category, thumbnail_url, duration_seconds)')
        .eq('profile_id', activeProfile.id)
        .order('updated_at', { ascending: false })
        .limit(10)
      setContinueWatching((history || []).filter(h => h.movies).map(h => h.movies))
    }

    fetch('https://nollyvault.vercel.app/api/veterans/list-lite')
      .then(r => r.ok ? r.json() : { actors: [] })
      .then(({ actors }) => setLegends(actors || []))
      .catch(() => {})
  }

  useEffect(() => { load() }, [activeProfile])

  async function onRefresh() {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  const categories = movies ? [...new Set(movies.map(m => m.category).filter(Boolean))] : []
  const featured = movies?.find(m => m.is_featured) || movies?.[0]

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.gold} />}>
      <Text style={styles.logo}>Naija<Text style={{ color: colors.gold }}>Rewind</Text></Text>

      {movies === null && <Text style={styles.loading}>Loading…</Text>}

      {movies && movies.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>The Classics Are Coming</Text>
          <Text style={styles.emptyBody}>We're finalizing licensing with the rights holders behind the films you remember. Nothing's live yet — check back soon.</Text>
        </View>
      )}

      {featured && (
        <View style={styles.hero}>
          {featured.thumbnail_url && <Image source={{ uri: featured.thumbnail_url }} style={StyleSheet.absoluteFill} resizeMode="cover" />}
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{featured.title}</Text>
            <Text style={styles.heroMeta}>{featured.year} · {featured.category}</Text>
            {featured.description && <Text style={styles.heroDesc} numberOfLines={2}>{featured.description}</Text>}
            <Button title="▶ Watch Now" onPress={() => navigation.navigate('Watch', { movieId: featured.id, title: featured.title })} style={{ marginTop: spacing.sm, alignSelf: 'flex-start', paddingHorizontal: spacing.xl }} />
          </View>
        </View>
      )}

      {continueWatching.length > 0 && (
        <View style={{ marginBottom: spacing.lg }}>
          <Text style={styles.sectionTitle}>Continue Watching</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={continueWatching}
            keyExtractor={m => m.id}
            contentContainerStyle={{ paddingHorizontal: spacing.lg }}
            renderItem={({ item }) => <MovieCard movie={item} onPress={m => navigation.navigate('MovieDetail', { movieId: m.id })} />}
          />
        </View>
      )}

      {legends.length > 0 && (
        <View style={{ marginBottom: spacing.lg }}>
          <Text style={styles.sectionTitle}>Legendary Stars</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.lg, gap: 8 }}>
            {legends.map(a => (
              <View key={a.id} style={styles.pill}><Text style={styles.pillText}>{a.name}</Text></View>
            ))}
          </View>
        </View>
      )}

      {categories.map(cat => (
        <View key={cat} style={{ marginBottom: spacing.lg }}>
          <Text style={styles.sectionTitle}>{cat}</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={movies.filter(m => m.category === cat)}
            keyExtractor={m => m.id}
            contentContainerStyle={{ paddingHorizontal: spacing.lg }}
            renderItem={({ item }) => <MovieCard movie={item} onPress={m => navigation.navigate('MovieDetail', { movieId: m.id })} />}
          />
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: spacing.xxl },
  logo: { fontSize: fontSizes.lg, fontWeight: '900', color: colors.text, paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  loading: { color: colors.text3, paddingHorizontal: spacing.lg },
  empty: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, alignItems: 'center', marginBottom: spacing.lg },
  emptyTitle: { color: colors.gold, fontSize: fontSizes.lg, fontWeight: '900', marginBottom: spacing.sm, textAlign: 'center' },
  emptyBody: { color: colors.text2, fontSize: fontSizes.sm, textAlign: 'center', lineHeight: 20 },
  hero: { height: 260, marginHorizontal: spacing.lg, borderRadius: radii.lg, overflow: 'hidden', backgroundColor: colors.bg3, marginBottom: spacing.lg, justifyContent: 'flex-end' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8,8,8,0.55)' },
  heroContent: { padding: spacing.md },
  heroTitle: { color: colors.text, fontSize: fontSizes.xl, fontWeight: '900' },
  heroMeta: { color: colors.text3, fontSize: fontSizes.xs, marginTop: 2, marginBottom: 6 },
  heroDesc: { color: colors.text2, fontSize: fontSizes.sm },
  sectionTitle: { color: colors.text, fontSize: fontSizes.md, fontWeight: '700', paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  pill: { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.bg4, borderRadius: radii.full, paddingHorizontal: 14, paddingVertical: 8 },
  pillText: { color: colors.text2, fontSize: fontSizes.sm },
})
