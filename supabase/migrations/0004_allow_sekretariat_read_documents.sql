-- E-KANJOLI 0004
-- Allow sekretariat administrators to read incoming documents.

create policy "sekretariat admins read documents"
on public.documents
for select
to authenticated
using (
  public.current_employee_has_role('superadmin')
  or public.current_employee_has_role('admin_sekretariat')
);

commit;
