# E-KANJOLI — SYSTEM ARCHITECTURE

> Status: APPROVED BASELINE
> Version: 1.0
> Last Updated: 2026-08-14
> Institution: Bappeda & Litbang Kabupaten Banggai Kepulauan
> Parent Document: 00_PROJECT_CHARTER.md
> Requirements Document: 01_PRD.md

---

# 1. ARCHITECTURE OVERVIEW

E-KANJOLI menggunakan arsitektur modular web application yang memisahkan:

1. Presentation Layer
2. Application Layer
3. Data Access Layer
4. Database Layer
5. File Storage Layer
6. Authentication & Authorization
7. Notification Layer
8. Audit Layer

Arsitektur harus mengutamakan security, maintainability, modularity,
testability, scalability, traceability, dan simplicity.

---

# 2. TECHNOLOGY STACK

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide Icons

Frontend bertanggung jawab terhadap rendering UI, routing, form,
client-side validation, state UI, session awareness, data interaction,
dan user feedback.

Frontend bukan security boundary.

---

# 3. BACKEND PLATFORM

Backend menggunakan Supabase sebagai platform utama.

Komponen:

- Supabase Auth
- PostgreSQL
- Supabase Storage
- Row Level Security
- Database Functions apabila diperlukan
- Edge Functions apabila diperlukan

Business-critical authorization harus tetap ditegakkan pada
database/server side.

---

# 4. HIGH LEVEL ARCHITECTURE

```text
                         INTERNET
                             |
                             v
                    +----------------+
                    | Public Portal  |
                    +----------------+
                             |
                             v
                    +----------------+
                    | React Frontend |
                    +----------------+
                             |
              +--------------+--------------+
              |                             |
              v                             v
       Supabase Auth                  Application Logic
              |                             |
              +--------------+--------------+
                             |
                             v
                    +----------------+
                    | PostgreSQL     |
                    | + RLS          |
                    +----------------+
                       |           |
                       v           v
                 Data Layer     Audit Layer
                       |
                       v
                Supabase Storage
                       |
                       v
                Document Files
```

---

# 5. SYSTEM BOUNDARIES

```text
E-KANJOLI
│
├── Identity & Access
├── Public Portal
├── Public Services
├── Smart Office
├── PEKPPP
├── Document Management
├── Notification
├── Audit & Activity
├── Reporting
└── Administration
```

Setiap domain harus memiliki batas tanggung jawab yang jelas.

---

# 6. DOMAIN ARCHITECTURE

## Identity & Access

Mengelola authentication, session, profile, role, permission,
authorization, dan security policy.

## Public Services

Mengelola service catalog, requirements, forms, applications,
ticket, verification, workflow, SLA, dan output documents.

## Smart Office

Mengelola incoming letters, outgoing letters, disposition,
official travel, assets, dan archives.

## PEKPPP

Mengelola evaluation periods, instruments, aspects, indicators,
questions, answers, evidence, scoring, dan verification.

## Document Management

Mengelola document metadata, storage, categorization, version,
archive, dan access control.

## Notification

Mengelola user notification, deadline notification,
workflow notification, dan system notification.

## Audit

Mengelola login, data changes, approval, verification, upload,
download, status transitions, dan security events.

## Reporting

Mengelola dashboard, aggregate data, operational reports,
executive reports, dan export.

---

# 7. APPLICATION LAYERS

```text
UI
 |
 v
Pages
 |
 v
Features
 |
 v
Application Services
 |
 v
Data Access
 |
 v
Supabase
```

Jangan menaruh seluruh business logic di component UI.

---

# 8. FEATURE LAYER

```text
features/
├── auth/
├── public-services/
├── smart-office/
├── pekppp/
├── documents/
├── notifications/
├── audit/
├── reporting/
└── administration/
```

Feature tidak boleh saling bergantung secara sembarangan.

---

# 9. APPLICATION SERVICE LAYER

Application service menangani operasi bisnis.

Contoh:

```text
createServiceRequest()
verifyServiceRequest()
approveOutgoingLetter()
createDisposition()
completeDisposition()
createOfficialTravel()
submitTravelReport()
uploadEvidence()
finalizeEvaluation()
```

Component UI tidak boleh langsung mengandung seluruh proses bisnis.

---

