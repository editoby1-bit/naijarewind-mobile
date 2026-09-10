// src/navigation/RootNavigator.jsx
import { useEffect, useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { useAuth } from '../lib/AuthContext'
import { useActiveProfile } from '../lib/ProfileContext'
import { supabase } from '../lib/supabase'
import { colors } from '../theme'
import AuthStack from './AuthStack'
import SubscribeScreen from '../screens/SubscribeScreen'
import ProfilesScreen from '../screens/ProfilesScreen'
import MainStack from './MainStack'

export default function RootNavigator() {
  const { session, loading: authLoading } = useAuth()
  const { activeProfile, setActiveProfile } = useActiveProfile()
  const [planStatus, setPlanStatus] = useState(null)
  const [checkingPlan, setCheckingPlan] = useState(true)

  function checkPlan() {
    if (!session) { setCheckingPlan(false); return }
    setCheckingPlan(true)
    supabase.from('users').select('plan_status').eq('id', session.user.id).single()
      .then(({ data }) => { setPlanStatus(data?.plan_status || null); setCheckingPlan(false) })
      .catch(() => { setPlanStatus(null); setCheckingPlan(false) })
  }

  useEffect(() => { checkPlan() }, [session])

  if (authLoading || (session && checkingPlan)) {
    return <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={colors.gold} size="large" /></View>
  }

  if (!session) return <AuthStack />
  if (planStatus !== 'active') return <SubscribeScreen onRefresh={checkPlan} refreshing={checkingPlan} />
  if (!activeProfile) return <ProfilesScreen onSelectProfile={setActiveProfile} />
  return <MainStack />
}
