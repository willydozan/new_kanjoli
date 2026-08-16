-- E-KANJOLI 0001_initial_schema.sql
-- Core model:
-- Surat masuk -> klasifikasi -> (service routing | general routing)
-- Tugas internal -> hierarchy routing
-- Both -> disposition/task -> workflow -> notification -> resolution -> report -> archive

create extension if not exists pgcrypto;

do $$ begin
  create type public.document_status as enum
    ('draft','received','classified','routed','disposed','in_progress','waiting_verification','completed','archived','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.priority_level as enum
    ('low','normal','high','urgent');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.task_status as enum
    ('draft','assigned','accepted','in_progress','submitted','verified','completed','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.routing_type as enum
    ('service','general','hierarchy');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.notification_channel as enum
    ('in_app','whatsapp');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.unit_type as enum
    ('organization','domain_unit','implementing_unit','sub_unit');
exception when duplicate_object then null; end $$;

create table if not exists public.organization_units (
  id uuid primary key default gen_random_uuid(),
  parent_unit_id uuid references public.organization_units(id) on delete restrict,
  code text unique not null,
  name text not null,
  unit_type public.unit_type not null default 'implementing_unit',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.positions (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  level integer not null default 50,
  is_leadership boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  nip text unique,
  employee_number text unique,
  full_name text not null,
  email text,
  whatsapp_number text,
  position_id uuid references public.positions(id) on delete restrict,
  unit_id uuid references public.organization_units(id) on delete restrict,
  direct_supervisor_id uuid references public.employees(id) on delete restrict,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_employees_supervisor on public.employees(direct_supervisor_id);
create index if not exists idx_employees_unit on public.employees(unit_id);

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  description text,
  is_system_role boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  resource text not null,
  action text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(role_id,permission_id)
);

create table if not exists public.employee_roles (
  employee_id uuid not null references public.employees(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(employee_id,role_id)
);

create table if not exists public.document_classifications (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  description text,
  default_priority public.priority_level not null default 'normal',
  is_service_related boolean not null default false,
  is_general boolean not null default false,
  is_active boolean not null default true
);

create table if not exists public.service_domains (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  description text,
  owning_unit_id uuid references public.organization_units(id) on delete restrict,
  is_active boolean not null default true
);

create table if not exists public.service_types (
  id uuid primary key default gen_random_uuid(),
  domain_id uuid not null references public.service_domains(id) on delete cascade,
  code text unique not null,
  name text not null,
  description text,
  classification_id uuid references public.document_classifications(id) on delete restrict,
  default_unit_id uuid references public.organization_units(id) on delete restrict,
  target_days integer,
  is_active boolean not null default true
);

create index if not exists idx_service_types_domain on public.service_types(domain_id);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  document_number text,
  title text not null,
  description text,
  sender_name text,
  sender_institution text,
  received_at timestamptz,
  document_date date,
  classification_id uuid references public.document_classifications(id) on delete restrict,
  service_domain_id uuid references public.service_domains(id) on delete restrict,
  service_type_id uuid references public.service_types(id) on delete restrict,
  status public.document_status not null default 'received',
  priority public.priority_level not null default 'normal',
  created_by_employee_id uuid references public.employees(id) on delete set null,
  storage_path text,
  mime_type text,
  file_size bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_documents_classification on public.documents(classification_id);
create index if not exists idx_documents_service_type on public.documents(service_type_id);

create table if not exists public.document_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  version_number integer not null,
  storage_path text not null,
  mime_type text,
  file_size bigint,
  checksum text,
  uploaded_by_employee_id uuid references public.employees(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(document_id,version_number)
);

create table if not exists public.routing_rules (
  id uuid primary key default gen_random_uuid(),
  routing_type public.routing_type not null,
  service_domain_id uuid references public.service_domains(id) on delete cascade,
  service_type_id uuid references public.service_types(id) on delete cascade,
  source_unit_id uuid references public.organization_units(id) on delete restrict,
  target_unit_id uuid references public.organization_units(id) on delete restrict,
  target_role_code text,
  target_position_code text,
  rule_name text not null,
  priority_order integer not null default 100,
  is_active boolean not null default true,
  check (
    (routing_type = 'service' and service_domain_id is not null and service_type_id is not null)
    or (routing_type in ('general','hierarchy'))
  )
);

create index if not exists idx_routing_rules_service on public.routing_rules(service_type_id,priority_order);
create index if not exists idx_routing_rules_hierarchy on public.routing_rules(source_unit_id,priority_order);

create table if not exists public.document_routings (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  routing_rule_id uuid references public.routing_rules(id) on delete set null,
  routing_type public.routing_type not null,
  from_unit_id uuid references public.organization_units(id) on delete set null,
  to_unit_id uuid references public.organization_units(id) on delete set null,
  to_employee_id uuid references public.employees(id) on delete set null,
  to_role_code text,
  reason text,
  routed_by_employee_id uuid references public.employees(id) on delete set null,
  routed_at timestamptz not null default now(),
  status text not null default 'pending'
);

create table if not exists public.dispositions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  from_employee_id uuid not null references public.employees(id) on delete restrict,
  to_employee_id uuid references public.employees(id) on delete restrict,
  to_unit_id uuid references public.organization_units(id) on delete restrict,
  instruction text not null,
  priority public.priority_level not null default 'normal',
  due_at timestamptz,
  status public.task_status not null default 'assigned',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.disposition_history (
  id uuid primary key default gen_random_uuid(),
  disposition_id uuid not null references public.dispositions(id) on delete cascade,
  employee_id uuid references public.employees(id) on delete set null,
  action text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  source_type text not null default 'internal',
  source_document_id uuid references public.documents(id) on delete set null,
  created_by_employee_id uuid not null references public.employees(id) on delete restrict,
  assigned_to_employee_id uuid references public.employees(id) on delete restrict,
  assigned_to_unit_id uuid references public.organization_units(id) on delete restrict,
  assigned_via public.routing_type not null default 'hierarchy',
  parent_task_id uuid references public.tasks(id) on delete set null,
  priority public.priority_level not null default 'normal',
  status public.task_status not null default 'draft',
  due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.task_assignments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete restrict,
  assigned_by_employee_id uuid not null references public.employees(id) on delete restrict,
  assigned_at timestamptz not null default now(),
  accepted_at timestamptz,
  started_at timestamptz,
  submitted_at timestamptz,
  completed_at timestamptz,
  status public.task_status not null default 'assigned',
  notes text,
  unique(task_id,employee_id)
);

create table if not exists public.task_history (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  employee_id uuid references public.employees(id) on delete set null,
  status public.task_status,
  action text not null,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.service_admins (
  service_id uuid not null references public.service_types(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(service_id,employee_id)
);

create table if not exists public.workflow_definitions (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  description text,
  is_active boolean not null default true
);

create table if not exists public.workflow_steps (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflow_definitions(id) on delete cascade,
  step_code text not null,
  step_name text not null,
  step_order integer not null,
  responsible_role_code text,
  requires_disposition boolean not null default false,
  requires_verification boolean not null default false,
  creates_notification boolean not null default true,
  is_terminal boolean not null default false,
  unique(workflow_id,step_code)
);

create table if not exists public.workflow_instances (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflow_definitions(id) on delete restrict,
  document_id uuid references public.documents(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete cascade,
  current_step_id uuid references public.workflow_steps(id) on delete restrict,
  status text not null default 'active',
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.workflow_step_instances (
  id uuid primary key default gen_random_uuid(),
  workflow_instance_id uuid not null references public.workflow_instances(id) on delete cascade,
  step_id uuid not null references public.workflow_steps(id) on delete restrict,
  assigned_to_employee_id uuid references public.employees(id) on delete set null,
  status text not null default 'pending',
  started_at timestamptz,
  completed_at timestamptz,
  notes text
);

create table if not exists public.workflow_history (
  id uuid primary key default gen_random_uuid(),
  workflow_instance_id uuid not null references public.workflow_instances(id) on delete cascade,
  employee_id uuid references public.employees(id) on delete set null,
  action text not null,
  from_step_id uuid references public.workflow_steps(id) on delete set null,
  to_step_id uuid references public.workflow_steps(id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.notification_templates (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  channel public.notification_channel not null,
  subject_template text,
  body_template text,
  is_active boolean not null default true
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  template_id uuid references public.notification_templates(id) on delete set null,
  document_id uuid references public.documents(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete cascade,
  channel public.notification_channel not null default 'in_app',
  title text not null,
  message text not null,
  status text not null default 'pending',
  sent_at timestamptz,
  read_at timestamptz,
  external_message_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.resolutions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.documents(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete cascade,
  resolved_by_employee_id uuid references public.employees(id) on delete set null,
  resolution_type text not null,
  summary text,
  completed_at timestamptz not null default now()
);

create table if not exists public.report_snapshots (
  id uuid primary key default gen_random_uuid(),
  report_code text not null,
  period_start date not null,
  period_end date not null,
  domain_id uuid references public.service_domains(id) on delete set null,
  total_count integer not null default 0,
  completed_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.archive_records (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.documents(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete cascade,
  archive_year integer not null,
  archive_number text,
  storage_path text,
  archived_by_employee_id uuid references public.employees(id) on delete set null,
  archived_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_employee_id uuid references public.employees(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

do $$
declare t text;
begin
  foreach t in array array[
    'organization_units','employees','documents','dispositions','tasks'
  ] loop
    execute format(
      'drop trigger if exists trg_%I_updated_at on public.%I',t,t
    );
    execute format(
      'create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()',t,t
    );
  end loop;
end $$;

-- Basic helper functions used by RLS.
create or replace function public.current_employee_id()
returns uuid language sql stable security definer set search_path=public as $$
  select e.id from public.employees e
  where e.auth_user_id=auth.uid() and e.is_active=true limit 1;
$$;

create or replace function public.current_employee_has_role(role_code text)
returns boolean language sql stable security definer set search_path=public as $$
  select exists (
    select 1 from public.employee_roles er
    join public.roles r on r.id=er.role_id
    where er.employee_id=public.current_employee_id()
      and r.code=role_code and r.is_active=true
  );
$$;

commit;
