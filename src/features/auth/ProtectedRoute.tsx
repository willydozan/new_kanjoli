import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import type { UserRole } from '../../types/auth'

type ProtectedRouteProps = {
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { session, profile, loading } = useAuth()
  const location = useLocation()

  // Never make an authorization decision while the auth/profile state
  // is still being initialized or refreshed after login.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-sm text-slate-500">Memuat autentikasi...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  // A valid session without a profile is an authentication/profile
  // configuration problem, not a role mismatch. Keep the user out of
  // protected pages instead of accidentally granting access.
  if (!profile) {
    return <Navigate to="/unauthorized" replace />
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
