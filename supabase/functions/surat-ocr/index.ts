import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

type OCRResponse = {
  text?: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    })
  }

  let documentId: string | null = null

  try {
    const body = await req.json()
    documentId = body.document_id

    if (!documentId) {
      throw new Error('document_id wajib diisi.')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get(
      'SUPABASE_SERVICE_ROLE_KEY',
    )
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error(
        'Supabase environment variables belum tersedia.',
      )
    }

    if (!openaiApiKey) {
      throw new Error(
        'OPENAI_API_KEY belum tersedia.',
      )
    }

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey,
    )

    const { data: document, error: documentError } =
      await supabase
        .from('documents')
        .select(
          'id, storage_path, mime_type, ocr_status',
        )
        .eq('id', documentId)
        .single()

    if (documentError) {
      throw documentError
    }

    if (!document.storage_path) {
      throw new Error(
        'File surat belum tersedia di storage.',
      )
    }

    await supabase
      .from('documents')
      .update({
        ocr_status: 'processing',
        ocr_error: null,
      })
      .eq('id', documentId)

    const { data: file, error: downloadError } =
      await supabase.storage
        .from('documents')
        .download(document.storage_path)

    if (downloadError) {
      throw downloadError
    }

    if (!file) {
      throw new Error(
        'File surat tidak dapat dibaca dari storage.',
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const base64 = btoa(
      String.fromCharCode(
        ...new Uint8Array(arrayBuffer),
      ),
    )

    const mimeType =
      document.mime_type ||
      file.type ||
      'application/octet-stream'

    const dataUrl = `data:${mimeType};base64,${base64}`

    const openaiResponse = await fetch(
      'https://api.openai.com/v1/responses',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          input: [
            {
              role: 'user',
              content: [
                {
                  type: 'input_text',
                  text:
                    'Baca dokumen surat ini dengan teliti. ' +
                    'Transkripsikan seluruh teks yang terbaca. ' +
                    'Pertahankan nomor surat, tanggal, nama, ' +
                    'instansi, perihal, alamat, dan isi surat. ' +
                    'Jangan membuat informasi yang tidak ada.',
                },
                {
                  type: 'input_image',
                  image_url: dataUrl,
                },
              ],
            },
          ],
        }),
      },
    )

    const openaiData =
      (await openaiResponse.json()) as OCRResponse & {
        error?: {
          message?: string
        }
      }

    if (!openaiResponse.ok) {
      throw new Error(
        openaiData.error?.message ||
          'OpenAI OCR request gagal.',
      )
    }

    const ocrText =
      openaiData.output_text?.trim() ||
      openaiData.output
        ?.flatMap((item: any) => item.content || [])
        ?.filter((item: any) => item.type === 'output_text')
        ?.map((item: any) => item.text)
        ?.join('\n')
        ?.trim() ||
      ''

    if (!ocrText) {
      throw new Error(
        'OCR tidak menghasilkan teks.',
      )
    }

    const { error: updateError } =
      await supabase
        .from('documents')
        .update({
          ocr_status: 'completed',
          ocr_text: ocrText,
          ocr_processed_at: new Date().toISOString(),
          ocr_provider: 'openai',
          ocr_error: null,
        })
        .eq('id', documentId)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({
        success: true,
        document_id: documentId,
        status: 'completed',
        ocr_text: ocrText,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('SURAT OCR ERROR:', error)

    if (documentId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')
      const serviceRoleKey = Deno.env.get(
        'SUPABASE_SERVICE_ROLE_KEY',
      )

      if (supabaseUrl && serviceRoleKey) {
        const supabase = createClient(
          supabaseUrl,
          serviceRoleKey,
        )

        await supabase
          .from('documents')
          .update({
            ocr_status: 'failed',
            ocr_error:
              error instanceof Error
                ? error.message
                : 'Gagal memproses OCR.',
          })
          .eq('id', documentId)
      }
    }

    return new Response(
      JSON.stringify({
        success: false,
        document_id: documentId,
        error:
          error instanceof Error
            ? error.message
            : 'Gagal memproses OCR.',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})
