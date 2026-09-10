// src/screens/SubscribeScreen.jsx
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { supabase } from '../lib/supabase'
import { colors, spacing, fontSizes } from '../theme'

export default function SubscribeScreen({ onRefresh, refreshing }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Naija<Text style={{ color: colors.gold }}>Rewind</Text></Text>
      <Text style={styles.title}>You're logged in — almost there</Text>
      <Text style={styles.body}>
        To watch, subscribe at naijarewind.com. Once you've subscribed, tap the button below to unlock your account.
      </Text>
      <TouchableOpacity onPress={onRefresh} disabled={refreshing} style={styles.refreshButton}>
        {refreshing ? <ActivityIndicator color={colors.gold} /> : <Text style={styles.refreshText}>I've subscribed — refresh</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => supabase.auth.signOut()} style={{ marginTop: spacing.xl }}>
        <Text style={styles.link}>Log out</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.xl },
  logo: { fontSize: fontSizes.xl, fontWeight: '900', color: colors.text, marginBottom: spacing.xl },
  title: { fontSize: fontSizes.lg, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: spacing.md },
  body: { fontSize: fontSizes.md, color: colors.text2, textAlign: 'center', lineHeight: 22 },
  refreshButton: { backgroundColor: colors.gold, borderRadius: 10, paddingVertical: 14, paddingHorizontal: 28, marginTop: spacing.xl, minWidth: 220, alignItems: 'center' },
  refreshText: { color: '#000', fontWeight: '700', fontSize: fontSizes.md },
  link: { color: colors.text3, fontSize: fontSizes.sm },
})
