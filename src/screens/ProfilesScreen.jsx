// src/screens/ProfilesScreen.jsx
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal } from 'react-native'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'
import { colors, spacing, fontSizes, radii } from '../theme'
import Button from '../components/Button'

const COLORS = ['#c8a84b','#e85d9a','#5de8c8','#7b68ee','#e8774a','#4ace8a']

export default function ProfilesScreen({ onSelectProfile }) {
  const { session } = useAuth()
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => { loadProfiles() }, [])

  async function loadProfiles() {
    const { data } = await supabase.from('profiles').select('*').eq('user_id', session.user.id).order('created_at')
    setProfiles(data || [])
    setLoading(false)
  }

  async function handleAdd() {
    if (!newName.trim()) return
    setAdding(true)
    const color = COLORS[profiles.length % COLORS.length]
    await supabase.from('profiles').insert({
      user_id: session.user.id, name: newName.trim(), avatar_color: color, avatar_initials: newName.trim()[0].toUpperCase(),
    })
    setNewName('')
    setShowAdd(false)
    setAdding(false)
    loadProfiles()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Naija<Text style={{ color: colors.gold }}>Rewind</Text></Text>
      <Text style={styles.title}>Who's watching?</Text>

      <FlatList
        data={profiles}
        numColumns={3}
        keyExtractor={p => p.id}
        contentContainerStyle={{ alignItems: 'center' }}
        ListEmptyComponent={!loading && <Text style={styles.empty}>No profiles yet — add one below.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.profileCard} onPress={() => onSelectProfile(item)}>
            <View style={[styles.avatar, { backgroundColor: item.avatar_color }]}>
              <Text style={styles.avatarText}>{item.avatar_initials}</Text>
            </View>
            <Text style={styles.profileName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.addCard} onPress={() => setShowAdd(true)}>
        <Text style={{ fontSize: 28, color: colors.text3 }}>+</Text>
        <Text style={styles.profileName}>Add Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => supabase.auth.signOut()} style={{ marginTop: spacing.xl }}>
        <Text style={styles.link}>Sign Out</Text>
      </TouchableOpacity>

      <Modal visible={showAdd} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor={colors.text4}
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />
            <Button title="Add" onPress={handleAdd} loading={adding} disabled={!newName.trim()} />
            <TouchableOpacity onPress={() => setShowAdd(false)} style={{ marginTop: spacing.sm, alignItems: 'center' }}>
              <Text style={styles.link}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  logo: { fontSize: fontSizes.lg, fontWeight: '900', color: colors.text, marginBottom: spacing.sm },
  title: { fontSize: fontSizes.xl, fontWeight: '900', color: colors.text, marginBottom: spacing.xl },
  empty: { color: colors.text3, marginBottom: spacing.lg },
  profileCard: { alignItems: 'center', margin: spacing.sm, width: 90 },
  addCard: { alignItems: 'center', margin: spacing.sm, width: 90, marginTop: spacing.md },
  avatar: { width: 64, height: 64, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs },
  avatarText: { color: '#000', fontWeight: '900', fontSize: fontSizes.lg },
  profileName: { color: colors.text2, fontSize: fontSizes.sm, marginTop: spacing.xs },
  link: { color: colors.text3, fontSize: fontSizes.sm },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: spacing.xl },
  modalCard: { backgroundColor: colors.bg2, borderRadius: radii.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.bg4 },
  modalTitle: { color: colors.text, fontSize: fontSizes.lg, fontWeight: '700', marginBottom: spacing.md },
  input: {
    backgroundColor: colors.bg3, borderWidth: 1, borderColor: colors.bg4, borderRadius: radii.md,
    color: colors.text, padding: 12, fontSize: fontSizes.md, marginBottom: spacing.md,
  },
})
