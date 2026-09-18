// src/screens/LeaderboardScreen.jsx
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native'
import { apiGet } from '../lib/api'
import { colors, spacing, fontSizes, radii } from '../theme'

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' }

export default function LeaderboardScreen() {
  const [periodType, setPeriodType] = useState('week')
  const [data, setData] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  async function load(period) {
    try {
      const result = await apiGet(`/api/leaderboard/list?periodType=${period}`)
      setData(result)
    } catch {
      setData({ leaderboard: [] })
    }
  }

  useEffect(() => { setData(null); load(periodType) }, [periodType])

  async function onRefresh() {
    setRefreshing(true)
    await load(periodType)
    setRefreshing(false)
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.gold} />}
    >
      <Text style={styles.title}>🎬 Viewer Leaderboard</Text>
      <Text style={styles.subtitle}>
        Most active viewers, ranked by watching, sharing, captioning, and nominating. Top viewers each month get real rewards — discounts, and the chance to meet Nollywood legends working with us.
      </Text>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabBtn, periodType === 'week' && styles.tabBtnActive]}
          onPress={() => setPeriodType('week')}
        >
          <Text style={[styles.tabText, periodType === 'week' && styles.tabTextActive]}>This Week</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, periodType === 'month' && styles.tabBtnActive]}
          onPress={() => setPeriodType('month')}
        >
          <Text style={[styles.tabText, periodType === 'month' && styles.tabTextActive]}>This Month</Text>
        </TouchableOpacity>
      </View>

      {data?.winner && (
        <View style={styles.winnerCard}>
          <Text style={styles.winnerLabel}>🏆 Viewer of the {periodType === 'week' ? 'Week' : 'Month'}</Text>
          <Text style={styles.winnerName}>{data.winner.target_label}</Text>
        </View>
      )}

      {!data ? (
        <Text style={styles.empty}>Loading…</Text>
      ) : !data.leaderboard?.length ? (
        <Text style={styles.empty}>Nobody on the board yet — start watching and sharing to claim the top spot.</Text>
      ) : (
        <View style={{ gap: spacing.sm }}>
          {data.leaderboard.map(u => (
            <View key={u.rank} style={[styles.row, u.rank <= 3 && styles.rowTop]}>
              <Text style={[styles.rank, u.rank === 1 && styles.rankGold, u.rank > 1 && u.rank <= 3 && styles.rankSilver]}>
                {MEDALS[u.rank] || u.rank}
              </Text>
              <Text style={styles.name}>{u.name}</Text>
              <Text style={styles.points}>{u.points} pts</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: spacing.xxl, paddingHorizontal: spacing.lg },
  title: { fontSize: fontSizes.xl, fontWeight: '900', color: colors.text, marginBottom: 6 },
  subtitle: { color: colors.text2, fontSize: fontSizes.sm, marginBottom: spacing.lg, lineHeight: 20 },
  tabs: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  tabBtn: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: radii.full, borderWidth: 1, borderColor: colors.bg4, backgroundColor: colors.bg2 },
  tabBtnActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  tabText: { color: colors.text2, fontSize: fontSizes.sm },
  tabTextActive: { color: '#000', fontWeight: '600' },
  winnerCard: { backgroundColor: 'rgba(200,168,75,0.1)', borderWidth: 1, borderColor: 'rgba(200,168,75,0.35)', borderRadius: radii.lg, padding: spacing.md, marginBottom: spacing.lg },
  winnerLabel: { fontSize: fontSizes.xs, fontWeight: '700', color: colors.gold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  winnerName: { fontSize: fontSizes.lg, fontWeight: '700', color: colors.text },
  empty: { color: colors.text4, textAlign: 'center', paddingVertical: spacing.xxl, fontSize: fontSizes.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.bg4, borderRadius: radii.md },
  rowTop: { backgroundColor: 'rgba(200,168,75,0.06)' },
  rank: { width: 28, fontWeight: '800', fontSize: fontSizes.md, color: colors.text4 },
  rankGold: { color: colors.gold },
  rankSilver: { color: '#e0c987' },
  name: { flex: 1, fontWeight: '500', color: colors.text, fontSize: fontSizes.md },
  points: { fontSize: fontSizes.sm, color: colors.text2 },
})
