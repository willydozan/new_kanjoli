import { supabase } from '../../lib/supabase'
import type { UserProfile, UserRole } from '../../types/auth'

type CurrentUserProfileRow = {
  id: string
  full_name: string
  email: string | null
  role: string
}

const VALID_ROLES: UserRole[] = [
  'superadmin',
  'admin_pekppp',
  'admin_perencanaan',
  'admin_litbang',
  'admin_sekretariat',
  'pimpinan',
]

function normalizeProfile(
  row: CurrentUserProfileRow,
  fallbackEmail: string,
): UserProfile | null {
  if (!VALID_ROLES.includes(row.role as UserRole)) {
    console.error('CURRENT USER PROFILE: role tidak valid:', row.role)
    return null
  }

  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email || fallbackEmail,
    role: row.role as UserRole,
  }
}

async function loadProfileDirectly(
  userId: string,
  fallbackEmail: string,
): Promise<UserProfile | null> {
  const { data: employee, error: employeeError } = await supabase
    .from('employees')
    .select('id, full_name, email')
    .eq('auth_user_id', userId)
    .eq('is_active', true)
    .maybeSingle()

  if (employeeError) throw employeeError
  if (!employee) return null

  const { data: employeeRole, error: employeeRoleError } = await supabase
    .from('employee_roles')
    .select('role_id')
    .eq('employee_id', employee.id)
    .maybeSingle()

  if (employeeRoleError) throw employeeRoleError
  if (!employeeRole) return null

  const { data: role, error: roleError } = await supabase
    .from('roles')
    .select('code')
    .eq('id', employeeRole.role_id)
    .eq('is_active', true)
    .maybeSingle()

  if (roleError) throw roleError
  if (!role) return null

  return normalizeProfile(
    {
      id: employee.id,
      full_name: employee.full_name,
      email: employee.email,
      role: role.code,
    },
    fallbackEmail,
  )
}

async function loadProfileViaRpc(
  fallbackEmail: string,
): Promise<UserProfile | null> {
  const { data, error } = await supabase.rpc(
    'get_current_user_profile' as never,
  )

  if (error) throw error

  const profile = (data as CurrentUserProfileRow[] | null)?.[0]
  if (!profile) return null

  return normalizeProfile(profile, fallbackEmail)
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

  // Prefer the normal RLS-protected queries. The current database policies
  // explicitly allow an authenticated employee to read their own profile,
  // role assignment and active role. This path is easier to diagnose and
  // does not depend on PostgREST's RPC schema cache.
  try {
    const profile = await loadProfileDirectly(user.id, user.email ?? '')
    if (profile) {
      console.log('CURRENT USER PROFILE (direct):', profile)
      return profile
    }
  } catch (error) {
    console.warn('DIRECT PROFILE LOOKUP FAILED:', error)
  }

  // Keep the SECURITY DEFINER RPC as a fallback for deployments where RLS
  // policies have not yet propagated to the browser session.
  try {
    const profile = await loadProfileViaRpc(user.email ?? '')
    if (profile) {
      console.log('CURRENT USER PROFILE (rpc):', profile)
      return profile
    }
  } catch (error) {
    console.error('CURRENT USER PROFILE RPC ERROR:', error)
  }

  console.error('CURRENT USER PROFILE: tidak ditemukan')
  return null
}
