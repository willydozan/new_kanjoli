# E-KANJOLI — DATABASE SCHEMA
## Version 1.2 — Updated Baseline

> Status: APPROVED BASELINE  
> Scope: Authentication, employee hierarchy, RBAC, office workflows, services, documents, reporting, audit, notifications and WhatsApp integration.

---

## 1. Database Principles

Database design MUST support:

1. Every employee has an individual application account.
2. Authentication is handled by Supabase Auth.
3. Authorization is enforced at database level through RLS.
4. Employee identity is separated from authentication credentials.
5. Organizational hierarchy is explicit and queryable.
6. Every assignment, instruction, disposition and status change is historically traceable.
7. Workload can be calculated per employee, unit, month and year.
8. Ten public services have service-specific administrators.
9. General office work applies to all employees.
10. Official records are never hard-deleted without an approved archival policy.
11. Monthly and annual reporting is supported from transactional data.
12. WhatsApp delivery is an integration layer, not the source of truth.

---

# 2. Authentication and Employee Identity

## 2.1 `auth.users`

Supabase-managed authentication table.

The application MUST NOT create its own password table.

Important relationship:

```text
auth.users.id
      |
      v
profiles.user_id
      |
      v
employees.id
```

## 2.2 `profiles`

Application identity linked to Supabase Auth.

Suggested fields:

```text
id UUID PK
user_id UUID UNIQUE FK -> auth.users.id
employee_id UUID UNIQUE FK -> employees.id
display_name TEXT
avatar_url TEXT
is_active BOOLEAN
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

## 2.3 `employees`

Master data seluruh pegawai.

Suggested fields:

```text
id UUID PK
nip VARCHAR(32) UNIQUE
full_name TEXT
email TEXT
whatsapp_number TEXT
position_id UUID FK
organizational_unit_id UUID FK
supervisor_employee_id UUID FK -> employees.id
employment_status TEXT
is_active BOOLEAN
joined_at DATE
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

Every active employee MUST have a profile and login account.

---

# 3. Organizational Structure

## 3.1 Organizational Units

Table:

```text
organizational_units
```

Fields:

```text
id UUID PK
parent_id UUID FK -> organizational_units.id
code TEXT UNIQUE
name TEXT
unit_type TEXT
is_active BOOLEAN
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

Initial hierarchy:

```text
Kepala Badan
│
├── Sekretariat
│   ├── Sub Bagian Umum dan Kepegawaian
│   └── Sub Bagian Aset dan Keuangan
│
├── Bidang Perencanaan Makro
├── Bidang Perencanaan Sosial Budaya
├── Bidang Perencanaan Ekonomi
├── Bidang Perencanaan Fisik dan Prasarana
└── Bidang Penelitian dan Pengembangan
```

Each unit can contain Kepala, Fungsional and Staff according to the actual employee master data.

## 3.2 Positions

Table:

```text
positions
```

Fields:

```text
id UUID PK
code TEXT UNIQUE
name TEXT
level INTEGER
position_type TEXT
can_issue_instruction BOOLEAN
can_approve BOOLEAN
can_propose_travel BOOLEAN
can_execute_travel BOOLEAN
is_active BOOLEAN
```

Important distinction:

- `can_propose_travel` = permission to independently submit a travel proposal.
- `can_execute_travel` = permission to perform travel when ordered/approved.

Thus:

```text
Fungsional / Staff
can_propose_travel = false
can_execute_travel = true

Kepala Bidang / Sekretaris
can_propose_travel = true
can_execute_travel = true

Kepala Badan
can_propose_travel = true
can_execute_travel = true
```

The final authorization MUST also consider actual workflow and approval authority.

---

# 4. Roles

Table:

```text
roles
```

Initial application roles:

```text
pegawai
superadmin
admin_pekppp
admin_perencanaan
admin_litbang
admin_sekretariat
pimpinan
```

Organizational position is NOT replaced by application role.

Example:

```text
Employee:
Kepala Bidang Perencanaan Ekonomi

Application role:
pegawai

Organizational authority:
Kepala Bidang
```

The system therefore uses both:

```text
ROLE + POSITION + ORGANIZATIONAL HIERARCHY + PERMISSION
```

---

# 5. Role Assignment

Table:

```text
user_roles
```

Fields:

```text
id UUID PK
user_id UUID FK -> auth.users.id
role_id UUID FK -> roles.id
assigned_by UUID
assigned_at TIMESTAMPTZ
expires_at TIMESTAMPTZ NULL
is_active BOOLEAN
```

A user may have more than one application role when explicitly authorized.

---

# 6. Permissions

Tables:

```text
permissions
role_permissions
```

Examples:

```text
employee.view
employee.manage
task.create
task.assign
task.execute
task.approve
disposition.create
disposition.execute
letter.manage
travel.propose
travel.approve
travel.execute
document.view
document.manage
service.manage
report.view
report.export
audit.view
notification.manage
```

---

# 7. Reporting Periods

Table:

```text
reporting_periods
```

Fields:

```text
id UUID PK
year INTEGER
month INTEGER NULL
period_type TEXT
start_date DATE
end_date DATE
is_closed BOOLEAN
created_at TIMESTAMPTZ
```

Supports:

- monthly report
- annual report
- service report
- workload report
- activity report
- archive report

---

# 8. Instructions and Tasks

## 8.1 `tasks`

A generalized work instruction record.

Fields:

```text
id UUID PK
task_number TEXT UNIQUE
title TEXT
description TEXT
source_type TEXT
source_id UUID NULL
issuer_employee_id UUID
assigned_employee_id UUID
organizational_unit_id UUID
priority TEXT
status TEXT
due_at TIMESTAMPTZ
started_at TIMESTAMPTZ NULL
completed_at TIMESTAMPTZ NULL
approved_at TIMESTAMPTZ NULL
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