# 10. DATA ACCESS LAYER

```text
data/
├── services/
├── service-requests/
├── letters/
├── dispositions/
├── travels/
├── assets/
├── documents/
├── pekppp/
├── notifications/
└── reports/
```

Semua komunikasi database harus menggunakan data access module
yang terstruktur agar query tidak tersebar di seluruh component.

---

# 11. SUPABASE ARCHITECTURE

```text
Supabase
│
├── Auth
├── PostgreSQL
│   ├── Tables
│   ├── Views
│   ├── Functions
│   ├── Triggers
│   └── RLS
├── Storage
└── Edge Functions
```

---

# 12. AUTHENTICATION FLOW

```text
User
 ↓
Login
 ↓
Supabase Auth
 ↓
Session Created
 ↓
Frontend receives session
 ↓
Load Profile
 ↓
Load Role
 ↓
Authorize Route
 ↓
Render Dashboard
```

Session tidak boleh dipercaya hanya berdasarkan data dari frontend.

---

# 13. USER PROFILE

```text
auth.users
     |
     v
profiles
     |
     v
role / unit / metadata
```

`auth.users` merupakan sumber identity.
`profiles` merupakan sumber informasi aplikasi.

---

# 14. AUTHORIZATION FLOW

```text
User
 ↓
Authenticated?
 ↓
Profile exists?
 ↓
Role valid?
 ↓
Route allowed?
 ↓
Feature allowed?
 ↓
Database RLS allowed?
 ↓
Operation executed
```

Semua lapisan harus konsisten.

---

# 15. RBAC ARCHITECTURE

Role resmi:

```text
superadmin
admin_pekppp
admin_perencanaan
admin_litbang
admin_sekretariat
pimpinan
```

Role tidak boleh ditentukan berdasarkan nama user.
Role harus berasal dari database/application profile.

## Superadmin

Memiliki akses administrasi sistem. Tidak boleh otomatis digunakan
untuk proses bisnis sehari-hari.

## Admin PEKPPP

Hanya mengelola domain PEKPPP.

## Admin Perencanaan

Mengelola layanan Perencanaan dan data yang terkait kewenangannya.

## Admin Litbang

Mengelola layanan Litbang dan data yang terkait kewenangannya.

## Admin Sekretariat

Mengelola layanan PPID, surat, disposisi, perjalanan dinas,
aset, dan arsip.

## Pimpinan

Default READ dan approval tertentu sesuai workflow.

---

# 16. RLS ARCHITECTURE

Row Level Security merupakan security boundary database.

```text
admin_perencanaan
    |
    +-- service_requests WHERE assigned_role =
        admin_perencanaan

admin_litbang
    |
    +-- service_requests WHERE assigned_role =
        admin_litbang

admin_sekretariat
    |
    +-- secretariat domains

admin_pekppp
    |
    +-- PEKPPP domains

pimpinan
    |
    +-- approved read-only domains
```

Implementasi detail RLS berada pada `04_RBAC_AND_SECURITY.md`.

---

# 17. PUBLIC PORTAL ARCHITECTURE

```text
Public
│
├── Home
├── Services
├── Service Detail
├── Application
├── Tracking
├── Public Information
└── Complaints
```

Public user tidak mendapatkan akses ke internal dashboard.

---

# 18. PUBLIC SERVICE DATA FLOW

```text
Public User
    |
    v
Service Catalog
    |
    v
Select Service
    |
    v
Dynamic Form
    |
    v
Submit Application
    |
    v
Create Ticket
    |
    v
Service Request
    |
    v
Assigned Role
    |
    v
Verification
    |
    v
Processing
    |
    v
Completion
```

---

# 19. SMART OFFICE ARCHITECTURE

```text
Smart Office
│
├── Incoming Letters
├── Outgoing Letters
├── e-Disposition
├── Official Travel
│   ├── SPT
│   ├── SPPD
│   └── Travel Reports
├── Assets
└── Archives
    ├── RENJA
    ├── RKPD
    └── Other Documents
```

---

# 20. LETTER ARCHITECTURE

Surat masuk dan surat keluar merupakan domain administrasi.

```text
Incoming Letter
       |
       v
Disposition
       |
       v
Follow-up
       |
       v
Archive
```

Surat keluar:

