// src/lib/supabase.js
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants'

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {}
const { supabaseUrl, supabaseAnonKey } = extra

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `Missing Supabase config in app.json's expo.extra — supabaseUrl: ${supabaseUrl ? 'set' : 'MISSING'}, supabaseAnonKey: ${supabaseAnonKey ? 'set' : 'MISSING'}`
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
