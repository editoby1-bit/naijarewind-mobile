// src/screens/WatchScreen.jsx
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import { WebView } from 'react-native-webview'
import { apiGet } from '../lib/api'
import { colors, spacing, fontSizes } from '../theme'

export default function WatchScreen({ route, navigation }) {
  const { movieId, title } = route.params
  const [streamUrl, setStreamUrl] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    apiGet(`/api/stream/${movieId}`)
      .then(({ streamUrl }) => setStreamUrl(streamUrl))
      .catch(e => setError(e.message))
  }, [movieId])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>← Back</Text></TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <View style={{ width: 50 }} />
      </View>

      {error ? (
        <View style={styles.center}><Text style={styles.error}>{error}</Text></View>
      ) : !streamUrl ? (
        <View style={styles.center}><ActivityIndicator color={colors.gold} size="large" /></View>
      ) : (
        <WebView
          source={{ uri: streamUrl }}
          style={{ flex: 1 }}
          allowsFullscreenVideo
          mediaPlaybackRequiresUserAction={false}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md, paddingTop: spacing.xl },
  back: { color: colors.text2, fontSize: fontSizes.sm },
  title: { color: colors.text, fontSize: fontSizes.sm, fontWeight: '600', flex: 1, textAlign: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { color: colors.red, padding: spacing.lg, textAlign: 'center' },
})