```text
Draft
 ↓
Review
 ↓
Approval
 ↓
Numbering
 ↓
Signing
 ↓
Sent
 ↓
Archive
```

---

# 21. E-DISPOSITION ARCHITECTURE

Disposition memiliki parent `letter` dan child `disposition`.

Satu surat dapat memiliki histori disposisi.
Setiap perubahan status harus tercatat.

---

# 22. OFFICIAL TRAVEL ARCHITECTURE

```text
Travel Order
    |
    +-- SPT
    +-- SPPD
    +-- Participants
    +-- Travel Details
    +-- Travel Report
    +-- Supporting Documents
```

---

# 23. ASSET ARCHITECTURE

Asset memiliki identity, category, location, responsible person,
condition, dan status.

Perubahan penting menggunakan history.

```text
Asset
 |
 +-- Asset History
 |
 +-- Asset Documents
 |
 +-- Asset Photos
```

---

# 24. DOCUMENT ARCHITECTURE

Metadata dan file dipisahkan.

```text
Database
    |
    +-- document metadata
    +-- owner
    +-- category
    +-- version
    +-- access policy
            |
            v
       Supabase Storage
            |
            v
       Actual File
```

Database tidak menyimpan binary file.

---

# 25. STORAGE SECURITY

Dokumen internal harus menggunakan private bucket.

Akses menggunakan signed URL atau mekanisme aman lainnya.

Frontend tidak boleh menggunakan public bucket untuk dokumen sensitif.

---

# 26. DOCUMENT VERSIONING

```text
Document
 |
 +-- Version 1
 +-- Version 2
 +-- Version 3
```

Version terbaru harus dapat ditentukan secara eksplisit.
Dokumen historis tidak boleh hilang hanya karena upload versi baru.

---

# 27. PEKPPP ARCHITECTURE

```text
Evaluation Period
       |
       v
Instrument
       |
       v
Aspect
       |
       v
Indicator
       |
       v
Question
       |
       +---- Answer
       +---- Evidence
       +---- Score
       +---- Verification
```

PEKPPP harus bersifat configurable.

---

# 28. PEKPPP DATA ISOLATION

Data PEKPPP tidak boleh tercampur dengan workflow layanan publik.

Domain PEKPPP harus memiliki model data sendiri.
Integration hanya dilakukan melalui referensi yang diperlukan.

---

# 29. NOTIFICATION ARCHITECTURE

```text
Business Event
      |
      v
Notification Service
      |
      v
notifications table
      |
      v
User Notification Center
```

Contoh event:

```text
REQUEST_CREATED
REQUEST_ASSIGNED
REQUEST_STATUS_CHANGED
DISPOSITION_ASSIGNED
DISPOSITION_DUE
APPROVAL_REQUIRED
DOCUMENT_UPLOADED
EVALUATION_VERIFIED
```

---

# 30. AUDIT ARCHITECTURE

```text
Business Operation
       |
       +---- Data Change
       |
       +---- Audit Event
```

Audit event minimal:

- actor;
- action;
- entity;
- entity_id;
- timestamp;
- metadata.

Untuk perubahan penting juga simpan before dan after.

Audit tidak boleh dihapus oleh pengguna biasa.

---

# 31. ACTIVITY VS AUDIT

### Activity

Untuk kebutuhan UI.

```text
Surat telah didisposisikan kepada Kepala Subbagian.
```

### Audit

Untuk security dan accountability.

```text
actor_id
action = DISPATCH
entity = incoming_letter
entity_id = ...
timestamp = ...
```

---

# 32. REPORTING ARCHITECTURE

Untuk query kompleks gunakan:

- database views;
- materialized views apabila diperlukan;
- aggregate queries.

Jangan mengambil seluruh tabel kemudian menghitung semuanya di browser.

---

# 33. DASHBOARD ARCHITECTURE

```text
Dashboard
├── KPI Cards
├── Service Overview
├── Smart Office Overview
├── PEKPPP Overview
├── SLA Overview
├── Recent Activities
└── Notifications
```

Widget dapat disesuaikan berdasarkan role.

---

# 34. SEARCH ARCHITECTURE

Search harus menggunakan query terkontrol.

Jangan melakukan `SELECT *` terhadap seluruh database tanpa filter.

