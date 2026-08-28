import type { Database } from '../../types/database'

export type DocumentStatus =
  Database['public']['Enums']['document_status']

export type PriorityLevel =
  Database['public']['Enums']['priority_level']

export type SuratMasuk = {
  id: string
  document_number: string | null
  title: string
  description: string | null
  sender_name: string | null
  sender_institution: string | null
  received_at: string | null
  document_date: string | null
  classification_id: string | null
  service_domain_id: string | null
  service_type_id: string | null
  status: DocumentStatus
  priority: PriorityLevel
  created_by_employee_id: string | null
  storage_path: string | null
  mime_type: string | null
  file_size: number | null
  created_at: string
  updated_at: string
}
