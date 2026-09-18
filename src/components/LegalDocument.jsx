// src/components/LegalDocument.jsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { colors, spacing, fontSizes } from '../theme'

export default function LegalDocument({ title, goldWord, lastUpdatedNote, sections, navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.xxl }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title} <Text style={{ color: colors.gold }}>{goldWord}</Text></Text>
      <Text style={styles.updated}>{lastUpdatedNote}</Text>

      {sections.map(s => (
        <View key={s.h} style={{ marginBottom: spacing.lg }}>
          <Text style={styles.sectionHeading}>{s.h}</Text>
          <Text style={styles.sectionBody}>{s.body}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  back: { color: colors.text2, fontSize: fontSizes.sm, marginBottom: spacing.md },
  title: { fontFamily: undefined, fontSize: fontSizes.xl, fontWeight: '900', color: colors.text, marginBottom: 6 },
  updated: { color: colors.text4, fontSize: fontSizes.xs, marginBottom: spacing.lg },
  sectionHeading: { color: colors.text, fontSize: fontSizes.md, fontWeight: '700', marginBottom: spacing.sm },
  sectionBody: { color: colors.text2, fontSize: fontSizes.sm, lineHeight: 21 },
})