```text
Global Search
   |
   +-- Tickets
   +-- Letters
   +-- Documents
   +-- Assets
   +-- Travel
```

Hasil search tetap tunduk terhadap RLS.

---

# 35. FILTER & PAGINATION

Semua tabel besar harus menggunakan:

- pagination;
- server-side filtering;
- ordering;
- search.

Frontend tidak boleh mengunduh seluruh dataset hanya untuk
menampilkan 20 baris.

---

# 36. ERROR ARCHITECTURE

Error dibagi menjadi:

```text
Validation Error
Authorization Error
Authentication Error
Not Found
Conflict
Business Rule Error
System Error
Network Error
```

UI harus menampilkan pesan yang aman.
Detail teknis dicatat dalam logging internal.

---

# 37. LOADING & EMPTY STATE

Setiap asynchronous page harus memiliki:

- loading state;
- error state;
- empty state;
- success state.

---

# 38. FORM ARCHITECTURE

Form harus memiliki:

- schema;
- validation;
- field component;
- error message;
- loading state;
- submit state;
- success feedback.

Form kompleks sebaiknya menggunakan reusable form architecture.

---

# 39. ROUTING ARCHITECTURE

```text
/
├── public routes
├── /login
└── /app
    ├── dashboard
    ├── services
    ├── smart-office
    ├── pekppp
    ├── documents
    ├── reports
    └── administration
```

Route protection tidak menggantikan RLS.

---

# 40. FRONTEND PROJECT STRUCTURE

```text
src/
├── app/
│   ├── router/
│   ├── providers/
│   └── layouts/
├── components/
│   ├── ui/
│   ├── forms/
│   ├── tables/
│   └── feedback/
├── features/
│   ├── auth/
│   ├── public-services/
│   ├── smart-office/
│   ├── pekppp/
│   ├── documents/
│   ├── notifications/
│   ├── audit/
│   ├── reporting/
│   └── administration/
├── pages/
├── hooks/
├── lib/
│   ├── supabase/
│   ├── validation/
│   ├── formatting/
│   └── utilities/
├── types/
├── config/
└── styles/
```

Struktur dapat berkembang selama tetap mengikuti boundary domain.

---

# 41. SUPABASE PROJECT STRUCTURE

```text
supabase/
├── migrations/
├── functions/
└── seed/
```

Migration harus menjadi sumber kebenaran struktur database.
Jangan mengandalkan perubahan manual database production.

---

# 42. DATABASE MIGRATION RULE

Setiap perubahan database harus menghasilkan migration.

Contoh:

```text
202608140001_initial_schema.sql
202608140002_add_service_requests.sql
202608140003_add_documents.sql
```

Migration harus repeatable, reviewable, versioned, dan committed ke Git.

---

# 43. SEED DATA

Seed digunakan untuk:

- development;
- testing;
- demo.

Seed tidak boleh mengandung data pribadi production.

Master data seperti role dan service catalog dapat memiliki seed resmi.

---

# 44. ENVIRONMENT ARCHITECTURE

Environment minimal:

```text
Development
Staging
Production
```

Development dan production tidak boleh menggunakan credential yang sama.

---

# 45. ENVIRONMENT VARIABLES

Frontend hanya boleh menerima variable yang aman untuk client.

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Service role key:

```text
SUPABASE_SERVICE_ROLE_KEY
```

tidak boleh berada di frontend.

---

# 46. SECURITY BOUNDARY

```text
Browser
   |
   | untrusted
   v
Frontend
   |
   v
Supabase
   |
   +-- Auth
   +-- RLS
   +-- Database Constraints
   +-- Server-side Logic
```

Frontend tidak boleh dianggap trusted.

---

# 47. SECRET MANAGEMENT

Secret tidak boleh:

- disimpan dalam source code;
- dimasukkan ke Git;
- ditampilkan di UI;
- dimasukkan ke client bundle.

Gunakan environment configuration.

---

# 48. FILE UPLOAD SECURITY

Upload harus memvalidasi:

- MIME type;
- extension;
- size;
- ownership;
- authorization.

File harus disimpan dengan identifier yang aman.
Jangan menggunakan nama file user sebagai satu-satunya identifier.

---

# 49. API / DATA ACCESS RULE

Frontend harus mengakses data melalui Supabase client atau endpoint
server-side yang telah ditentukan.

