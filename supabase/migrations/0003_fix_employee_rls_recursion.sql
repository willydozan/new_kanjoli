-- E-KANJOLI 0003
-- Fix infinite recursion in employees / employee_roles RLS.

drop policy if exists "employees read colleagues"
on public.employees;

drop policy if exists "employees read own profile"
on public.employees;

create policy "employees read own profile"
on public.employees
for select
to authenticated
using (
  auth_user_id = (select auth.uid())
);

drop policy if exists "employees read own roles"
on public.employee_roles;

create policy "employees read own roles"
on public.employee_roles
for select
to authenticated
using (
  employee_id = public.current_employee_id()
);
