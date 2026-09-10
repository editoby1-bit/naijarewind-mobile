// App.js
import { Component } from 'react'
import { Text, ScrollView, StyleSheet } from 'react-native'
import { NavigationContainer, DarkTheme } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { AuthProvider } from './src/lib/AuthContext'
import { ProfileProvider } from './src/lib/ProfileContext'
import RootNavigator from './src/navigation/RootNavigator'
import { colors } from './src/theme'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error, info) {
    console.error('App crashed:', error, info)
  }
  render() {
    if (this.state.error) {
      return (
        <ScrollView style={styles.errorContainer} contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
          <Text style={styles.errorTitle}>Something crashed on startup</Text>
          <Text style={styles.errorMessage}>{String(this.state.error?.message || this.state.error)}</Text>
          <Text style={styles.errorStack}>{String(this.state.error?.stack || '')}</Text>
        </ScrollView>
      )
    }
    return this.props.children
  }
}

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.gold,
    background: colors.bg,
    card: colors.bg2,
    text: colors.text,
    border: colors.bg4,
    notification: colors.gold,
  },
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProfileProvider>
          <NavigationContainer theme={navTheme}>
            <StatusBar style="light" />
            <RootNavigator />
          </NavigationContainer>
        </ProfileProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  errorContainer: { flex: 1, backgroundColor: '#2a0808' },
  errorTitle: { color: '#ff6b6b', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  errorMessage: { color: '#fff', fontSize: 14, marginBottom: 16 },
  errorStack: { color: '#ffaaaa', fontSize: 11, fontFamily: 'monospace' },
})
