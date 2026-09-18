// src/screens/LoginScreen.jsx
import { useState } from 'react'
import { Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'
import { supabase } from '../lib/supabase'
import { colors, spacing, fontSizes, radii } from '../theme'
import Button from '../components/Button'

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.logo}>Naija<Text style={{ color: colors.gold }}>Rewind</Text></Text>
      <Text style={styles.title}>Welcome back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.text4}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.text4}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Log In" onPress={handleLogin} loading={loading} disabled={!email || !password} style={{ marginTop: spacing.sm }} />

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={{ marginTop: spacing.md }}>
        <Text style={styles.forgotLink}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={{ marginTop: spacing.lg }}>
        <Text style={styles.link}>New here? Create an account</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', paddingHorizontal: spacing.xl },
  logo: { fontSize: fontSizes.xl, fontWeight: '900', color: colors.text, textAlign: 'center', marginBottom: spacing.xxl },
  title: { fontSize: fontSizes.lg, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: spacing.lg },
  input: {
    backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.bg4, borderRadius: radii.md,
    color: colors.text, padding: 14, fontSize: fontSizes.md, marginBottom: spacing.sm,
  },
  error: { color: colors.red, fontSize: fontSizes.sm, marginBottom: spacing.sm, textAlign: 'center' },
  link: { color: colors.gold, textAlign: 'center', fontSize: fontSizes.sm },
  forgotLink: { color: colors.text3, textAlign: 'center', fontSize: fontSizes.xs },
})
