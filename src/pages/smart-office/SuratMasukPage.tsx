import {
  AlertCircle,
  FileText,
  Plus,
  RefreshCw,
  Search,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSuratMasuk } from '../../features/surat-masuk/useSuratMasuk'
import { SuratMasukForm } from '../../features/surat-masuk/SuratMasukForm'

const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  received: 'Diterima',
  classified: 'Diklasifikasi',
  routed: 'Diteruskan',
  disposed: 'Disposisi',
  in_progress: 'Diproses',
  waiting_verification: 'Menunggu Verifikasi',
  completed: 'Selesai',
  archived: 'Diarsipkan',
  cancelled: 'Dibatalkan',
}

const PRIORITY_LABEL: Record<string, string> = {
  low: 'Rendah',
  normal: 'Normal',
  high: 'Tinggi',
  urgent: 'Mendesak',
}

export function SuratMasukPage() {
  const { data, loading, error, reload } = useSuratMasuk()

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [priority, setPriority] = useState('all')
  const [showForm, setShowForm] = useState(false)

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return data.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.title.toLowerCase().includes(keyword) ||
        item.document_number?.toLowerCase().includes(keyword) ||
        item.sender_name?.toLowerCase().includes(keyword) ||
        item.sender_institution?.toLowerCase().includes(keyword)

      const matchesStatus =
        status === 'all' || item.status === status

      const matchesPriority =
        priority === 'all' || item.priority === priority

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [data, search, status, priority])

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
            <FileText size={20} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Surat Masuk
            </h1>
            <p className="text-sm text-slate-500">
              Kelola surat masuk dan proses administrasi surat.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={17} />
          Surat Masuk
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nomor surat, judul, pengirim..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
              />
            </div>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none"
            >
              <option value="all">Semua Status</option>

              {Object.entries(STATUS_LABEL).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ),
              )}
            </select>

            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none"
            >
              <option value="all">Semua Prioritas</option>

              {Object.entries(PRIORITY_LABEL).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ),
              )}
            </select>

            <button
              type="button"
              onClick={() => void reload()}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? 'animate-spin' : ''}
              />
              Refresh
            </button>
          </div>
        </div>

        {loading && (
          <div className="p-10 text-center">
            <RefreshCw
              size={22}
              className="mx-auto animate-spin text-slate-400"
            />

            <p className="mt-3 text-sm text-slate-500">
              Memuat data surat masuk...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="p-10 text-center">
            <AlertCircle
              size={24}
              className="mx-auto text-red-500"
            />

            <p className="mt-3 text-sm font-medium text-slate-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void reload()}
              className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && filteredData.length === 0 && (
          <div className="p-12 text-center">
            <FileText
              size={32}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm font-semibold text-slate-700">
              Tidak ada surat masuk
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Belum ada data yang sesuai dengan pencarian atau filter.
            </p>
          </div>
        )}

        {!loading && !error && filteredData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Surat
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Pengirim
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Diterima
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Prioritas
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {item.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {item.document_number ||
                            'Nomor belum tersedia'}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-700">
                        {item.sender_name || '-'}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {item.sender_institution || '-'}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(item.received_at)}
                    </td>

                    <td className="px-5 py-4">
                      <PriorityBadge priority={item.priority} />
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && filteredData.length > 0 && (
          <div className="border-t border-slate-200 px-5 py-3">
            <p className="text-xs text-slate-500">
              Menampilkan{' '}
              <span className="font-semibold text-slate-700">
                {filteredData.length}
              </span>{' '}
              dari{' '}
              <span className="font-semibold text-slate-700">
                {data.length}
              </span>{' '}
              surat.
            </p>
          </div>
        )}
      </div>

      {showForm && (
        <SuratMasukForm
          onClose={() => setShowForm(false)}
          onSuccess={() => void reload()}
        />
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
      {STATUS_LABEL[status] ?? status}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  const className =
    priority === 'urgent'
      ? 'bg-red-50 text-red-700'
      : priority === 'high'
        ? 'bg-orange-50 text-orange-700'
        : priority === 'low'
          ? 'bg-slate-100 text-slate-600'
          : 'bg-blue-50 text-blue-700'

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {PRIORITY_LABEL[priority] ?? priority}
    </span>
  )
}

function formatDate(value: string | null) {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}
