import { useRef, useState } from 'react'
import { FileText, Upload, X } from 'lucide-react'
import {
  createSuratMasuk,
  uploadSuratMasukFile,
} from './suratMasuk.service'

type Props = {
  onSuccess?: () => void
  onClose?: () => void
}

export function SuratMasukForm({ onSuccess, onClose }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [documentNumber, setDocumentNumber] = useState('')
  const [senderName, setSenderName] = useState('')
  const [senderInstitution, setSenderInstitution] = useState('')
  const [documentDate, setDocumentDate] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<
    'low' | 'normal' | 'high' | 'urgent'
  >('normal')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile = event.target.files?.[0]

    if (!selectedFile) {
      return
    }

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
    ]

    if (!allowedTypes.includes(selectedFile.type)) {
      setError('File harus berupa PDF, JPG, atau PNG.')
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Ukuran file maksimal 10 MB.')
      return
    }

    setError(null)
    setFile(selectedFile)
  }

  function removeFile() {
    setFile(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!title.trim()) {
      setError('Perihal/judul surat wajib diisi.')
      return
    }

    if (!file) {
      setError('File surat wajib diunggah.')
      return
    }

    try {
      setSaving(true)
      setError(null)

      const document = await createSuratMasuk({
        document_number: documentNumber || undefined,
        title: title.trim(),
        description: description || undefined,
        sender_name: senderName || undefined,
        sender_institution: senderInstitution || undefined,
        document_date: documentDate || undefined,
        priority,
      })

      await uploadSuratMasukFile(document.id, file)

      onSuccess?.()
    } catch (err) {
      console.error('CREATE SURAT MASUK ERROR:', err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal menyimpan surat masuk.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Tambah Surat Masuk
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Unggah surat dan lengkapi informasi surat masuk.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              File Surat
            </label>

            {!file ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 py-10 text-center transition hover:border-slate-500 hover:bg-slate-50"
              >
                <Upload size={28} className="text-slate-400" />

                <span className="mt-3 text-sm font-semibold text-slate-700">
                  Upload / Scan Surat
                </span>

                <span className="mt-1 text-xs text-slate-500">
                  PDF, JPG, atau PNG · maksimal 10 MB
                </span>
              </button>
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <FileText
                    size={24}
                    className="shrink-0 text-slate-500"
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-700">
                      {file.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Nomor Surat
              </label>

              <input
                value={documentNumber}
                onChange={(event) =>
                  setDocumentNumber(event.target.value)
                }
                placeholder="Nomor surat"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Tanggal Surat
              </label>

              <input
                type="date"
                value={documentDate}
                onChange={(event) =>
                  setDocumentDate(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Perihal / Judul
            </label>

            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Perihal surat"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Nama Pengirim
              </label>

              <input
                value={senderName}
                onChange={(event) =>
                  setSenderName(event.target.value)
                }
                placeholder="Nama pengirim"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Instansi Pengirim
              </label>

              <input
                value={senderInstitution}
                onChange={(event) =>
                  setSenderInstitution(event.target.value)
                }
                placeholder="Instansi pengirim"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Prioritas
              </label>

              <select
                value={priority}
                onChange={(event) =>
                  setPriority(
                    event.target.value as
                      | 'low'
                      | 'normal'
                      | 'high'
                      | 'urgent',
                  )
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
              >
                <option value="low">Rendah</option>
                <option value="normal">Normal</option>
                <option value="high">Tinggi</option>
                <option value="urgent">Mendesak</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Keterangan
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={3}
              placeholder="Keterangan tambahan..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Simpan Surat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