Tidak boleh membuat koneksi database langsung dari browser.

---

# 50. BUSINESS RULE LOCATION

### UI

UX validation.

### Application

Business workflow.

### Database

Integrity dan security.

Contoh:

```text
UI:
tanggal tidak boleh kosong

Application:
surat hanya dapat dikirim setelah approval

Database:
foreign key harus valid
```

---

# 51. TRANSACTIONAL OPERATIONS

Operasi yang membutuhkan atomicity sebaiknya menggunakan database
transaction/function.

Contoh:

```text
Approve Letter
    |
    +-- Update status
    +-- Create audit
    +-- Create notification
```

Ketiga operasi harus dipertimbangkan sebagai satu business operation.

---

# 52. CONCURRENCY

Sistem harus mempertimbangkan dua user mengubah data yang sama.

Untuk data kritis gunakan:

- status validation;
- timestamps;
- optimistic concurrency;
- database constraints;
- transaction.

---

# 53. STATUS TRANSITION

Status tidak boleh berubah sembarangan.

Contoh:

```text
DRAFT
 ↓
REVIEW
 ↓
APPROVAL
 ↓
SIGNED
 ↓
SENT
```

User tidak boleh langsung mengubah `DRAFT → SENT` jika workflow
tidak mengizinkannya.

---

# 54. DOMAIN EVENT

Business event dapat digunakan untuk memicu:

- notification;
- audit;
- reporting update.

Contoh:

```text
REQUEST_COMPLETED
```

menghasilkan:

```text
Audit
Notification
SLA update
Dashboard update
```

---

# 55. PERFORMANCE STRATEGY

Prioritas:

1. pagination;
2. indexed queries;
3. selective columns;
4. lazy loading;
5. code splitting;
6. caching bila diperlukan;
7. optimized storage access.

---

# 56. SCALABILITY

Arsitektur harus memungkinkan penambahan:

- layanan publik baru;
- role baru;
- unit baru;
- modul baru;
- indikator PEKPPP baru;
- jenis dokumen baru.

Perubahan tersebut harus melalui change management.

---

# 57. ACCESSIBILITY

Frontend harus:

- keyboard accessible;
- semantic;
- readable;
- responsive;
- mempunyai focus state;
- mempunyai form labels;
- mempunyai error messages.

---

# 58. OBSERVABILITY

System monitoring minimal mencakup:

- application errors;
- database errors;
- failed requests;
- authentication events;
- audit events;
- deployment status.

---

# 59. BACKUP ARCHITECTURE

Backup mencakup:

```text
Database
+
Storage
+
Configuration
```

Backup harus dapat dipulihkan.

Backup tanpa restore testing tidak dianggap sufficient.

---

# 60. DISASTER RECOVERY

Minimal menentukan:

- Recovery Point Objective;
- Recovery Time Objective;
- backup frequency;
- restore procedure;
- responsible administrator.

Detail operational ditentukan dalam `16_DEPLOYMENT_AND_DEVOPS.md`.

---

# 61. TESTING ARCHITECTURE

```text
Unit
 ↓
Component
 ↓
Integration
 ↓
Database/RLS
 ↓
End-to-End
```

Security-critical workflow harus memiliki test.

---

# 62. DEPLOYMENT ARCHITECTURE

```text
Git
 ↓
CI
 ↓
Lint
 ↓
Test
 ↓
Build
 ↓
Deploy
```

Production deployment harus dapat ditelusuri ke commit tertentu.

---

# 63. CI/CD

Minimal pipeline:

```text
Install
 ↓
Lint
 ↓
Type Check
 ↓
Test
 ↓
Build
```

Deployment hanya dilakukan apabila pipeline berhasil.

---

# 64. ARCHITECTURE DECISION RULE

Jika terjadi konflik antara convenience, speed, dan security,
maka security harus diprioritaskan untuk data dan workflow sensitif.

Jika terjadi konflik antara frontend convenience dan database security,
database security menjadi prioritas.

---

# 65. AI DEVELOPMENT BOUNDARY

AI coding agent harus menganggap dokumen berikut sebagai sumber
kebenaran:

```text
00_PROJECT_CHARTER.md
01_PRD.md
02_SYSTEM_ARCHITECTURE.md
```

