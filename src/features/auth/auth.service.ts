import { supabase } from '../../lib/supabase'
import type { UserProfile, UserRole } from '../../types/auth'

type CurrentUserProfileRow = {
  id: string
  full_name: string
  email: string
  role: string
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    console.error('AUTH USER ERROR:', userError)
    throw userError
  }

  if (!user) {
    console.log('AUTH USER: tidak ada user aktif')
    return null
  }

  console.log('AUTH USER:', user.id, user.email)

  // Profile lookup is performed by a SECURITY DEFINER function that only
  // returns the profile belonging to auth.uid(). This avoids making the
  // browser depend on the RLS implementation details of employee_roles.
  const { data, error } = await supabase.rpc(
    'get_current_user_profile' as never,
  )

  if (error) {
    console.error('CURRENT USER PROFILE RPC ERROR:', error)
    throw error
  }

  const profile = (data as CurrentUserProfileRow[] | null)?.[0]

  if (!profile) {
    console.error('CURRENT USER PROFILE: tidak ditemukan')
    return null
  }

  console.log('CURRENT USER PROFILE:', profile)

  return {
    id: profile.id,
    fullName: profile.full_name,
    email: profile.email || user.email || '',
    role: profile.role as UserRole,
  }
}
