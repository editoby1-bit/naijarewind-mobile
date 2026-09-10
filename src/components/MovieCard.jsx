// src/components/MovieCard.jsx
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { colors, radii, fontSizes, spacing } from '../theme'

export default function MovieCard({ movie, onPress, width = 130 }) {
  const height = width * 1.42
  return (
    <TouchableOpacity onPress={() => onPress(movie)} style={{ width, marginRight: spacing.sm }}>
      <View style={[styles.poster, { width, height }]}>
        {movie.thumbnail_url ? (
          <Image source={{ uri: movie.thumbnail_url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        ) : (
          <View style={styles.posterFallback}>
            <Text style={styles.posterFallbackText}>{movie.title}</Text>
          </View>
        )}
      </View>
      <Text style={styles.title} numberOfLines={1}>{movie.title}</Text>
      <Text style={styles.year}>{movie.year}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  poster: { borderRadius: radii.sm, backgroundColor: colors.bg3, borderWidth: 1, borderColor: colors.bg4, overflow: 'hidden' },
  posterFallback: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.sm },
  posterFallbackText: { color: colors.text3, fontSize: fontSizes.xs, textAlign: 'center' },
  title: { color: colors.text, fontSize: fontSizes.sm, marginTop: spacing.xs, fontWeight: '500' },
  year: { color: colors.text3, fontSize: fontSizes.xs },
})
