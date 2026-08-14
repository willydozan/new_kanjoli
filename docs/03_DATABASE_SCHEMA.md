# E-KANJOLI — DATABASE SCHEMA

> Status: APPROVED BASELINE
> Version: 1.0
> Last Updated: 2026-08-14
> Institution: Bappeda & Litbang Kabupaten Banggai Kepulauan
> Parent Documents: 00_PROJECT_CHARTER.md, 01_PRD.md, 02_SYSTEM_ARCHITECTURE.md

---

# 1. PURPOSE

Dokumen ini mendefinisikan struktur database PostgreSQL untuk E-KANJOLI.

Database harus:

- konsisten dengan PRD;
- mendukung seluruh domain Smart Office;
- mendukung 10 layanan publik;
- mendukung PEKPPP;
- mendukung RBAC;
- mendukung audit trail;
- mendukung notifikasi;
- mendukung document management;
- mendukung reporting;
- siap untuk PostgreSQL Row Level Security;
- menggunakan migration sebagai source of truth.

---

# 2. DATABASE PRINCIPLES

1. PostgreSQL adalah sumber kebenaran data.
2. Primary key menggunakan UUID untuk entity utama.
3. Foreign key digunakan untuk menjaga referential integrity.
4. Timestamp menggunakan `timestamptz`.
5. Data penting tidak dihapus secara hard delete tanpa kebijakan.
6. Record historis harus tetap traceable.
7. Business status menggunakan enum atau constrained value yang jelas.
8. File binary tidak disimpan dalam database.
9. Metadata file disimpan dalam database dan file disimpan di Supabase Storage.
10. RLS diterapkan pada tabel yang mengandung data internal atau sensitif.
11. Semua migration harus disimpan di Git.
12. Perubahan schema harus backward-aware ketika diperlukan.

---

# 3. SCHEMA ORGANIZATION

Secara logical database dibagi menjadi:

```text
identity
├── profiles
├── roles
└── units

public_services
├── services
├── service_requirements
├── service_forms
├── service_requests
├── service_request_events
├── service_request_documents
└── service_slas

smart_office
├── incoming_letters
├── outgoing_letters
├── letter_attachments
├── dispositions
├── disposition_recipients
├── official_travels
├── travel_participants
├── travel_documents
├── travel_reports
├── assets
├── asset_categories
├── asset_locations
├── asset_history
└── archives

planning
├── renja_documents
└── rkpd_documents

pekppp
├── evaluations
├── aspects
├── indicators
├── questions
├── answers
├── evidences
└── verifications

documents
├── documents
├── document_versions
├── document_access
└── document_tags

system
├── notifications
├── audit_logs
├── activity_logs
├── approvals
└── system_settings
```

Logical grouping tidak wajib berarti PostgreSQL schema fisik yang berbeda.
Implementasi awal dapat menggunakan public schema dengan naming convention
yang konsisten.

---

# 4. COMMON COLUMN STANDARD

Entity utama umumnya menggunakan:

```sql
id uuid primary key default gen_random_uuid(),
created_at timestamptz not null default now(),
updated_at timestamptz not null default now()
```

Entity yang membutuhkan soft delete dapat menggunakan:

```sql
deleted_at timestamptz null
```

Jika diperlukan:

```sql
created_by uuid references profiles(id),
updated_by uuid references profiles(id)
```

Tidak semua tabel wajib memiliki seluruh kolom tersebut.
Gunakan sesuai kebutuhan domain.

---

# 5. ENUMS

Enum harus digunakan untuk state yang stabil dan penting.

## User Role

```sql
create type user_role as enum (
  'superadmin',
  'admin_pekppp',
  'admin_perencanaan',
  'admin_litbang',
  'admin_sekretariat',
  'pimpinan'
);
```

## Service Category

```sql
create type service_category as enum (
  'PERENCANAAN',
  'LITBANG',
  'SEKRETARIAT'
);
```

## Request Status

```sql
create type service_request_status as enum (
  'PENDING',
  'IN_PROGRESS',
  'APPROVED',
  'REJECTED',
  'COMPLETED',
  'CANCELLED'
);
```

## Letter Status

```sql
create type incoming_letter_status as enum (
  'RECEIVED',
  'REGISTERED',
  'DISPOSED',
  'FOLLOW_UP',
  'COMPLETED',
  'ARCHIVED'
);
```

```sql
create type outgoing_letter_status as enum (
  'DRAFT',
  'REVIEW',
  'REVISION',
  'APPROVAL',
  'SIGNED',
  'SENT',
  'ARCHIVED',
  'CANCELLED'
);
```

## Disposition Status

```sql
create type disposition_status as enum (
  'ASSIGNED',
  'IN_PROGRESS',
  'COMPLETED',
  'RETURNED',
  'CANCELLED'
);
```

## Travel Status

```sql
create type travel_status as enum (
  'DRAFT',
  'SUBMITTED',
  'APPROVED',
  'ISSUED',
  'ONGOING',
  'COMPLETED',
  'CANCELLED'
);
```

