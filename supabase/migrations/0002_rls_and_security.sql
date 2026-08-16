-- E-KANJOLI 0002_rls_and_security.sql

alter table public.organization_units enable row level security;
alter table public.positions enable row level security;
alter table public.employees enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.employee_roles enable row level security;
alter table public.document_classifications enable row level security;
alter table public.service_domains enable row level security;
alter table public.service_types enable row level security;
alter table public.documents enable row level security;
alter table public.document_versions enable row level security;
alter table public.routing_rules enable row level security;
alter table public.document_routings enable row level security;
alter table public.dispositions enable row level security;
alter table public.disposition_history enable row level security;
alter table public.tasks enable row level security;
alter table public.task_assignments enable row level security;
alter table public.task_history enable row level security;
alter table public.service_admins enable row level security;
alter table public.workflow_definitions enable row level security;
alter table public.workflow_steps enable row level security;
alter table public.workflow_instances enable row level security;
alter table public.workflow_step_instances enable row level security;
alter table public.workflow_history enable row level security;
alter table public.notification_templates enable row level security;
alter table public.notifications enable row level security;
alter table public.resolutions enable row level security;
alter table public.report_snapshots enable row level security;
alter table public.archive_records enable row level security;
alter table public.audit_logs enable row level security;

create policy "authenticated read active units" on public.organization_units
for select to authenticated using(is_active);

create policy "authenticated read positions" on public.positions
for select to authenticated using(is_active);

create policy "employees read own profile" on public.employees
for select to authenticated using(auth_user_id=auth.uid() or public.current_employee_has_role('superadmin'));

create policy "employees read colleagues" on public.employees
for select to authenticated using(
  public.current_employee_has_role('superadmin')
  or unit_id=(select e.unit_id from public.employees e where e.auth_user_id=auth.uid())
);

create policy "authenticated read active roles" on public.roles
for select to authenticated using(is_active);

create policy "authenticated read permissions" on public.permissions
for select to authenticated using(true);

create policy "employees read own roles" on public.employee_roles
for select to authenticated using(employee_id=public.current_employee_id() or public.current_employee_has_role('superadmin'));

create policy "authenticated read classifications" on public.document_classifications
for select to authenticated using(is_active);

create policy "authenticated read service domains" on public.service_domains
for select to authenticated using(is_active);

create policy "authenticated read service types" on public.service_types
for select to authenticated using(is_active);

create policy "employees read documents" on public.documents
for select to authenticated using(
  public.current_employee_has_role('superadmin')
  or created_by_employee_id=public.current_employee_id()
  or exists(select 1 from public.document_routings dr where dr.document_id=documents.id and dr.to_employee_id=public.current_employee_id())
  or exists(select 1 from public.dispositions d where d.document_id=documents.id and (d.to_employee_id=public.current_employee_id() or d.from_employee_id=public.current_employee_id()))
);

create policy "employees read related routings" on public.document_routings
for select to authenticated using(
  public.current_employee_has_role('superadmin')
  or to_employee_id=public.current_employee_id()
  or routed_by_employee_id=public.current_employee_id()
);

create policy "employees read related dispositions" on public.dispositions
for select to authenticated using(
  public.current_employee_has_role('superadmin')
  or from_employee_id=public.current_employee_id()
  or to_employee_id=public.current_employee_id()
);

create policy "employees read assigned tasks" on public.tasks
for select to authenticated using(
  public.current_employee_has_role('superadmin')
  or created_by_employee_id=public.current_employee_id()
  or assigned_to_employee_id=public.current_employee_id()
);

create policy "employees read task assignments" on public.task_assignments
for select to authenticated using(
  public.current_employee_has_role('superadmin')
  or employee_id=public.current_employee_id()
  or assigned_by_employee_id=public.current_employee_id()
);

create policy "employees read own notifications" on public.notifications
for select to authenticated using(employee_id=public.current_employee_id());

create policy "employees update own notifications" on public.notifications
for update to authenticated
using(employee_id=public.current_employee_id())
with check(employee_id=public.current_employee_id());

create policy "employees read own workflow" on public.workflow_instances
for select to authenticated using(
  public.current_employee_has_role('superadmin')
  or exists(select 1 from public.documents d where d.id=workflow_instances.document_id and d.created_by_employee_id=public.current_employee_id())
  or exists(select 1 from public.workflow_step_instances wsi where wsi.workflow_instance_id=workflow_instances.id and wsi.assigned_to_employee_id=public.current_employee_id())
);

create policy "employees read archive related" on public.archive_records
for select to authenticated using(
  public.current_employee_has_role('superadmin')
  or archived_by_employee_id=public.current_employee_id()
  or exists(select 1 from public.documents d where d.id=archive_records.document_id and d.created_by_employee_id=public.current_employee_id())
);

create policy "employees read own audit" on public.audit_logs
for select to authenticated using(actor_employee_id=public.current_employee_id() or public.current_employee_has_role('superadmin'));

-- Mutations will be performed through controlled server-side/service-role workflows.
commit;
