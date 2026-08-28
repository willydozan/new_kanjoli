import {
  Archive,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Forward,
  Send,
  Clock3,
  Plane,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthProvider'

const stats = [
  {
    label: 'Surat Masuk',
    value: '12',
    change: '+12%',
    description: 'dari bulan lalu',
    icon: FileText,
    href: '/smart-office/surat-masuk',
  },
  {
    label: 'Surat Keluar',
    value: '8',
    change: '+8%',
    description: 'dari bulan lalu',
    icon: Send,
    href: '/smart-office/surat-keluar',
  },
  {
    label: 'Layanan Publik',
    value: '24',
    change: '+6',
    description: 'permohonan aktif',
    icon: ClipboardList,
    href: '/layanan/perencanaan',
  },
  {
    label: 'Dokumen Arsip',
    value: '156',
    change: '+12',
    description: 'dokumen tersimpan',
    icon: Archive,
    href: '/smart-office/arsip/renja',
  },
]

const activities = [
  {
    title: 'Surat masuk baru telah diregistrasikan',
    description: 'Surat dari Sekretariat Daerah',
    time: '10 menit yang lalu',
    icon: FileText,
  },
  {
    title: 'Disposisi baru menunggu tindak lanjut',
    description: 'Disposisi Kepala Badan',
    time: '35 menit yang lalu',
    icon: Forward,
  },
  {
    title: 'Dokumen RENJA berhasil diarsipkan',
    description: 'RENJA Tahun 2026',
    time: '1 jam yang lalu',
    icon: Archive,
  },
  {
    title: 'Permohonan layanan PPID diterima',
    description: 'Permohonan informasi publik',
    time: '2 jam yang lalu',
    icon: ClipboardList,
  },
]

const quickActions = [
  {
    label: 'Surat Masuk',
    description: 'Kelola surat masuk',
    icon: FileText,
    href: '/smart-office/surat-masuk',
  },
  {
    label: 'Surat Keluar',
    description: 'Kelola surat keluar',
    icon: Send,
    href: '/smart-office/surat-keluar',
  },
  {
    label: 'e-Disposisi',
    description: 'Tindak lanjut disposisi',
    icon: Forward,
    href: '/smart-office/disposisi',
  },
  {
    label: 'Perjalanan Dinas',
    description: 'Kelola perjalanan',
    icon: Plane,
    href: '/smart-office/perjalanan/spt',
  },
  {
    label: 'Evaluasi PEKPPP',
    description: 'Monitoring evaluasi',
    icon: ClipboardCheck,
    href: '/pekppp',
  },
]

export function DashboardPage() {
  const { profile } = useAuth()

  const firstName =
    profile?.fullName?.split(' ')[0] ?? 'Pengguna'

  return (
    <div className="px-4 py-6 lg:px-7 lg:py-7">
      <div className="mx-auto max-w-[1600px]">
        <section className="mb-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Sistem Operasional
                </p>
              </div>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 lg:text-[28px]">
                Selamat datang, {firstName}
              </h1>

              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
                Pantau aktivitas Smart Office dan pelayanan publik
                Bappeda & Litbang Kabupaten Banggai Kepulauan dalam
                satu dashboard.
              </p>
            </div>

            <div className="hidden rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:block">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Status Sistem
              </p>

              <div className="mt-1.5 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-xs font-semibold text-slate-700">
                  Semua layanan aktif
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon

            return (
              <NavLink
                key={stat.label}
                to={stat.href}
                className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600 ring-1 ring-slate-100 transition group-hover:bg-slate-950 group-hover:text-white">
                    <Icon size={19} strokeWidth={1.8} />
                  </div>

                  <ArrowUpRight
                    size={17}
                    className="text-slate-300 transition group-hover:text-slate-600"
                  />
                </div>

                <p className="mt-5 text-xs font-medium text-slate-400">
                  {stat.label}
                </p>

                <div className="mt-1 flex items-end gap-2">
                  <span className="text-3xl font-bold tracking-tight text-slate-950">
                    {stat.value}
                  </span>

                  <span className="mb-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">
                    {stat.change}
                  </span>
                </div>

                <p className="mt-1 text-[11px] text-slate-400">
                  {stat.description}
                </p>
              </NavLink>
            )
          })}
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Aktivitas Terbaru
                </h2>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  Aktivitas sistem yang membutuhkan perhatian
                </p>
              </div>

              <NavLink
                to="/aktivitas"
                className="text-[11px] font-semibold text-slate-500 transition hover:text-slate-900"
              >
                Lihat semua
              </NavLink>
            </div>

            <div className="divide-y divide-slate-100">
              {activities.map((activity) => {
                const Icon = activity.icon

                return (
                  <div
                    key={activity.title}
                    className="flex items-center gap-3 px-5 py-4 transition hover:bg-slate-50/70"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                      <Icon size={16} strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-slate-700">
                        {activity.title}
                      </p>

                      <p className="mt-0.5 truncate text-[11px] text-slate-400">
                        {activity.description}
                      </p>
                    </div>

                    <span className="shrink-0 text-[10px] text-slate-400">
                      {activity.time}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-bold text-slate-900">
                Status Layanan
              </h2>

              <p className="mt-0.5 text-[11px] text-slate-400">
                Ringkasan permohonan saat ini
              </p>
            </div>

            <div className="space-y-3 p-5">
              <Status
                label="Menunggu"
                value="8"
                icon={Clock3}
              />

              <Status
                label="Sedang diproses"
                value="10"
                icon={Forward}
              />

              <Status
                label="Selesai"
                value="6"
                icon={CheckCircle2}
              />

              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">
                    Total permohonan
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    24
                  </span>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-[75%] rounded-full bg-slate-900" />
                </div>

                <p className="mt-2 text-[10px] text-slate-400">
                  75% permohonan telah diproses
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Akses Cepat
              </h2>

              <p className="mt-0.5 text-[11px] text-slate-400">
                Akses modul yang sering digunakan
              </p>
            </div>

            <Bell
              size={17}
              className="text-slate-300"
            />
          </div>

          <div className="grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {quickActions.map((action) => {
              const Icon = action.icon

              return (
                <NavLink
                  key={action.label}
                  to={action.href}
                  className="group flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition group-hover:bg-slate-950 group-hover:text-white">
                    <Icon size={16} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-slate-700">
                      {action.label}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-slate-400">
                      {action.description}
                    </p>
                  </div>
                </NavLink>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}

function Status({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: typeof Clock3
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm ring-1 ring-slate-100">
        <Icon size={15} />
      </div>

      <span className="flex-1 text-xs font-medium text-slate-600">
        {label}
      </span>

      <span className="text-sm font-bold text-slate-900">
        {value}
      </span>
    </div>
  )
}