## Asset Status

```sql
create type asset_status as enum (
  'ACTIVE',
  'DAMAGED',
  'MAINTENANCE',
  'LOST',
  'DISPOSED',
  'TRANSFERRED'
);
```

## Document Status

```sql
create type document_status as enum (
  'DRAFT',
  'ACTIVE',
  'ARCHIVED',
  'RETIRED'
);
```

## Approval Status

```sql
create type approval_status as enum (
  'PENDING',
  'APPROVED',
  'REJECTED',
  'CANCELLED'
);
```

## Notification Type

```sql
create type notification_type as enum (
  'INFO',
  'SUCCESS',
  'WARNING',
  'ACTION_REQUIRED',
  'DEADLINE',
  'SYSTEM'
);
```

## PEKPPP Status

```sql
create type pekppp_evaluation_status as enum (
  'DRAFT',
  'IN_PROGRESS',
  'VERIFICATION',
  'FINALIZED',
  'ARCHIVED'
);
```

---

# 6. IDENTITY AND ACCESS

## 6.1 profiles

Menghubungkan Supabase Auth dengan data aplikasi.

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name varchar(200) not null,
  email varchar(255),
  phone varchar(50),
  nip varchar(50),
  position_title varchar(200),
  role user_role not null,
  unit_id uuid,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

`id` harus sama dengan `auth.users.id`.

---

# 7. ORGANIZATIONAL MASTER DATA

## 7.1 units

