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

        if (mounted) {
          setProfile(currentProfile)
        }
      } catch (error) {
        console.error('Failed to load user profile:', error)

        if (mounted) {
          setProfile(null)
        }
      }
    }

    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!mounted) {
        return
      }

      setSession(session)

      if (session) {
        await loadProfile()
      } else {
        setProfile(null)
      }

      if (mounted) {
        setLoading(false)
      }
    }

    void initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)

      if (session) {
        await loadProfile()
      } else {
        setProfile(null)
      }

      if (mounted) {
        setLoading(false)
      }
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

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
