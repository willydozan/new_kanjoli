import { supabase } from '../../lib/supabase'
import type { Database } from '../../types/database'

export type DocumentRow =
  Database['public']['Tables']['documents']['Row']

export type CreateSuratMasukInput = {
  document_number?: string
  title: string
  description?: string
  sender_name?: string
  sender_institution?: string
  received_at?: string
  document_date?: string
  classification_id?: string
  service_domain_id?: string
  service_type_id?: string
  priority?: Database['public']['Enums']['priority_level']
}

export async function getSuratMasuk() {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      id,
      document_number,
      title,
      description,
      sender_name,
      sender_institution,
      received_at,
      document_date,
      status,
      priority,
      storage_path,
      mime_type,
      file_size,
      created_at,
      updated_at,
      classification_id,
      service_domain_id,
      service_type_id,
      document_classifications (
        id,
        code,
        name
      ),
      service_domains (
        id,
        code,
        name
      ),
      service_types (
        id,
        code,
        name
      )
    `)
    .order('received_at', { ascending: false })

  if (error) {
    console.error('GET SURAT MASUK ERROR:', error)
    throw error
  }

  return data ?? []
}

export async function createSuratMasuk(
  input: CreateSuratMasukInput,
) {
  const {
    data: userData,
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    console.error('GET AUTH USER ERROR:', userError)
    throw userError
  }

  if (!userData.user) {
    throw new Error('User belum login.')
  }

  const { data: employee, error: employeeError } = await supabase
    .from('employees')
    .select('id')
    .eq('auth_user_id', userData.user.id)
    .eq('is_active', true)
    .single()

  if (employeeError) {
    console.error('GET EMPLOYEE ERROR:', employeeError)
    throw employeeError
  }

  const { data, error } = await supabase
    .from('documents')
    .insert({
      document_number: input.document_number || null,
      title: input.title,
      description: input.description || null,
      sender_name: input.sender_name || null,
      sender_institution: input.sender_institution || null,
      received_at: input.received_at || new Date().toISOString(),
      document_date: input.document_date || null,
      classification_id: input.classification_id || null,
      service_domain_id: input.service_domain_id || null,
      service_type_id: input.service_type_id || null,
      priority: input.priority || 'normal',
      created_by_employee_id: employee.id,
    })
    .select()
    .single()

  if (error) {
    console.error('CREATE SURAT MASUK ERROR:', error)
    throw error
  }

  return data
}
 
export async function uploadSuratMasukFile(
  documentId: string,
  file: File,
) {
  const extension =
    file.name.split('.').pop()?.toLowerCase() || 'bin'

  const storagePath = `surat-masuk/${documentId}/${crypto.randomUUID()}.${extension}`

  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })

  if (uploadError) {
    console.error('UPLOAD SURAT MASUK ERROR:', uploadError)
    throw uploadError
  }

  const { error: updateError } = await supabase
    .from('documents')
    .update({
      storage_path: storagePath,
      mime_type: file.type,
      file_size: file.size,
    })
    .eq('id', documentId)

  if (updateError) {
    console.error(
      'UPDATE SURAT MASUK STORAGE METADATA ERROR:',
      updateError,
    )

    await supabase.storage
      .from('documents')
      .remove([storagePath])

    throw updateError
  }

  return {
    storagePath,
    mimeType: file.type,
    fileSize: file.size,
  }
}

export async function processSuratMasukOCR(
  documentId: string,
) {
  const { data, error } = await supabase.functions.invoke(
    'surat-ocr',
    {
      body: {
        document_id: documentId,
      },
    },
  )

  if (error) {
    console.error('SURAT OCR INVOKE ERROR:', error)
    throw error
  }

  if (!data?.success) {
    throw new Error(
      data?.error || 'Gagal memulai proses OCR.',
    )
  }

  return data
}

export async function processSuratMasukOCR(
  documentId: string,
) {
  const { data, error } =
    await supabase.functions.invoke('surat-ocr', {
      body: {
        document_id: documentId,
      },
    })

  if (error) {
    console.error('SURAT OCR INVOKE ERROR:', error)
    throw error
  }

  if (!data?.success) {
    throw new Error(
      data?.error || 'OCR surat gagal diproses.',
    )
  }

  return {
    documentId: data.document_id,
    status: data.status,
    ocrText: data.ocr_text || '',
  }
}
