import { useCallback, useEffect, useState } from 'react'
import { getSuratMasuk } from './suratMasuk.service'
import type { DocumentRow } from './suratMasuk.service'

export type SuratMasukRow = Pick<
  DocumentRow,
  | 'id'
  | 'document_number'
  | 'title'
  | 'description'
  | 'sender_name'
  | 'sender_institution'
  | 'received_at'
  | 'document_date'
  | 'status'
  | 'priority'
  | 'storage_path'
  | 'mime_type'
  | 'file_size'
  | 'created_at'
  | 'updated_at'
  | 'classification_id'
  | 'service_domain_id'
  | 'service_type_id'
>

export function useSuratMasuk() {
  const [data, setData] = useState<SuratMasukRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await getSuratMasuk()

      setData(result as SuratMasukRow[])
    } catch (err) {
      console.error('USE SURAT MASUK ERROR:', err)

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal memuat data surat masuk.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return {
    data,
    loading,
    error,
    reload: load,
  }
}
