-- E-KANJOLI 0007
-- Allow authenticated employees to create incoming documents.

grant insert on public.documents to authenticated;

create policy "employees create documents"
on public.documents
for insert
to authenticated
with check (
  created_by_employee_id = public.current_employee_id()
);

commit;
