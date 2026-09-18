// src/screens/AccountScreen.jsx
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import { useActiveProfile } from '../lib/ProfileContext'
import { colors, spacing, fontSizes, radii } from '../theme'
import Button from '../components/Button'

export default function AccountScreen({ navigation }) {
  const { session } = useAuth()
  const { setActiveProfile } = useActiveProfile()
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.from('users').select('*').eq('id', session.user.id).single()
      .then(({ data }) => setUser(data))
  }, [])

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.logo}>Naija<Text style={{ color: colors.gold }}>Rewind</Text></Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{session.user.email}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Plan</Text>
        <View style={styles.row}>
          <Text style={styles.value}>{user?.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : '—'}</Text>
          <View style={[styles.badge, { backgroundColor: user?.plan_status === 'active' ? 'rgba(90,186,120,0.15)' : 'rgba(220,90,90,0.15)' }]}>
            <Text style={{ color: user?.plan_status === 'active' ? colors.green : colors.red, fontSize: fontSizes.xs, fontWeight: '700' }}>
              {(user?.plan_status || 'unknown').toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.subscribeNote}>
        Manage your subscription — including upgrading, downgrading, or canceling — at naijarewind.com.
      </Text>

      <Button title="Switch Profile" variant="outline" onPress={() => setActiveProfile(null)} style={{ marginTop: spacing.lg }} />
      <Button title="Sign Out" variant="outline" onPress={() => supabase.auth.signOut()} style={{ marginTop: spacing.sm }} />

      <View style={styles.legalRow}>
        <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
          <Text style={styles.legalLink}>Terms of Service</Text>
        </TouchableOpacity>
        <Text style={styles.legalDot}>·</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Privacy')}>
          <Text style={styles.legalLink}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg, paddingTop: spacing.xxl },
  logo: { fontSize: fontSizes.lg, fontWeight: '900', color: colors.text, marginBottom: spacing.xl },
  card: { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.bg4, borderRadius: radii.md, padding: spacing.md, marginBottom: spacing.sm },
  label: { color: colors.text3, fontSize: fontSizes.xs, textTransform: 'uppercase', marginBottom: spacing.xs },
  value: { color: colors.text, fontSize: fontSizes.md, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  badge: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radii.sm },
  subscribeNote: { color: colors.text3, fontSize: fontSizes.sm, marginTop: spacing.md, lineHeight: 20 },
  legalRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.lg, gap: spacing.sm },
  legalLink: { color: colors.text3, fontSize: fontSizes.xs },
  legalDot: { color: colors.text4, fontSize: fontSizes.xs },
})
