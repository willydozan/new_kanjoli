import {
  Archive,
  ClipboardList,
  FileText,
  Send,
} from 'lucide-react'

const stats = [
  {
    label: 'Surat Masuk',
    value: '12',
    description: 'Menunggu tindak lanjut',
    icon: FileText,
  },
  {
    label: 'Surat Keluar',
    value: '8',
    description: 'Bulan ini',
    icon: Send,
  },
  {
    label: 'Layanan Publik',
    value: '24',
    description: 'Permohonan aktif',
    icon: ClipboardList,
  },
  {
    label: 'Dokumen Arsip',
    value: '156',
    description: 'Tersimpan',
    icon: Archive,
  },
]

export function DashboardPage() {
  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <p className="text-sm font-medium text-slate-500">
          Dashboard
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Selamat datang di E-KANJOLI
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Monitoring Smart Office dan pelayanan publik
          Bappeda & Litbang Kabupaten Banggai Kepulauan.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-100 p-2.5 text-slate-700">
                  <Icon size={20} />
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-400">
                {stat.description}
              </p>
            </div>
          )
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Aktivitas Terbaru
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Aktivitas sistem terbaru
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {[
              'Surat masuk baru telah diregistrasikan',
              'Permohonan layanan PPID diterima',
              'Dokumen RENJA berhasil diarsipkan',
              'Disposisi baru menunggu tindak lanjut',
            ].map((activity, index) => (
              <div
                key={activity}
                className="flex items-center gap-3"
              >
                <div className="h-2 w-2 rounded-full bg-slate-400" />

                <div className="flex-1">
                  <p className="text-sm text-slate-700">
                    {activity}
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {index + 1} jam yang lalu
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            Status Layanan
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Ringkasan permohonan
          </p>

          <div className="mt-5 space-y-4">
            <Status label="Menunggu" value="8" />
            <Status label="Diproses" value="10" />
            <Status label="Selesai" value="6" />
          </div>
        </section>
      </div>
    </div>
  )
}

function Status({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-600">
        {label}
      </span>

      <span className="text-sm font-bold text-slate-900">
        {value}
      </span>
    </div>
  )
}