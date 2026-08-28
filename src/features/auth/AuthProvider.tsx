import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import { getCurrentUserProfile } from './auth.service'
import type { UserProfile } from '../../types/auth'

type AuthContextValue = {
  session: Session | null
  user: User | null
  profile: UserProfile | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadProfile = async () => {
      try {
        const currentProfile = await getCurrentUserProfile()
        if (mounted) setProfile(currentProfile)
      } catch (error) {
        console.error('Failed to load user profile:', error)
        if (mounted) setProfile(null)
      }
    }

    const initializeAuth = async () => {
      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession()

        if (error) throw error
        if (!mounted) return

        setSession(currentSession)
        if (currentSession) {
          await loadProfile()
        } else {
          setProfile(null)
        }
      } catch (error) {
        console.error('Failed to initialize authentication:', error)
        if (mounted) {
          setSession(null)
          setProfile(null)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    void initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!mounted) return

      setSession(currentSession)

      // Supabase may still hold its auth lock while this callback runs.
      // Defer the profile request until the callback has returned.
      setTimeout(() => {
        if (!mounted) return

        if (!currentSession) {
          setProfile(null)
          setLoading(false)
          return
        }

        void loadProfile().finally(() => {
          if (mounted) setLoading(false)
        })
      }, 0)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
    }),
    [session, profile, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