AI tidak boleh mengubah business requirement hanya karena menemukan
cara implementasi yang lebih mudah.

---

# 66. AI IMPLEMENTATION RULE

Sebelum membuat feature AI harus:

1. Membaca PRD.
2. Membaca architecture.
3. Mengidentifikasi domain.
4. Mengidentifikasi database dependency.
5. Mengidentifikasi authorization.
6. Mengidentifikasi audit requirement.
7. Mengidentifikasi notification requirement.
8. Baru membuat code.

---

# 67. ARCHITECTURE ANTI-PATTERNS

Dilarang:

- giant component;
- giant page;
- direct database query everywhere;
- duplicated business logic;
- role check hanya di frontend;
- service role key di frontend;
- public bucket untuk dokumen internal;
- hardcoded service catalog;
- hardcoded PEKPPP questions tanpa alasan;
- uncontrolled global state;
- SELECT * pada dataset besar;
- bypass RLS.

---

# 68. MODULARITY RULE

Setiap modul harus dapat diuji, dipelihara, dikembangkan, dan diperbaiki
tanpa merusak modul lain.

---

# 69. SOURCE OF TRUTH

Urutan sumber kebenaran:

```text
Project Charter
      ↓
PRD
      ↓
System Architecture
      ↓
Database Schema
      ↓
RBAC & Security
      ↓
Workflow
      ↓
Implementation
```

Jika implementasi bertentangan dengan dokumentasi, dokumentasi harus
ditinjau sebelum code diubah.

---

# 70. IMPLEMENTATION PHASES

## Phase 1 — Foundation

- Vite;
- React;
- TypeScript;
- Tailwind;
- routing;
- project structure.

## Phase 2 — Backend Foundation

- Supabase;
- authentication;
- profiles;
- roles;
- migrations.

## Phase 3 — Security

- RLS;
- authorization;
- audit.

## Phase 4 — Smart Office

- Surat Masuk;
- Surat Keluar;
- e-Disposisi;
- Perjalanan Dinas;
- Aset;
- Arsip.

## Phase 5 — Public Services

- catalog;
- application;
- ticket;
- tracking;
- service workflow.

## Phase 6 — PEKPPP

- evaluation;
- F01;
- evidence;
- scoring.

## Phase 7 — Dashboard & Reporting

- dashboard;
- SLA;
- reports;
- export.

## Phase 8 — Hardening

- testing;
- security;
- performance;
- backup;
- deployment.

---

# 71. ARCHITECTURE ACCEPTANCE CRITERIA

Architecture dianggap siap apabila:

1. Semua domain utama terdefinisi.
2. Role boundary terdefinisi.
3. Authentication flow terdefinisi.
4. Authorization flow terdefinisi.
5. RLS boundary terdefinisi.
6. Storage boundary terdefinisi.
7. Frontend structure terdefinisi.
8. Database migration strategy terdefinisi.
9. Audit boundary terdefinisi.
10. Notification boundary terdefinisi.
11. Public/internal separation terdefinisi.
12. Deployment flow terdefinisi.
13. Testing layer terdefinisi.
14. Security boundary terdefinisi.
15. Tidak terdapat kebutuhan bisnis penting yang bertentangan dengan PRD.

---

# 72. ARCHITECTURE BASELINE

E-KANJOLI menggunakan:

```text
Frontend
React + TypeScript + Vite + Tailwind CSS

Backend Platform
Supabase

Database
PostgreSQL

Authentication
Supabase Auth

Authorization
RBAC + PostgreSQL RLS

File Storage
Supabase Storage

Version Control
Git

CI/CD
Git-based pipeline

Architecture
Modular Domain-Based Architecture
```

Architecture baseline ini menjadi acuan untuk seluruh dokumen teknis
berikutnya.

---

# 73. NEXT TECHNICAL DOCUMENT

Dokumen berikutnya:

`03_DATABASE_SCHEMA.md`

Dokumen tersebut harus menerjemahkan architecture dan PRD menjadi:

- tabel;
- enum;
- primary key;
- foreign key;
- indexes;
- constraints;
- timestamps;
- soft delete;
- audit relation;
- storage relation;
- RLS preparation;
- seed data;
- migration strategy.

Database schema tidak boleh dibuat bertentangan dengan dokumen ini.
