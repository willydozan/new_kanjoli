import { useEffect, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../features/auth/AuthProvider'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { session, profile, loading: authLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const from = (location.state as { from?: string } | null)?.from ?? '/'

  // AuthProvider is the single source of truth for the authenticated
  // session and application profile. Navigation happens only after both
  // are ready, preventing the old race that caused "Auth session missing!".
  useEffect(() => {
    if (session && profile && !authLoading) {
      navigate(from, { replace: true })
    }
  }, [session, profile, authLoading, navigate, from])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      // Do NOT call getCurrentUserProfile() here.
      // Supabase's auth state event is handled by AuthProvider, which waits
      // until the auth callback has released its internal lock, loads the
      // employee/role profile, and only then allows ProtectedRoute through.
    } catch (signInError) {
      console.error('LOGIN ERROR:', signInError)
      setError(
        signInError instanceof Error
          ? signInError.message
          : 'Login gagal. Silakan coba lagi.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <p className="text-sm font-semibold text-slate-500">E-KANJOLI</p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Masuk ke Sistem
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Smart Office & Pelayanan Publik Terintegrasi Bappeda & Litbang
              Kabupaten Banggai Kepulauan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                placeholder="nama@bappeda.bangkep.go.id"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                placeholder="Masukkan password"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || authLoading}
              className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading || authLoading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
