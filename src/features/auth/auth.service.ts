import { supabase } from '../../lib/supabase'
import type { UserProfile, UserRole } from '../../types/auth'

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

  const { data: employee, error: employeeError } = await supabase
    .from('employees')
    .select('id, full_name, email')
    .eq('auth_user_id', user.id)
    .eq('is_active', true)
    .maybeSingle()

  if (employeeError) {
    console.error('EMPLOYEE ERROR:', employeeError)
    throw employeeError
  }

  if (!employee) {
    console.error('EMPLOYEE: tidak ditemukan')
    return null
  }

  console.log('EMPLOYEE:', employee)

  const { data: employeeRole, error: employeeRoleError } = await supabase
    .from('employee_roles')
    .select('role_id')
    .eq('employee_id', employee.id)
    .maybeSingle()

  if (employeeRoleError) {
    console.error('EMPLOYEE ROLE ERROR:', employeeRoleError)
    throw employeeRoleError
  }

  if (!employeeRole) {
    console.error('EMPLOYEE ROLE: tidak ditemukan')
    return null
  }

  console.log('EMPLOYEE ROLE:', employeeRole)

  const { data: role, error: roleError } = await supabase
    .from('roles')
    .select('code')
    .eq('id', employeeRole.role_id)
    .eq('is_active', true)
    .maybeSingle()

  if (roleError) {
    console.error('ROLE ERROR:', roleError)
    throw roleError
  }

  if (!role) {
    console.error('ROLE: tidak ditemukan')
    return null
  }

  console.log('ROLE:', role)

  const userRole = role.code as UserRole

  return {
    id: employee.id,
    fullName: employee.full_name,
    email: employee.email ?? user.email ?? '',
    role: userRole,
  }
}
