-- E-KANJOLI 0010
-- Load the authenticated user's profile through a SECURITY DEFINER RPC.
-- This keeps the browser-side auth bootstrap independent from profile RLS joins.

create or replace function public.get_current_user_profile()
returns table (
  id uuid,
  full_name text,
  email text,
  role text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    e.id,
    e.full_name,
    coalesce(e.email, u.email, '') as email,
    r.code as role
  from public.employees e
  left join auth.users u on u.id = e.auth_user_id
  join public.employee_roles er on er.employee_id = e.id
  join public.roles r on r.id = er.role_id and r.is_active = true
  where e.auth_user_id = auth.uid()
    and e.is_active = true
  order by case when r.code = 'superadmin' then 0 else 1 end
  limit 1;
$$;

grant execute on function public.get_current_user_profile() to authenticated;
