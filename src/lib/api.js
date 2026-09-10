// src/lib/api.js
import Constants from 'expo-constants'
import { supabase } from './supabase'

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {}
const { apiBaseUrl } = extra

async function authHeaders() {
  const { data: { session } } = await supabase.auth.getSession()
  const headers = { 'Content-Type': 'application/json' }
  if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`
  return headers
}

export async function apiGet(path) {
  const headers = await authHeaders()
  const res = await fetch(`${apiBaseUrl}${path}`, { headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

export async function apiPost(path, body) {
  const headers = await authHeaders()
  const res = await fetch(`${apiBaseUrl}${path}`, { method: 'POST', headers, body: JSON.stringify(body || {}) })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}
