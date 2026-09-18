// src/screens/ForgotPasswordScreen.jsx
//
// Mobile-specific simplification: web's reset-password.js relies on
// Supabase auto-detecting the PASSWORD_RECOVERY session from the emailed
// link's URL fragment (detectSessionInUrl). The mobile Supabase client has
// detectSessionInUrl: false and this app has no URL scheme / deep-link
// handling configured yet, so there's no way to catch that link natively.
// Instead, the reset link still points at the web reset-password page —
// the user finishes setting their new password there (opens in their
// phone's browser), then comes back here to log in. If you want a fully
// native reset flow later, it needs an app.json "scheme", a Linking
// config on the navigator, and a native ResetPasswordScreen that reads
// the incoming URL — worth doing, just not done here.
import { useState } from 'react'
import { Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'
import { supabase } from '../lib/supabase'
import { colors, spacing, fontSizes, radii } from '../theme'
import Button from '../components/Button'

const WEB_RESET_URL = 'https://nollyvault.vercel.app/reset-password'

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    // Never reveal whether an email exists — show success either way.
    await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: WEB_RESET_URL }).catch(() => {})
    setSent(true)
    setLoading(false)
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.logo}>Naija<Text style={{ color: colors.gold }}>Rewind</Text></Text>

      {sent ? (
        <>
          <Text style={styles.emoji}>✉️</Text>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.body}>
            If an account exists for <Text style={{ color: colors.text, fontWeight: '600' }}>{email}</Text>, a password reset link is on its way. Open it on your phone or computer to set a new password, then come back here to sign in.
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.title}>Reset your password</Text>
          <Text style={styles.body}>Enter the email on your account and we'll send you a link to reset it.</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.text4}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Button title="Send Reset Link" onPress={handleSubmit} loading={loading} disabled={!email} style={{ marginTop: spacing.sm }} />
        </>
      )}

      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: spacing.lg }}>
        <Text style={styles.link}>← Back to sign in</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', paddingHorizontal: spacing.xl },
  logo: { fontSize: fontSizes.xl, fontWeight: '900', color: colors.text, textAlign: 'center', marginBottom: spacing.xxl },
  emoji: { fontSize: 36, textAlign: 'center', marginBottom: spacing.md },
  title: { fontSize: fontSizes.lg, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: spacing.sm },
  body: { color: colors.text2, fontSize: fontSizes.sm, textAlign: 'center', lineHeight: 20, marginBottom: spacing.lg },
  input: {
    backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.bg4, borderRadius: radii.md,
    color: colors.text, padding: 14, fontSize: fontSizes.md, marginBottom: spacing.sm,
  },
  link: { color: colors.gold, textAlign: 'center', fontSize: fontSizes.sm },
})