```sql
create table units (
  id uuid primary key default gen_random_uuid(),
  code varchar(50) unique not null,
  name varchar(200) not null,
  parent_id uuid references units(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Digunakan untuk:

- bidang;
- sekretariat;
- sub-unit;
- unit kerja lain apabila diperlukan.

Setelah tabel `units` dibuat, `profiles.unit_id` direferensikan ke `units.id`.

---

# 8. PUBLIC SERVICES

## 8.1 services

```sql
create table services (
  id uuid primary key default gen_random_uuid(),
  code varchar(50) unique not null,
  title varchar(255) not null,
  category service_category not null,
  assigned_role user_role not null,
  description text,
  requirements_summary text,
  estimated_days integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

# 9. TEN PUBLIC SERVICES

Master data baseline:

## Perencanaan

1. Layanan Fasilitasi Permohonan Data dan Informasi Pembangunan Daerah
2. Layanan Asistensi/Fasilitasi Perencanaan Pembangunan Daerah pada Mitra OPD
3. Layanan Asistensi Pelaporan Evaluasi dan Pengendalian Kinerja Pembangunan
4. Layanan Fasilitasi Konsultasi/Pelaksanaan Musrenbang
5. Layanan Fasilitasi/Pengusulan Pokok-Pokok Pikiran DPRD

## Litbang

6. Layanan Surat Rekomendasi / Izin Penelitian Daerah
7. Layanan Fasilitasi Inovasi dan Kelitbangan Daerah
8. Layanan Fasilitasi/Kemitraan TJSLP/CSR
9. Layanan Pengkajian, Pengembangan, & Penerapan Teknologi Daerah

## Sekretariat / PPID

10. Pelayanan Informasi Publik dan Pengaduan Masyarakat

Seed service catalog harus menggunakan kode layanan yang stabil.

---

# 10. SERVICE REQUIREMENTS

```sql
create table service_requirements (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id) on delete cascade,
  name varchar(255) not null,
  description text,
  is_required boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
```

---

# 11. SERVICE FORMS

Form dinamis tidak boleh seluruhnya hardcoded.

```sql
create table service_forms (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id) on delete cascade,
  field_key varchar(100) not null,
  label varchar(255) not null,
  field_type varchar(50) not null,
  options jsonb,
  validation_rules jsonb,
  is_required boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique(service_id, field_key)
);
```

---

# 12. SERVICE REQUESTS

```sql
create table service_requests (
  id uuid primary key default gen_random_uuid(),
  ticket_number varchar(50) unique not null,
  service_id uuid not null references services(id),
  applicant_name varchar(200) not null,
  applicant_email varchar(255),
  applicant_phone varchar(50),
  applicant_organization varchar(255),
  status service_request_status not null default 'PENDING',
  assigned_role user_role not null,
  assigned_unit_id uuid references units(id),
  assigned_to uuid references profiles(id),
  details jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now(),
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Ticket harus unik dan dapat digunakan masyarakat untuk tracking.

---

# 13. SERVICE REQUEST EVENTS

```sql
create table service_request_events (
  id uuid primary key default gen_random_uuid(),
  service_request_id uuid not null references service_requests(id) on delete cascade,
  event_type varchar(100) not null,
  old_status service_request_status,
  new_status service_request_status,
  notes text,
  actor_id uuid references profiles(id),
  created_at timestamptz not null default now()
);
```

Digunakan untuk histori workflow.

---

# 14. SERVICE REQUEST DOCUMENTS

```sql
create table service_request_documents (
  id uuid primary key default gen_random_uuid(),
  service_request_id uuid not null references service_requests(id) on delete cascade,
  document_id uuid,
  document_type varchar(100) not null,
  created_at timestamptz not null default now()
);
```

`document_id` akan direferensikan setelah domain document management
dibuat.

---

# 15. SERVICE SLA

```sql
create table service_slas (
  id uuid primary key default gen_random_uuid(),
  service_id uuid unique not null references services(id) on delete cascade,
  target_days integer not null,
  warning_days integer,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

# 16. SMART OFFICE — SURAT MASUK

## incoming_letters

```sql
create table incoming_letters (
  id uuid primary key default gen_random_uuid(),
  register_number varchar(100) unique not null,
  letter_number varchar(150),
  letter_date date,
  received_date date not null,
  sender_name varchar(255) not null,
  sender_organization varchar(255),
  subject text not null,
  summary text,
  status incoming_letter_status not null default 'RECEIVED',
  priority varchar(30) default 'NORMAL',
  addressed_to uuid references profiles(id),
  registered_by uuid references profiles(id),
  document_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

# 17. SURAT KELUAR

## outgoing_letters

```sql
create table outgoing_letters (
  id uuid primary key default gen_random_uuid(),
  draft_number varchar(100),
  letter_number varchar(150) unique,
  letter_date date,
  recipient_name varchar(255) not null,
  recipient_organization varchar(255),
  subject text not null,
  body_summary text,
  status outgoing_letter_status not null default 'DRAFT',
  created_by uuid not null references profiles(id),
  reviewer_id uuid references profiles(id),
  approver_id uuid references profiles(id),
  signer_id uuid references profiles(id),
  document_id uuid,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

# 18. LETTER ATTACHMENTS

```sql
create table letter_attachments (
  id uuid primary key default gen_random_uuid(),
  incoming_letter_id uuid references incoming_letters(id) on delete cascade,
  outgoing_letter_id uuid references outgoing_letters(id) on delete cascade,
  document_id uuid not null,
  created_at timestamptz not null default now(),
  check (
    (incoming_letter_id is not null and outgoing_letter_id is null)
    or
    (incoming_letter_id is null and outgoing_letter_id is not null)
  )
);
```

---

# 19. E-DISPOSITION

## dispositions

```sql
create table dispositions (
  id uuid primary key default gen_random_uuid(),
  incoming_letter_id uuid not null references incoming_letters(id) on delete cascade,
  instruction text not null,
  priority varchar(30) default 'NORMAL',
  due_date date,
  status disposition_status not null default 'ASSIGNED',
  created_by uuid not null references profiles(id),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

## disposition_recipients

```sql
create table disposition_recipients (
  id uuid primary key default gen_random_uuid(),
  disposition_id uuid not null references dispositions(id) on delete cascade,
  recipient_profile_id uuid references profiles(id),
  recipient_unit_id uuid references units(id),
  notes text,
  created_at timestamptz not null default now(),
  check (
    recipient_profile_id is not null
    or recipient_unit_id is not null
  )
);
```

Satu disposisi dapat diberikan kepada user atau unit yang berwenang.

---

# 20. OFFICIAL TRAVEL

## official_travels

```sql
create table official_travels (
  id uuid primary key default gen_random_uuid(),
  travel_number varchar(100) unique,
  purpose text not null,
  origin varchar(255) not null,
  destination varchar(255) not null,
  departure_date date not null,
  return_date date not null,
  status travel_status not null default 'DRAFT',
  requester_id uuid not null references profiles(id),
  approver_id uuid references profiles(id),
  total_budget numeric(18,2),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (return_date >= departure_date)
);
```

---

# 21. TRAVEL PARTICIPANTS

```sql
create table travel_participants (
  id uuid primary key default gen_random_uuid(),
  official_travel_id uuid not null references official_travels(id) on delete cascade,
  profile_id uuid references profiles(id),
  name varchar(255) not null,
  nip varchar(50),
  position_title varchar(200),
  created_at timestamptz not null default now()
);
```

Mendukung pegawai internal maupun peserta eksternal jika diperlukan.

---

# 22. TRAVEL DOCUMENTS

```sql
create table travel_documents (
  id uuid primary key default gen_random_uuid(),
  official_travel_id uuid not null references official_travels(id) on delete cascade,
  document_id uuid not null,
  document_type varchar(50) not null,
  created_at timestamptz not null default now()
);
```

`document_type` minimal:

```text
SPT
SPPD
OTHER
```

---

# 23. TRAVEL REPORTS

```sql
create table travel_reports (
  id uuid primary key default gen_random_uuid(),
  official_travel_id uuid unique not null references official_travels(id) on delete cascade,
  report_date date,
  activities text,
  results text,
  recommendations text,
  submitted_by uuid references profiles(id),
  submitted_at timestamptz,
  verified_by uuid references profiles(id),
  verified_at timestamptz,
  document_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

# 24. ASSET MANAGEMENT

## asset_categories

```sql
create table asset_categories (
  id uuid primary key default gen_random_uuid(),
  code varchar(50) unique not null,
  name varchar(200) not null,
  description text,
  created_at timestamptz not null default now()
);
```

## asset_locations

```sql
create table asset_locations (
  id uuid primary key default gen_random_uuid(),
  code varchar(50) unique not null,
  name varchar(200) not null,
  description text,
  unit_id uuid references units(id),
  created_at timestamptz not null default now()
);
```

## assets

```sql
create table assets (
  id uuid primary key default gen_random_uuid(),
  asset_code varchar(100) unique not null,
  name varchar(255) not null,
  category_id uuid references asset_categories(id),
  location_id uuid references asset_locations(id),
  responsible_profile_id uuid references profiles(id),
  acquisition_date date,
  acquisition_value numeric(18,2),
  serial_number varchar(150),
  condition varchar(50),
  status asset_status not null default 'ACTIVE',
  description text,
  document_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

## asset_history

```sql
create table asset_history (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references assets(id) on delete cascade,
  action varchar(100) not null,
  old_location_id uuid references asset_locations(id),
  new_location_id uuid references asset_locations(id),
  old_status asset_status,
  new_status asset_status,
  old_responsible_id uuid references profiles(id),
  new_responsible_id uuid references profiles(id),
  notes text,
  actor_id uuid references profiles(id),
  created_at timestamptz not null default now()
);
```

---

# 25. DOCUMENT MANAGEMENT

## documents

```sql
create table documents (
  id uuid primary key default gen_random_uuid(),
  document_code varchar(100) unique,
  title varchar(255) not null,
  description text,
  category varchar(100) not null,
  status document_status not null default 'ACTIVE',
  owner_id uuid references profiles(id),
  unit_id uuid references units(id),
  retention_until date,
  is_confidential boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
```

## document_versions

```sql
create table document_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  version_number integer not null,
  file_name varchar(255) not null,
  storage_bucket varchar(100) not null,
  storage_path text not null,
  mime_type varchar(150),
  file_size bigint,
  checksum varchar(255),
  uploaded_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  unique(document_id, version_number)
);
```

## document_access

```sql
create table document_access (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  profile_id uuid references profiles(id),
  unit_id uuid references units(id),
  can_view boolean not null default true,
  can_download boolean not null default false,
  can_edit boolean not null default false,
  created_at timestamptz not null default now(),
  check (profile_id is not null or unit_id is not null)
);
```

---

# 26. ARCHIVES

```sql
create table archives (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id),
  archive_type varchar(100) not null,
  year integer not null,
  reference_number varchar(150),
  description text,
  unit_id uuid references units(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Archive type baseline:

```text
RENJA
RKPD
SURAT_MASUK
SURAT_KELUAR
PEMERINTAHAN
PEKPPP
LAINNYA
```

---

# 27. RENJA

```sql
create table renja_documents (
  id uuid primary key default gen_random_uuid(),
  year integer not null,
  title varchar(255) not null,
  document_id uuid not null references documents(id),
  unit_id uuid references units(id),
  version_label varchar(50),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(year, unit_id, title)
);
```

---

# 28. RKPD

```sql
create table rkpd_documents (
  id uuid primary key default gen_random_uuid(),
  year integer not null,
  title varchar(255) not null,
  document_id uuid not null references documents(id),
  unit_id uuid references units(id),
  version_label varchar(50),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(year, unit_id, title)
);
```

---

# 29. PEKPPP

## evaluations

```sql
create table pekppp_evaluations (
  id uuid primary key default gen_random_uuid(),
  evaluation_year integer not null,
  title varchar(255) not null,
  status pekppp_evaluation_status not null default 'DRAFT',
  started_at timestamptz,
  finalized_at timestamptz,
  created_by uuid references profiles(id),
  finalized_by uuid references profiles(id),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(evaluation_year)
);
```

---

# 30. PEKPPP ASPECTS

```sql
create table pekppp_aspects (
  id uuid primary key default gen_random_uuid(),
  code varchar(50) unique not null,
  name varchar(255) not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
```

Master aspek mengikuti instrumen PEKPPP resmi yang berlaku.

Jangan meng-hardcode daftar aspek ke frontend.

---

# 31. PEKPPP INDICATORS

```sql
create table pekppp_indicators (
  id uuid primary key default gen_random_uuid(),
  aspect_id uuid not null references pekppp_aspects(id) on delete cascade,
  code varchar(50) not null,
  name varchar(255) not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique(aspect_id, code)
);
```

---

# 32. PEKPPP QUESTIONS

```sql
create table pekppp_questions (
  id uuid primary key default gen_random_uuid(),
  indicator_id uuid not null references pekppp_indicators(id) on delete cascade,
  code varchar(50) not null,
  question_text text not null,
  answer_type varchar(50) not null,
  max_score numeric(10,2),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(indicator_id, code)
);
```

---

# 33. PEKPPP ANSWERS

```sql
create table pekppp_answers (
  id uuid primary key default gen_random_uuid(),
  evaluation_id uuid not null references pekppp_evaluations(id) on delete cascade,
  question_id uuid not null references pekppp_questions(id),
  answer_value jsonb,
  score numeric(10,2),
  notes text,
  answered_by uuid references profiles(id),
  answered_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(evaluation_id, question_id)
);
```

---

# 34. PEKPPP EVIDENCE

```sql
create table pekppp_evidences (
  id uuid primary key default gen_random_uuid(),
  evaluation_id uuid not null references pekppp_evaluations(id) on delete cascade,
  question_id uuid references pekppp_questions(id),
  title varchar(255) not null,
  description text,
  document_id uuid references documents(id),
  uploaded_by uuid references profiles(id),
  created_at timestamptz not null default now()
);
```

---

# 35. PEKPPP VERIFICATION

```sql
create table pekppp_verifications (
  id uuid primary key default gen_random_uuid(),
  evaluation_id uuid not null references pekppp_evaluations(id) on delete cascade,
  verifier_id uuid not null references profiles(id),
  status approval_status not null default 'PENDING',
  notes text,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);
```

---

# 36. APPROVALS

Approval generic digunakan untuk workflow yang membutuhkan persetujuan.

```sql
create table approvals (
  id uuid primary key default gen_random_uuid(),
  entity_type varchar(100) not null,
  entity_id uuid not null,
  requested_by uuid references profiles(id),
  approver_id uuid references profiles(id),
  status approval_status not null default 'PENDING',
  decision_notes text,
  requested_at timestamptz not null default now(),
  decided_at timestamptz
);
```

`entity_type` harus dikontrol oleh application layer.
Jangan menganggap generic approval otomatis aman tanpa authorization.

---

# 37. NOTIFICATIONS

```sql
create table notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references profiles(id) on delete cascade,
  type notification_type not null default 'INFO',
  title varchar(255) not null,
  message text not null,
  entity_type varchar(100),
  entity_id uuid,
  action_url text,
  is_read boolean not null default false,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
```

---

# 38. ACTIVITY LOGS

Untuk aktivitas yang ditampilkan kepada user.

```sql
create table activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id),
  action varchar(100) not null,
  entity_type varchar(100),
  entity_id uuid,
  message text,
  metadata jsonb,
  created_at timestamptz not null default now()
);
```

---

# 39. AUDIT LOGS

Audit merupakan catatan security/accountability.

```sql
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id),
  action varchar(100) not null,
  entity_type varchar(100),
  entity_id uuid,
  old_data jsonb,
  new_data jsonb,
  metadata jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);
```

Audit log tidak boleh diedit atau dihapus oleh user biasa.

---

# 40. SYSTEM SETTINGS

```sql
create table system_settings (
  key varchar(100) primary key,
  value jsonb not null,
  description text,
  is_public boolean not null default false,
  updated_by uuid references profiles(id),
  updated_at timestamptz not null default now()
);
```

Contoh konfigurasi:

```text
organization_name
organization_address
ticket_prefix
default_sla_days
notification_settings
document_max_size
```

Secret tidak boleh disimpan sebagai public setting.

---

# 41. RELATIONSHIP OVERVIEW

```text
auth.users
    |
    v
profiles
    |
    +---- units
    |
    +---- service_requests
    |
    +---- letters
    |
    +---- travels
    |
    +---- assets
    |
    +---- documents
    |
    +---- PEKPPP
    |
    +---- notifications
    |
    +---- audit_logs
```

---

# 42. PUBLIC SERVICE RELATIONSHIP

```text
services
   |
   +---- service_requirements
   +---- service_forms
   +---- service_slas
   |
   +---- service_requests
             |
             +---- service_request_events
             +---- service_request_documents
```

---

# 43. LETTER RELATIONSHIP

```text
incoming_letters
    |
    +---- dispositions
    |        |
    |        +---- disposition_recipients
    |
    +---- letter_attachments
    |
    +---- documents

outgoing_letters
    |
    +---- letter_attachments
    |
    +---- approvals
    |
    +---- documents
```

---

# 44. TRAVEL RELATIONSHIP

```text
official_travels
    |
    +---- travel_participants
    +---- travel_documents
    +---- travel_reports
    +---- approvals
```

---

# 45. ASSET RELATIONSHIP

```text
asset_categories
       |
       v
assets
  |
  +---- asset_history
  |
  +---- documents

asset_locations
       |
       +---- assets
```

---

# 46. DOCUMENT RELATIONSHIP

```text
documents
   |
   +---- document_versions
   +---- document_access
   +---- archives
   +---- renja_documents
   +---- rkpd_documents
```

---

# 47. PEKPPP RELATIONSHIP

```text
evaluation
   |
   +---- answers
   |       |
   |       +---- questions
   |               |
   |               +---- indicators
   |                       |
   |                       +---- aspects
   |
   +---- evidences
   +---- verifications
```

---

# 48. INDEX STRATEGY

Index wajib dibuat pada:

- foreign key yang sering digunakan;
- status;
- ticket number;
- register number;
- letter number;
- year;
- created_at;
- due_at;
- assigned role;
- assigned user;
- document code;
- asset code.

Contoh:

```sql
create index idx_service_requests_status
on service_requests(status);

create index idx_service_requests_assigned_role
on service_requests(assigned_role);

create index idx_service_requests_created_at
on service_requests(created_at desc);

create index idx_notifications_recipient_unread
on notifications(recipient_id, is_read);

create index idx_audit_logs_entity
on audit_logs(entity_type, entity_id);
```

Index harus berdasarkan query aktual, bukan dibuat berlebihan.

---

# 49. UNIQUE CONSTRAINT STRATEGY

Unique constraint wajib digunakan untuk identifier yang memang unik.

Contoh:

```text
ticket_number
register_number
letter_number
asset_code
document_code
service code
evaluation year
```

Jangan menggunakan unique constraint pada field yang secara bisnis
boleh memiliki nilai sama.

---

# 50. CHECK CONSTRAINTS

Constraint digunakan untuk menjaga data invalid.

Contoh:

```sql
check (return_date >= departure_date)
```

Contoh lain yang dapat diterapkan:

```text
file_size >= 0
estimated_days >= 0
score >= 0
year between 2000 and 2100
```

Batas angka harus disesuaikan dengan business rule final.

---

# 51. TIMESTAMP STRATEGY

Gunakan `timestamptz`.

Standar:

```text
created_at
updated_at
submitted_at
approved_at / decided_at
completed_at
deleted_at
```

UI dapat menampilkan waktu dalam zona waktu lokal Indonesia sesuai
kebutuhan organisasi.

---

# 52. UPDATED_AT STRATEGY

Tabel yang memiliki `updated_at` harus menggunakan trigger atau
application mechanism yang konsisten.

Rekomendasi:

```sql
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
```

Trigger diterapkan pada tabel mutable yang membutuhkan otomatisasi.

---

# 53. SOFT DELETE

Soft delete hanya digunakan untuk entity yang memang membutuhkan
retensi historis.

Contoh:

```text
documents
profiles
services
```

Untuk record transaksi seperti audit log, hard delete tidak boleh
tersedia bagi user biasa.

---

# 54. CASCADE RULE

`ON DELETE CASCADE` hanya digunakan apabila child memang tidak memiliki
arti tanpa parent.

Contoh aman:

```text
service -> service_requirements
service -> service_forms
service_request -> request_events
```

Untuk data historis atau compliance-sensitive gunakan RESTRICT,
SET NULL, atau strategi lain yang mempertahankan histori.

---

# 55. RLS PREPARATION

Tabel yang minimal membutuhkan RLS:

```text
profiles
service_requests
service_request_events
service_request_documents
incoming_letters
outgoing_letters
dispositions
official_travels
travel_reports
assets
documents
document_versions
document_access
archives
PEKPPP tables
notifications
audit_logs
activity_logs
approvals
system_settings
```

Master data publik dapat memiliki policy berbeda.

Detail policy berada pada:

`04_RBAC_AND_SECURITY.md`

---

# 56. RLS PRINCIPLES

RLS harus mengikuti:

```text
Authenticated?
    |
Role?
    |
Unit?
    |
Ownership?
    |
Workflow permission?
    |
ALLOW / DENY
```

Jangan membuat satu policy universal yang memberikan akses terlalu luas.

---

# 57. PUBLIC TRACKING SECURITY

Tracking tiket publik tidak boleh memberikan akses ke:

- data internal;
- catatan disposisi;
- audit;
- dokumen rahasia;
- nama pegawai internal;
- informasi keamanan.

Public tracking hanya mengembalikan informasi yang memang ditujukan
untuk pemohon.

---

# 58. DOCUMENT STORAGE

Recommended buckets:

```text
public-service-documents
office-documents
official-travel-documents
pekppp-evidence
archive-documents
```

Bucket internal harus private.

Storage path sebaiknya:

```text
{domain}/{entity_id}/{document_id}/{version}/{filename}
```

Jangan mengandalkan nama file asli sebagai path utama.

---

# 59. STORAGE METADATA

`document_versions` menyimpan:

```text
bucket
path
filename
mime_type
size
checksum
uploader
version
```

Binary file berada di Storage.

---

# 60. CHECKSUM

Untuk dokumen penting, checksum dapat digunakan untuk mendeteksi
perubahan file.

Contoh:

```text
SHA-256
```

Checksum bukan pengganti authorization.

---

# 61. DATA RETENTION

Setiap domain harus menentukan:

- retention period;
- archival policy;
- deletion policy;
- legal/compliance requirement.

Retention tidak boleh dibuat hanya berdasarkan keputusan frontend.

---

# 62. PERSONAL DATA

Data pemohon dan pegawai harus dibatasi sesuai kebutuhan.

Jangan menyimpan:

- data pribadi yang tidak diperlukan;
- credential;
- secret;
- password plaintext.

Authentication password dikelola Supabase Auth.

---

# 63. REPORTING DATA

Reporting sebaiknya membaca:

- views;
- aggregate queries;
- materialized views bila dibutuhkan.

Jangan mengubah data transaksi hanya untuk kebutuhan dashboard.

---

# 64. AUDIT IMMUTABILITY

Audit log idealnya append-only.

User biasa:

```text
INSERT: controlled
UPDATE: DENY
DELETE: DENY
```

Jika ada kebutuhan koreksi audit, koreksi dibuat sebagai audit event
baru, bukan mengubah histori lama.

---

# 65. NOTIFICATION RETENTION

Notification dapat memiliki retention lebih pendek daripada audit.

Notifikasi yang sudah dibaca dapat tetap disimpan untuk histori UI
sesuai kebutuhan.

---

# 66. MASTER DATA

Master data baseline harus memiliki seed.

Minimal:

```text
roles
units
service catalog
service requirements
service forms
PEKPPP aspects
PEKPPP indicators
PEKPPP questions
asset categories
asset locations
system settings
```

Master data production harus dapat dikelola melalui mekanisme admin
yang aman bila diperlukan.

---

# 67. SEED RULES

Seed harus:

- deterministic;
- idempotent bila memungkinkan;
- tidak memasukkan data pribadi;
- tidak memasukkan secret;
- dapat digunakan untuk development/demo.

---

# 68. MIGRATION STRUCTURE

Directory:

```text
supabase/
└── migrations/
    ├── 202608140001_extensions.sql
    ├── 202608140002_enums.sql
    ├── 202608140003_identity.sql
    ├── 202608140004_public_services.sql
    ├── 202608140005_smart_office.sql
    ├── 202608140006_documents.sql
    ├── 202608140007_pekppp.sql
    ├── 202608140008_system.sql
    ├── 202608140009_indexes.sql
    └── 202608140010_rls.sql
```

Nomor migration aktual boleh berbeda sesuai urutan implementasi.

---

# 69. MIGRATION RULES

Jangan mengedit migration lama yang sudah diterapkan pada environment
bersama/production.

Untuk perubahan gunakan migration baru.

Contoh:

```text
001 create table
002 add column
003 add index
004 alter policy
```

---

# 70. DATABASE FUNCTION RULE

Database function digunakan untuk:

- transaction;
- security-sensitive operation;
- aggregate;
- reusable database logic.

Jangan memindahkan seluruh business logic ke database tanpa alasan.

---

# 71. TRIGGER RULE

Trigger dapat digunakan untuk:

- updated_at;
- audit tertentu;
- derived consistency.

Trigger tidak boleh menyebabkan side effect yang sulit dipahami.

Semua trigger harus terdokumentasi.

---

# 72. DATA INTEGRITY

Database harus menjaga:

- foreign key;
- uniqueness;
- valid status;
- required fields;
- valid date range;
- valid references.

Application validation tidak menggantikan database constraint.

---

# 73. DATA ACCESS

Semua query aplikasi harus:

- scoped;
- paginated;
- authorized;
- indexed bila diperlukan.

Hindari:

```sql
select * from huge_table;
```

Gunakan kolom yang diperlukan.

---

# 74. PAGINATION

Entity berikut wajib mendukung pagination:

```text
service_requests
incoming_letters
outgoing_letters
dispositions
official_travels
assets
documents
archives
notifications
audit_logs
activity_logs
```

---

# 75. SEARCH

Search fields baseline:

### Service Requests

```text
ticket_number
applicant_name
organization
status
```

### Incoming Letters

```text
register_number
letter_number
sender
subject
```

### Outgoing Letters

```text
letter_number
recipient
subject
```

### Assets

```text
asset_code
name
serial_number
```

### Documents

```text
document_code
title
category
year
```

---

# 76. DATA EXPORT

Export harus dilakukan melalui query yang tetap menghormati authorization.

Format minimal:

```text
CSV
XLSX
PDF
```

Implementasi format dapat berada pada application/server layer.

---

# 77. REPORT SNAPSHOT

Laporan resmi yang sudah diterbitkan sebaiknya dapat memiliki snapshot
atau file output sehingga angka laporan historis tidak berubah hanya
karena data transaksi berubah.

---

# 78. APPROVAL DATA

Approval harus selalu dapat menjawab:

```text
siapa meminta?
siapa menyetujui?
kapan?
keputusan apa?
catatan apa?
entity apa?
```

---

# 79. WORKFLOW HISTORY

Untuk workflow kritis, status history harus tersedia.

Minimal:

```text
old_status
new_status
actor
timestamp
notes
```

Data ini dapat berada di event table khusus atau audit log sesuai
kebutuhan domain.

---

# 80. SERVICE TICKET GENERATION

Ticket number harus:

- unik;
- mudah dibaca;
- tidak mengekspos UUID;
- dapat dicari.

Contoh pola:

```text
EK-2026-000001
```

Format final harus configurable.

---

# 81. LETTER NUMBERING

Nomor surat tidak boleh hanya dibuat dari frontend.

Numbering harus mencegah duplicate dan race condition.

Gunakan database sequence/counter atau transaction-safe mechanism.

---

# 82. DOCUMENT NUMBERING

Nomor dokumen resmi harus menggunakan mekanisme yang sama:
transaction-safe dan tidak mudah menghasilkan duplicate.

---

# 83. YEAR PARTITIONING

Partitioning database tidak diperlukan pada tahap awal.

Jika volume audit/log sangat besar, partitioning dapat dipertimbangkan
setelah profiling production.

---

# 84. PERFORMANCE INDEX REVIEW

Index harus ditinjau berdasarkan:

- query plan;
- actual traffic;
- table size;
- read/write ratio.

Jangan menambahkan index secara otomatis pada semua kolom.

---

# 85. BACKUP

Backup database harus mencakup seluruh tabel dan konfigurasi penting.

Storage backup harus mempertimbangkan dokumen yang berada di Storage.

---

# 86. RESTORE

Restore testing harus dilakukan secara berkala.

Target:

```text
backup
 ↓
restore
 ↓
validate schema
 ↓
validate data
 ↓
validate storage references
 ↓
validate application
```

---

# 87. DATABASE TESTING

Minimal test:

- foreign key;
- unique constraint;
- check constraint;
- RLS;
- role access;
- public tracking isolation;
- workflow transition;
- upload authorization.

---

# 88. SECURITY TESTING

Wajib menguji:

```text
anonymous user
authenticated public user
admin_perencanaan
admin_litbang
admin_sekretariat
admin_pekppp
pimpinan
superadmin
```

Setiap role harus diuji terhadap data yang boleh dan tidak boleh dilihat.

---

# 89. DATABASE ACCEPTANCE CRITERIA

Schema dianggap siap apabila:

1. Semua domain PRD terwakili.
2. Semua entity utama memiliki primary key.
3. Relasi penting memiliki foreign key.
4. Status workflow terdefinisi.
5. Audit tersedia.
6. Notification tersedia.
7. Document storage relation tersedia.
8. PEKPPP dapat dikonfigurasi.
9. Public services dapat dikonfigurasi.
10. RLS dapat diterapkan.
11. Migration strategy tersedia.
12. Seed strategy tersedia.
13. Index strategy tersedia.
14. Tidak ada secret di database.
15. Tidak ada kebutuhan bisnis utama yang belum memiliki representasi data.

---

# 90. IMPLEMENTATION ORDER

Urutan implementasi database:

```text
1. Extensions
2. Enums
3. Units
4. Profiles
5. Public Services
6. Documents
7. Smart Office
8. Archives / Planning
9. PEKPPP
10. Notifications
11. Approvals
12. Activity Logs
13. Audit Logs
14. Indexes
15. Functions / Triggers
16. RLS
17. Seeds
18. Database Tests
```

Jika dependency menyebabkan urutan berbeda, migration dapat dipecah
lebih kecil tanpa mengubah domain architecture.

---

# 91. IMPORTANT IMPLEMENTATION NOTE

Schema di atas adalah logical baseline.

Sebelum migration production:

- seluruh FK harus diperiksa kembali;
- RLS harus ditulis dan diuji;
- role policy harus disesuaikan dengan workflow;
- official PEKPPP instrument harus dimasukkan berdasarkan instrumen
  yang berlaku;
- nomenklatur organisasi harus diverifikasi;
- retention policy harus diverifikasi;
- kebutuhan nomor surat harus diverifikasi;
- kebutuhan standar pelayanan harus diverifikasi.

AI coding agent tidak boleh mengarang aturan pemerintah yang belum
ditetapkan dalam dokumen sumber.

---

# 92. SOURCE OF TRUTH

Untuk database:

```text
00_PROJECT_CHARTER.md
        ↓
01_PRD.md
        ↓
02_SYSTEM_ARCHITECTURE.md
        ↓
03_DATABASE_SCHEMA.md
        ↓
04_RBAC_AND_SECURITY.md
```

Jika schema bertentangan dengan PRD, jangan langsung mengubah schema.
Identifikasi conflict dan lakukan review requirement terlebih dahulu.

---

# 93. NEXT DOCUMENT

Dokumen berikutnya:

`04_RBAC_AND_SECURITY.md`

Dokumen tersebut harus mendefinisikan secara rinci:

- role;
- permission;
- route protection;
- feature authorization;
- RLS policies;
- ownership;
- unit-based access;
- approval security;
- document security;
- public tracking security;
- audit security;
- session security;
- file upload security;
- security testing matrix.

Database schema ini menjadi fondasi untuk dokumen tersebut.
