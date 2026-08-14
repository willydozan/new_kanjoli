# E-KANJOLI — RBAC AND SECURITY
## Version 1.2 — Updated Baseline

> Security model: Supabase Auth + RBAC + organizational hierarchy + RLS.

---

# 1. Core Security Principle

E-KANJOLI MUST NOT rely on frontend role checks as the primary security mechanism.

Authorization layers:

```text
Supabase Auth
      |
      v
Authenticated User
      |
      v
Employee Profile
      |
      v
Application Role
      |
      v
Position / Organizational Hierarchy
      |
      v
Permission
      |
      v
PostgreSQL RLS
```

Frontend checks improve UX.

RLS provides actual data protection.

---

# 2. Mandatory Login

Every active employee MUST have an individual login.

There is no shared employee account.

Example:

```text
Kepala Badan -> personal account
Sekretaris -> personal account
Kepala Bidang -> personal account
Fungsional -> personal account
Staff -> personal account
```

This is mandatory because the system records:

- who received an instruction
- who executed it
- who changed its status
- who approved it
- who uploaded a document
- who created a disposition
- who completed a task
- who exported a report

Shared credentials would destroy accountability.

---

# 3. Authentication

Supabase Auth is the authentication authority.

Recommended:

```text
Email/password
```

Future options:

```text
SSO
OTP
institutional identity provider
```

Passwords MUST NOT be stored in application tables.

---

# 4. Employee Account Lifecycle

## Provisioning

```text
Employee master created
        |
        v
Auth account created
        |
        v
Profile linked
        |
        v
Role assigned
        |
        v
Position assigned
        |
        v
Organizational unit assigned
        |
        v
Account activated
```

## Deactivation

When an employee leaves/transfers:

```text
is_active = false
```

Do not delete historical transactions.

Historical records remain attributable to the employee.

---

# 5. Application Roles

Official roles:

```text
pegawai
superadmin
admin_pekppp
admin_perencanaan
admin_litbang
admin_sekretariat
pimpinan
```

## `pegawai`

Default role for ordinary employees.

May include:

- Fungsional
- Staff
- Kepala Sub Bagian
- Kepala Bidang
- Sekretaris

Organizational authority comes from position, not from renaming the role.

## `pimpinan`

Used for Kepala Badan.

## `admin_*`

Domain administration roles.

## `superadmin`

Technical/system administration only.

Superadmin MUST NOT automatically become business approver.

---

# 6. Position-Based Authority

Position is separate from role.

Example:

```text
role = pegawai
position = kepala_bidang
```

This employee may issue tasks to subordinates because the position grants that authority.

Likewise:

```text
role = pegawai
position = fungsional
```

does not grant authority to issue instructions merely because the user is authenticated.

---

# 7. Organizational Hierarchy

Initial hierarchy:

```text
Kepala Badan
│
├── Sekretaris
│   ├── Kasubbag Umum dan Kepegawaian
│   └── Kasubbag Aset dan Keuangan
│
├── Kabid Perencanaan Makro
├── Kabid Perencanaan Sosial Budaya
├── Kabid Perencanaan Ekonomi
├── Kabid Perencanaan Fisik dan Prasarana
└── Kabid Penelitian dan Pengembangan
```

Each Kepala Bidang has:

```text
Fungsional
Staff
```

Secretariat has:

```text
Kasubbag
Staff
```

The hierarchy is stored in database records, not hard-coded in React.

---

# 8. Permission Model

Permissions are granular.

Examples:

```text
task.view
task.create
task.assign
task.execute
task.update
task.complete
task.approve

disposition.view
disposition.create
disposition.assign
disposition.execute

letter.view
letter.create
letter.approve
letter.archive

travel.view
travel.propose
travel.approve
travel.execute

service.view
service.manage
service.approve

document.view
document.create
document.update
document.archive

report.view
report.export

audit.view

user.manage
role.manage
```

---

# 9. Scope-Based Access

Permission alone is insufficient.

A user may have permission but only within an allowed scope.

