-- E-KANJOLI 0008
-- Storage bucket and access policies for incoming documents.

insert into storage.buckets (
  id,
  name,
  public
)
values (
  'documents',
  'documents',
  false
)
on conflict (id) do nothing;

grant select, insert, update on storage.objects to authenticated;

create policy "authenticated upload documents"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'documents'
);

create policy "authenticated read documents"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'documents'
);

create policy "authenticated update documents"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'documents'
)
with check (
  bucket_id = 'documents'
);

commit;