## 8.2 `task_history`

Every meaningful state change is recorded.

```text
id UUID PK
task_id UUID
actor_employee_id UUID
old_status TEXT
new_status TEXT
action TEXT
notes TEXT
created_at TIMESTAMPTZ
```

## 8.3 `task_assignments`

Allows reassignment and multiple task events without losing history.

```text
id UUID PK
task_id UUID
assigned_by UUID
assigned_to UUID
assigned_at TIMESTAMPTZ
unassigned_at TIMESTAMPTZ NULL
reason TEXT
```

---

# 9. Disposition

Tables:

```text
dispositions
disposition_recipients
disposition_history
```

A disposition can originate from an incoming letter.

Example:

```text
Surat Masuk
   |
   v
Disposition by authorized superior
   |
   v
Employee / Unit
   |
   v
Task
   |
   v
Execution
   |
   v
Completion
   |
   v
History + Report
```

---

# 10. Letters

Tables:

```text
incoming_letters
outgoing_letters
letter_recipients
letter_history
```

Incoming letters can generate dispositions and tasks.

Outgoing letters have workflow, approval and history.

---

# 11. Workload

Table:

```text
employee_workloads
```

This is preferably a materialized/reporting table or view generated from transactional data.

Suggested dimensions:

```text
employee_id
year
month
total_tasks
completed_tasks
pending_tasks
overdue_tasks
completed_dispositions
active_assignments
travel_assignments
service_activities
```

Workload MUST be calculated from actual system records, not manually entered as a number.

---

# 12. Travel / Perjalanan Dinas

Tables:

```text
travel_orders
travel_participants
travel_documents
travel_history
```

Core rules:

### Independent proposal

Allowed according to permission:

```text
Kepala Badan
Sekretaris
Kepala Bidang
```

### Execution

Allowed for:

```text
Kepala Badan
Sekretaris
Kepala Bidang
Fungsional
Staff
```

when there is a valid instruction/order and approval.

Therefore the database MUST NOT equate:

```text
cannot propose travel
```

with:

```text
cannot travel
```

---

# 13. Public Services

Tables:

```text
public_services
service_admins
service_requests
service_request_history
service_documents
service_reports
```

The ten public services are configured as records, not hard-coded application logic.

Each service may have one or more designated administrators.

The service administrator role controls only the assigned service domain.

---

# 14. Documents and Archives

Tables:

```text
documents
document_versions
document_categories
archive_records
```

Archive metadata MUST include:

```text
document_date
archive_date
year
month
document_type
category
unit
status
```

This enables filtering by:

```text
month
year
unit
document type
category
status
```

---

# 15. Notifications

Tables:

```text
notifications
notification_recipients
notification_preferences
```

Notifications are generated from events such as:

- new disposition
- new task
- task approaching deadline
- overdue task
- letter status
- travel status
- agenda
- service request
- approval request

---

# 16. WhatsApp Integration

Tables:

```text
whatsapp_contacts
whatsapp_messages
whatsapp_delivery_logs
whatsapp_group_targets
```

WhatsApp is an outbound notification channel.

The database remains the authoritative source.

Examples:

```text
Disposisi created
    -> application notification
    -> WhatsApp group message

Task assigned
    -> application notification
    -> WhatsApp direct message

Agenda created
    -> application notification
    -> WhatsApp group message
```

Delivery status MUST be logged.

---

# 17. Agenda and Activities

Tables:

```text
agendas
agenda_participants
agenda_history
```

Agenda supports:

- meeting
- official activity
- field activity
- service activity
- internal event

---

# 18. Audit

Table:

```text
audit_logs
```

Minimum fields:

```text
id UUID PK
actor_user_id UUID
actor_employee_id UUID
action TEXT
entity_type TEXT
entity_id UUID
old_data JSONB
new_data JSONB
ip_address INET NULL
user_agent TEXT NULL
created_at TIMESTAMPTZ
```

Audit records are append-only.

---

# 19. Database Constraints

The implementation MUST enforce:

1. NIP uniqueness.
2. One active employee profile per Auth user.
3. One employee may have one primary organizational position.
4. Supervisor must be an active employee.
5. Circular supervisor relationships are prohibited.
6. Service admins can only manage assigned services.
7. Employees cannot modify their own authorization.
8. Ordinary users cannot modify audit records.
9. Travel execution requires a valid instruction/approval.
10. Monthly/annual reports derive from source transactions.

---

# 20. Recommended Views

Create database views for:

```text
v_employee_org_tree
v_employee_current_roles
v_pending_tasks
v_overdue_tasks
v_employee_workload_monthly
v_employee_workload_yearly
v_service_monthly_report
v_service_yearly_report
v_archive_monthly
v_archive_yearly
v_letter_tracking
v_disposition_tracking
```

---

# 21. Migration Strategy

Migration order:

```text
001_extensions
002_organizational_units
003_positions
004_employees
005_profiles
006_roles_permissions
007_user_roles
008_documents_letters
009_dispositions
010_tasks
011_travel
012_public_services
013_agendas
014_notifications
015_audit_logs
016_reporting_views
017_rls_policies
018_seed_initial_data
```

Never modify production schema manually when a migration can represent the change.

---

# 22. Baseline

Version 1.2 establishes:

> Every employee is a first-class authenticated system user, while organizational position, role and permissions remain separate concepts.

This is the foundation for RLS, workflow, workload calculation, auditability and future WhatsApp automation.