Possible scopes:

```text
own
subordinates
unit
assigned_service
all
```

Example:

```text
task.assign + scope=subordinates
```

means the user may assign work to employees in the permitted subordinate tree.

---

# 10. Task Authorization

## Kepala Badan

Can:

- issue tasks
- assign tasks
- monitor tasks
- view organization-wide workload
- approve relevant workflows

## Sekretaris / Kepala Bidang

Can:

- issue tasks within authorized hierarchy
- assign tasks to subordinates
- monitor subordinate tasks
- report upward

## Fungsional / Staff

Can:

- receive tasks
- execute tasks
- update progress
- upload evidence
- complete assigned work

They cannot arbitrarily assign work to others unless separately authorized.

---

# 11. Disposition Security

Disposition may be created only by authorized officials.

Recipient can:

- view assigned disposition
- acknowledge
- execute
- update progress
- attach evidence

Recipient cannot change the issuer.

History is immutable.

---

# 12. Travel Security

Important rule:

```text
travel.propose != travel.execute
```

Fungsional and Staff:

```text
cannot independently propose
can execute when officially instructed
```

Kepala Bidang / Sekretaris / Kepala Badan:

```text
can propose according to workflow
can execute
```

Approval remains a separate authority.

---

# 13. Public Service Security

Each of the ten public services has a service administrator.

A service administrator:

```text
CAN:
- view requests for assigned service
- process requests
- update service workflow
- generate service reports

CANNOT:
- access unrelated service administration
- change system roles
- modify audit logs
```

---

# 14. RLS Strategy

RLS MUST be enabled for sensitive tables.

Examples:

```text
employees
profiles
user_roles
tasks
task_assignments
dispositions
letters
travel_orders
documents
service_requests
notifications
audit_logs
```

Policies should use secure database helper functions such as:

```text
auth.uid()
current_employee_id()
has_role()
has_permission()
is_superadmin()
is_superior_of()
can_access_service()
```

These functions MUST be carefully designed to avoid recursive RLS evaluation.

---

# 15. Employee Access

An employee can normally read:

```text
own profile
own tasks
own dispositions
own notifications
own travel records
own activity history
```

An employee can access subordinate data only when organizational authority permits it.

---

# 16. Management Access

Kepala Badan can access organization-wide operational dashboards.

Sekretaris and Kepala Bidang can access records within their authorized organizational scope.

Superadmin has technical administration access, but business-sensitive actions remain governed by business permissions.

---

# 17. Audit Security

Audit logs are append-only.

No normal application user may:

```text
UPDATE audit_logs
DELETE audit_logs
```

Audit events should capture:

```text
actor
action
entity
before
after
timestamp
```

---

# 18. Sensitive Configuration

Never place:

```text
SUPABASE_SERVICE_ROLE_KEY
```

in Vite frontend variables.

Allowed client configuration:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Service-role credentials belong only to trusted server/edge environments.

---

# 19. WhatsApp Security

WhatsApp integration must not bypass authorization.

Flow:

```text
Database event
   |
   v
Authorized notification event
   |
   v
Integration service
   |
   v
WhatsApp provider
```

The bot must never query unrestricted employee data merely because it is an integration.

---

# 20. Security Rules for AI Coding

AI-generated code MUST NOT:

1. bypass RLS
2. use service-role keys in frontend
3. hard-code employee authority
4. hard-code organizational hierarchy
5. allow users to edit their own role
6. allow users to edit audit logs
7. treat frontend hiding as security
8. silently change business approval rules

Business-rule changes require documentation updates.

---

# 21. Security Testing

Before production:

```text
Unauthenticated access test
Employee isolation test
Subordinate scope test
Cross-unit access test
Role escalation test
Service isolation test
Audit immutability test
Travel authorization test
Document access test
Admin boundary test
```

---

# 22. Security Baseline

The final security principle is:

> Every employee has a unique identity. Every sensitive action is authorized by role, position, hierarchy and permission, and enforced at the database layer through RLS.

