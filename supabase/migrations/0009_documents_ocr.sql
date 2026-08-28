-- E-KANJOLI 0009
-- OCR metadata for incoming documents.

alter table public.documents
  add column if not exists ocr_status text not null default 'not_started',
  add column if not exists ocr_text text,
  add column if not exists ocr_processed_at timestamptz,
  add column if not exists ocr_error text,
  add column if not exists ocr_provider text;

create index if not exists idx_documents_ocr_status
  on public.documents(ocr_status);

grant select, update on public.documents to authenticated;

commit;
