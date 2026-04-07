import React, { createContext, useState, useEffect } from 'react'
import { getFinancialProfile, createFinancialProfile, updateFinancialProfile } from '../api'

export const FinancialContext = createContext({
  profile: null,
  loading: false,
  loadProfile: async () => {},
  saveProfile: async () => {},
})

export function FinancialProvider({ children }) {
  // If user is already authenticated (token present) prefer server profile
  const [profile, setProfile] = useState(() => {
    try {
      const token = localStorage.getItem('token')
      if (token) return null
      const raw = localStorage.getItem('financial_profile')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      if (profile) localStorage.setItem('financial_profile', JSON.stringify(profile))
      else localStorage.removeItem('financial_profile')
    } catch {
      /* ignore */
    }
  }, [profile])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const p = await getFinancialProfile()
      setProfile(p)
      return p
    } finally {
      setLoading(false)
    }
  }

  // On mount, if token exists prefer loading server profile immediately
  useEffect(() => {
    try {
      if (localStorage.getItem('token')) {
        // load and overwrite any cached profile
        loadProfile().catch(() => {})
      }
    } catch {}
  }, [])

  const saveProfile = async (payload) => {
    setLoading(true)
    try {
      let res = null
      if (profile && profile.id) {
        res = await updateFinancialProfile(payload)
      } else {
        res = await createFinancialProfile(payload)
      }
      // API may return the saved profile
      const saved = res || payload
      setProfile(saved)
      return saved
    } finally {
      setLoading(false)
    }
  }

  return (
    <FinancialContext.Provider value={{ profile, loading, loadProfile, saveProfile, setProfile }}>
      {children}
    </FinancialContext.Provider>
  )
}

export default FinancialProvider
