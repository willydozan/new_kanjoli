# E-KANJOLI — UI/UX DESIGN SYSTEM
## Version 1.2 — React Application Baseline

> Status: APPROVED BASELINE  
> Purpose: Master reference for building the E-KANJOLI React interface.  
> Related documents: `01_PRD.md`, `02_SYSTEM_ARCHITECTURE.md`, `03_DATABASE_SCHEMA.md`, `04_RBAC_AND_SECURITY.md`, `05_WORKFLOW.md`

---

# 1. PURPOSE

Dokumen ini menjadi acuan utama pembangunan seluruh antarmuka E-KANJOLI.

Semua halaman React, komponen, navigasi, dashboard, form, tabel, modal, notifikasi dan visualisasi data harus mengikuti prinsip dalam dokumen ini.

UI harus:

- konsisten
- profesional
- mudah dipahami pegawai
- responsive
- accessible
- aman
- scalable
- modular
- tidak hard-coded terhadap struktur organisasi

UI bukan sumber kebenaran authorization.

Authorization tetap berasal dari:

```text
Supabase Auth
    +
Application Role
    +
Position
    +
Organizational Hierarchy
    +
Permission
    +
RLS
```

Frontend hanya merepresentasikan hasil authorization tersebut.

---

# 2. PRODUCT EXPERIENCE

E-KANJOLI adalah aplikasi pemerintahan internal dan pelayanan publik.

Karakter visual:

```text
Professional
Institutional
Modern
Calm
Trustworthy
Efficient
Data-oriented
```

Hindari:

- desain seperti media sosial
- terlalu banyak gradient
- animasi berlebihan
- dashboard penuh kartu tanpa prioritas
- warna mencolok tanpa fungsi
- ikon tanpa label pada aksi penting
- tabel yang terlalu padat pada layar kecil

---

# 3. DESIGN PRINCIPLES

## 3.1 Clarity

Pengguna harus mengetahui:

```text
Saya sedang berada di mana?
Apa yang harus saya lakukan?
Apa status pekerjaan saya?
Apa yang membutuhkan perhatian saya?
```

## 3.2 Hierarchy

Informasi paling penting harus paling mudah ditemukan.

Prioritas:

```text
Urgent
  ↓
Action Required
  ↓
Progress
  ↓
Information
  ↓
History
```

## 3.3 Consistency

Komponen yang sama harus mempunyai perilaku yang sama di seluruh aplikasi.

Contoh:

```text
Primary Button
Secondary Button
Danger Button
Status Badge
Data Table
Search
Filter
Pagination
Modal
Toast
```

tidak boleh mempunyai desain berbeda antar halaman tanpa alasan UX.

## 3.4 Accessibility

Target minimum:

```text
WCAG 2.1 AA
```

Perhatikan:

- keyboard navigation
- focus state
- readable text
- sufficient contrast
- semantic HTML
- form labels
- error messages
- screen-reader-friendly controls

---

# 4. APPLICATION SHELL

Layout utama:

```text
┌────────────────────────────────────────────────────────────┐
│ Topbar                                                     │
├───────────────┬────────────────────────────────────────────┤
│ Sidebar       │ Breadcrumb                                 │
│ Navigation    │                                             │
│               │ Page Header                                 │
│               │                                             │
│               │ Main Content                                │
│               │                                             │
│               │                                             │
└───────────────┴────────────────────────────────────────────┘
```

Komponen utama:

```text
<AppShell>
  <Sidebar />
  <Topbar />
  <MainContent />
</AppShell>
```

---

# 5. TOPBAR

Topbar menampilkan:

- nama aplikasi
- breadcrumb atau konteks halaman
- pencarian global jika tersedia
- notifikasi
- profil pengguna
- status akun bila diperlukan

Contoh:

```text
E-KANJOLI                         🔔  👤 Gepe
Bappeda & Litbang
```

Profile menu:

```text
Profil Saya
Pengaturan
Bantuan
Keluar
```

Jangan menampilkan tombol administrasi jika user tidak memiliki permission.

---

# 6. SIDEBAR

Sidebar bersifat permission-aware.

Contoh menu umum:

```text
Dashboard

PEKERJAAN
├── Tugas Saya
├── Disposisi
├── Instruksi
└── Monitoring

SURAT
├── Surat Masuk
├── Surat Keluar
└── Disposisi

PERJALANAN DINAS
├── Perjalanan Saya
├── Pengajuan
├── Persetujuan
└── Riwayat

DOKUMEN & ARSIP
├── Dokumen
└── Arsip

AGENDA
└── Agenda Kegiatan

LAYANAN PUBLIK
├── Layanan
├── Permohonan
└── Rekapitulasi

PERENCANAAN
├── RENJA
└── RKPD

PEKPPP
├── Evaluasi
├── Monitoring
└── Laporan

LAPORAN
├── Bulanan
└── Tahunan

ADMINISTRASI
├── Pegawai
├── Organisasi
├── Role & Permission
└── Audit Log
```

Menu harus berasal dari capability/permission configuration.

Jangan membuat sidebar berdasarkan:

```typescript
if (user.name === "...")
```

atau nama jabatan yang di-hard-code.

---

# 7. ROLE VS POSITION IN UI

UI harus membedakan:

```text
Application Role
```

dan:

```text
Organizational Position
```

Contoh profile:

```text
Nama:
Budi

Jabatan:
Kepala Bidang Perencanaan Ekonomi

Unit:
Bidang Perencanaan Ekonomi

Role:
pegawai
```

Role `pegawai` tidak berarti pengguna tidak mempunyai authority sebagai Kepala Bidang.

UI menggunakan effective permissions yang berasal dari backend.

---

# 8. USER DASHBOARD

Dashboard setiap pengguna menyesuaikan capability.

## 8.1 Pegawai

Fokus:

```text
Tugas Saya
Disposisi Saya
Deadline
Notifikasi
Agenda
Perjalanan Dinas
Dokumen Saya
```

Contoh kartu:

```text
Tugas Aktif       8
Jatuh Tempo       2
Terlambat         1
Disposisi         3
```

## 8.2 Kepala Sub Bagian

Tambahan:

```text
Tugas Bawahan
Monitoring Unit
Beban Kerja Unit
```

## 8.3 Kepala Bidang

Tambahan:

```text
Tugas Bidang
Kinerja Bidang
Beban Kerja Pegawai
Disposisi
Laporan Bidang
```

## 8.4 Sekretaris

Tambahan:

```text
Monitoring Sekretariat
Umum & Kepegawaian
Aset & Keuangan
Beban Kerja
Laporan
```

## 8.5 Kepala Badan

Dashboard pimpinan:

```text
┌────────────────────────────────────────────┐
│ Ringkasan Organisasi                       │
├────────┬────────┬────────┬────────────────┤
│ Tugas  │ Selesai│Terlambat│ Disposisi     │
├────────┴────────┴────────┴────────────────┤
│ Beban Kerja Pegawai                        │
├────────────────────────────────────────────┤
│ Kinerja per Bidang                         │
├────────────────────────────────────────────┤
│ Surat / Layanan / PEKPPP / Agenda          │
├────────────────────────────────────────────┤
│ Tren Bulanan / Tahunan                     │
└────────────────────────────────────────────┘
```

Semua angka harus dapat ditelusuri ke data sumber.

---

# 9. WORKLOAD UI

Beban kerja tidak boleh hanya ditampilkan sebagai satu angka tanpa penjelasan.

Tampilkan:

```text
Total Tugas
Aktif
Selesai
Terlambat
Disposisi
Layanan
Agenda
Perjalanan
```

Filter:

```text
Pegawai
Unit
Jabatan
Bulan
Tahun
Status
```

Gunakan visualisasi yang sederhana dan dapat dibaca.

---

# 10. PAGE HEADER

Setiap halaman standar:

```text
Breadcrumb

Judul Halaman
Deskripsi singkat

[Primary Action] [Secondary Action]
```

Contoh:

```text
Pekerjaan / Tugas

Tugas Saya
Daftar pekerjaan yang sedang menjadi tanggung jawab Anda.

[+ Buat Tugas] [Filter]
```

Primary action hanya muncul jika user memiliki permission.

---

# 11. DATA TABLE

Data table digunakan untuk data operasional.

Fitur standar:

```text
Search
Filter
Sort
Pagination
Column visibility
Export jika diizinkan
Row action
```

Kolom tidak boleh terlalu banyak secara default.

Prioritaskan:

```text
Nomor
Judul
Pemilik/Penanggung Jawab
Status
Tanggal
Deadline
Action
```

Detail lengkap berada pada halaman detail atau drawer.

---

# 12. FILTER STANDARD

Filter yang konsisten:

```text
Search
Status
Unit
Pegawai
Bulan
Tahun
Tanggal
```

Arsip minimal:

```text
Bulan
Tahun
```

Laporan minimal:

```text
Tahun
Bulan
Unit
```

Filter harus dapat di-reset.

---

# 13. FORM DESIGN

Semua form menggunakan pola:

```text
Label
Input
Helper text
Validation
Error
```

Contoh:

```text
Judul Tugas *
[________________________]

Prioritas *
[ Normal ▼ ]

Deadline *
[________________________]

Penanggung Jawab *
[________________________]
```

Required fields menggunakan indikator yang konsisten.

---

# 14. FORM SAFETY

Form untuk tindakan penting harus menyediakan:

```text
Save
Cancel
Confirmation
```

Tindakan destruktif:

```text
Delete
Cancel
Reject
Archive
```

harus menggunakan confirmation.

Contoh:

```text
Apakah Anda yakin ingin membatalkan tugas ini?

[ Kembali ] [ Batalkan Tugas ]
```

---

# 15. STATUS SYSTEM

Gunakan status semantik.

Contoh task:

```text
Draft
Assigned
Acknowledged
In Progress
Blocked
Submitted
Completed
Rejected
Cancelled
Closed
```

Status badge harus konsisten di seluruh modul.

Jangan menggunakan warna sebagai satu-satunya penanda status.

Contoh:

```text
[ TERLAMBAT ]
[ SELESAI ]
[ BERJALAN ]
```

---

# 16. TASK DETAIL

Halaman detail tugas:

```text
Task Number
Title
Description

Issuer
Assignee
Unit
Priority
Deadline

Status

Progress

Attachments

History
```

Timeline:

```text
08:10  Kepala Bidang membuat tugas
08:15  Budi menerima tugas
09:30  Budi mulai mengerjakan
13:20  Budi mengirim hasil
14:00  Kepala Bidang memverifikasi
```

History tidak boleh dapat diedit dari UI biasa.

---

# 17. DISPOSITION UI

Halaman disposition:

```text
Nomor Surat
Tanggal
Asal Surat
Perihal

Instruksi
Tujuan
Deadline

Status

Penerima
Progress
History
```

CTA:

```text
Terima
Mulai
Update Progress
Selesaikan
```

Action berdasarkan permission.

---

# 18. LETTER MANAGEMENT UI

## Surat Masuk

```text
Nomor Agenda
Nomor Surat
Tanggal
Asal
Perihal
Status
Disposisi
```

## Surat Keluar

```text
Nomor
Tanggal
Tujuan
Perihal
Status
Penandatangan
```

Detail surat harus menampilkan hubungan:

```text
Surat
  |
  +-- Disposisi
  |
  +-- Tugas
  |
  +-- Dokumen
  |
  +-- History
```

---

# 19. TRAVEL UI

## For Fungsional / Staff

Tampilkan:

```text
Perjalanan Saya
Riwayat Perjalanan
Perintah Perjalanan
Dokumen
```

Jangan tampilkan:

```text
+ Usulkan Perjalanan
```

jika user tidak memiliki `travel.propose`.

## For Authorized Proposer

Tampilkan:

```text
+ Usulkan Perjalanan
Pengajuan Saya
Menunggu Persetujuan
Riwayat
```

## For Approver

Tampilkan:

```text
Menunggu Persetujuan
Disetujui
Ditolak
```

---

# 20. PUBLIC SERVICE UI

Landing/service portal:

```text
Layanan Publik
├── Service Card
├── Description
├── Requirement
├── SLA
└── Ajukan Layanan
```

Service admin dashboard:

```text
Permohonan Baru
Diproses
Selesai
Terlambat
Rekap Bulanan
Rekap Tahunan
```

Admin hanya mengelola layanan yang ditugaskan.

---

# 21. DOCUMENT AND ARCHIVE UI

Document list:

```text
Search
Type
Category
Unit
Month
Year
Status
```

Archive page MUST support:

```text
Bulan
Tahun
```

Detail document:

```text
Metadata
Preview
Versions
Related Records
History
Archive Information
```

---

# 22. AGENDA UI

Calendar/list views:

```text
Hari
Minggu
Bulan
Agenda List
```

Agenda detail:

```text
Title
Date
Time
Location
Organizer
Participants
Description
Attachments
Result
History
```

---

# 23. NOTIFICATION CENTER

Notification icon:

```text
🔔
```

Badge shows unread count.

Notification categories:

```text
Tugas
Disposisi
Surat
Agenda
Perjalanan
Layanan
Deadline
System
```

Each notification links to the relevant record.

---

# 24. WHATSAPP STATUS UI

WhatsApp should be represented as delivery status, not as the primary record.

Example:

```text
Notification
✓ In-app
✓ WhatsApp delivered
```

or:

```text
Notification
✓ In-app
⚠ WhatsApp failed
```

Do not expose provider credentials.

---

# 25. REPORTING UI

Reports support:

```text
Monthly
Annual
```

Common report page:

```text
Period
Unit
Category

Summary
Chart
Table
Export
```

Every report should display:

```text
Periode
Tanggal generated
Source / context
```

---

# 26. AUDIT LOG UI

Only authorized users can view audit logs.

Columns:

```text
Timestamp
Actor
Action
Entity
Entity ID
```

Detail:

```text
Before
After
Actor
Timestamp
```

Audit logs are read-only.

---

# 27. ADMIN UI

Admin sections:

```text
Employees
Organizations
Positions
Roles
Permissions
Service Administrators
System Settings
Audit Logs
```

Dangerous actions require elevated permission.

Superadmin technical access does not automatically grant business approval authority.

---

# 28. EMPLOYEE MANAGEMENT UI

Employee detail:

```text
Personal Information
Employment Information
Position
Organizational Unit
Supervisor
Account Status
Application Roles
Permissions
Activity
```

Account status:

```text
Active
Inactive
```

Deactivation should preserve historical records.

---

# 29. PROFILE UI

Profile page:

```text
Avatar
Name
NIP
Position
Unit
Role
Email
WhatsApp
```

Do not allow users to change:

```text
Role
Position
Unit
Supervisor
```

unless the user has explicit administrative permission.

---

# 30. RESPONSIVE DESIGN

Breakpoints should support:

```text
Mobile
Tablet
Desktop
Large Desktop
```

Mobile priorities:

```text
Content first
Actions accessible
Tables scroll horizontally
Sidebar becomes drawer
```

Desktop:

```text
Persistent sidebar
Wide data tables
Dashboard grids
```

---

# 31. COMPONENT ARCHITECTURE

Recommended React structure:

```text
src/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── forms/
│   ├── tables/
│   ├── feedback/
│   └── charts/
│
├── pages/
│   ├── auth/
│   ├── dashboard/
│   ├── tasks/
│   ├── dispositions/
│   ├── letters/
│   ├── travel/
│   ├── documents/
│   ├── agendas/
│   ├── services/
│   ├── pekppp/
│   ├── reports/
│   └── admin/
│
├── lib/
│   ├── supabase.ts
│   ├── auth/
│   ├── permissions/
│   └── utils/
│
├── config/
│   ├── navigation.ts
│   ├── permissions.ts
│   └── routes.ts
│
└── types/
```

---

# 32. ROUTING

Protected routes must require authentication.

Concept:

```text
/public
/login

/app
/app/dashboard
/app/tasks
/app/dispositions
/app/letters
/app/travel
/app/documents
/app/agenda
/app/services
/app/reports
/app/admin
```

Do not rely on frontend route protection alone.

Backend/RLS remains authoritative.

---

# 33. AUTH FLOW UI

Login:

```text
E-KANJOLI

Email
Password

[Masuk]

Lupa password?
```

After authentication:

```text
Auth user
   |
   v
Load profile
   |
   v
Load employee
   |
   v
Load roles/permissions
   |
   v
Load navigation
   |
   v
Dashboard
```

If profile is incomplete:

```text
Account not fully provisioned.
Please contact administrator.
```

Do not silently create authorization from frontend defaults.

---

# 34. LOADING STATES

Every asynchronous page must have loading state.

Examples:

```text
Skeleton
Spinner for short actions
Progress for uploads
```

Avoid blank screens.

---

# 35. EMPTY STATES

Example:

```text
Belum ada tugas

Tidak ada pekerjaan yang sedang ditugaskan kepada Anda.

[ Kembali ke Dashboard ]
```

Empty state should explain what happened and what action is possible.

---

# 36. ERROR STATES

Errors must be understandable.

Avoid:

```text
Error 403
```

Prefer:

```text
Anda tidak memiliki akses untuk melakukan tindakan ini.
```

For system errors:

```text
Terjadi kesalahan saat memuat data.
Silakan coba lagi.
```

Never expose:

- SQL errors
- service-role credentials
- stack traces
- internal tokens

---

# 37. TOAST

Use toast for short feedback:

```text
Berhasil disimpan.
Tugas berhasil diberikan.
Dokumen berhasil diunggah.
```

Do not use toast for critical confirmation that needs user action.

---

# 38. MODAL

Use modal for:

```text
confirmation
short form
quick preview
```

Use full page for complex workflows.

Do not place a long multi-step government workflow inside a tiny modal.

---

# 39. SEARCH

Global search may cover:

```text
Surat
Tugas
Disposisi
Dokumen
Pegawai
Layanan
Agenda
```

Search result must respect RLS.

Search must never reveal records the user cannot access.

---

# 40. EXPORT

Export buttons are permission-aware.

Examples:

```text
Export Excel
Export PDF
Print
```

Export action must respect the same data scope as screen access.

---

# 41. DATA VISUALIZATION

Charts should answer a question.

Examples:

```text
Beban kerja per bidang
Tren tugas bulanan
Layanan selesai per bulan
Surat masuk per bulan
```

Avoid decorative charts.

Each chart should have:

```text
Title
Period
Legend if needed
Readable labels
Accessible table alternative where appropriate
```

---

# 42. DESIGN TOKENS

Use centralized design tokens.

Conceptual categories:

```text
color
spacing
radius
shadow
typography
breakpoint
z-index
```

Do not scatter arbitrary values throughout components.

Example conceptual spacing:

```text
xs
sm
md
lg
xl
2xl
```

---

# 43. TYPOGRAPHY

Typography must prioritize readability.

Recommended hierarchy:

```text
Display
H1
H2
H3
Body
Small
Caption
```

Government records should use readable body text and avoid overly stylized fonts.

---

# 44. ICONOGRAPHY

Use one consistent icon library.

The current project uses:

```text
lucide-react
```

Icons should communicate meaning.

Important actions should include text labels.

Bad:

```text
[ icon ]
```

Preferred:

```text
[ icon + Simpan ]
```

---

# 45. COLOR SEMANTICS

Colors are semantic, not decorative.

Concept:

```text
Primary
Neutral
Success
Warning
Danger
Info
```

Do not encode business meaning only through color.

Example:

```text
Danger + "Terlambat"
Success + "Selesai"
Warning + "Menunggu"
```

---

# 46. TABLET/MOBILE TABLES

On small screens:

```text
horizontal scroll
priority columns
row detail
card transformation when appropriate
```

Never make 12-column tables unreadable on mobile.

---

# 47. SECURITY UX

Security-sensitive actions should communicate:

```text
why action is unavailable
who can perform it
```

Example:

```text
Pengajuan perjalanan dinas

Fitur pengajuan mandiri tidak tersedia untuk jabatan Anda.
Anda tetap dapat menjalankan perjalanan dinas apabila menerima
perintah perjalanan yang sah.
```

This is better than simply hiding every explanation.

However, hidden actions must still be enforced by backend authorization.

---

# 48. ORGANIZATIONAL UX

When displaying employee assignments, show:

```text
Employee
Position
Unit
Supervisor
```

Example:

```text
Ahmad
Fungsional
Bidang Perencanaan Ekonomi
Atasan: Kepala Bidang Perencanaan Ekonomi
```

This helps users understand why a task is assigned and how escalation works.

---

# 49. WORKFLOW TIMELINE COMPONENT

A reusable component should support:

```text
actor
action
timestamp
status
notes
```

Example:

```text
● 14:20
  Budi — menyelesaikan tugas

● 13:10
  Budi — mengunggah dokumen

● 09:00
  Kepala Bidang — memberikan tugas
```

Use the same component for:

```text
Task
Disposition
Letter
Travel
Service
Agenda
Document
```

---

# 50. RELATIONSHIP UI

Where appropriate, records should link to related records.

Example:

```text
Surat Masuk
   ↓
Disposisi
   ↓
Tugas
   ↓
Dokumen Hasil
   ↓
Laporan
```

Users should be able to navigate the chain without losing context.

---

# 51. REPORT PERIOD SELECTOR

Create reusable component:

```text
<PeriodSelector />
```

Capabilities:

```text
Month
Year
Custom Date Range
```

Default:

```text
Current month
Current year
```

depending on page context.

---

# 52. PERMISSION-AWARE COMPONENTS

Recommended abstractions:

```tsx
<Can permission="task.create">
  ...
</Can>
```

or:

```tsx
<PermissionGate permission="travel.propose">
  ...
</PermissionGate>
```

But this is UX only.

It MUST NOT replace RLS.

---

# 53. FEATURE FLAGS / CONFIGURATION

Modules may be enabled/disabled through configuration.

Avoid:

```tsx
if (true) {
  showModule()
}
```

Prefer centralized configuration.

This supports future expansion.

---

# 54. NO BUSINESS LOGIC IN PRESENTATIONAL COMPONENTS

Bad:

```text
Button decides who can approve.
```

Preferred:

```text
Authorization service determines capability.
Button only renders capability.
```

---

# 55. DATA FETCHING

Pages should use service/data hooks rather than embedding Supabase queries everywhere.

Concept:

```text
Page
  |
  v
Feature Hook
  |
  v
Data Service
  |
  v
Supabase
```

This keeps components maintainable.

---

# 56. FORM VALIDATION

Client validation improves UX.

Server/database validation protects integrity.

Both are required.

Example:

```text
Client:
required field

Database:
NOT NULL
CHECK
FOREIGN KEY
UNIQUE
RLS
```

Never assume client validation is security.

---

# 57. FILE UPLOAD UX

Upload should show:

```text
filename
size
type
progress
status
```

Validate:

```text
allowed type
allowed size
authorization
```

Storage access must follow the same authorization model as records.

---

# 58. PRINT AND OFFICIAL DOCUMENT UX

Official print layouts should be separate from normal screen UI.

Print views should support:

```text
institution header
document number
date
signatory
content
attachments where required
```

Avoid printing navigation/sidebar.

---

# 59. PERFORMANCE

UI should avoid unnecessary:

```text
full-page reloads
duplicate queries
large unpaginated tables
unnecessary chart rendering
```

Use:

```text
pagination
lazy loading
query filters
memoization where justified
```

Do not optimize prematurely at the cost of maintainability.

---

# 60. INTERNATIONALIZATION

Primary language:

```text
Bahasa Indonesia
```

Code should avoid scattering user-facing strings throughout logic.

Future i18n should remain possible.

---

# 61. AUDITABLE UI ACTIONS

Important actions must produce backend audit events.

Examples:

```text
Create
Assign
Approve
Reject
Complete
Archive
Export
Role change
Employee deactivation
```

The UI should not fabricate audit history.

---

# 62. UI DEVELOPMENT RULES

Every new page must answer:

1. Who can access it?
2. What data can they see?
3. What actions can they perform?
4. What records can they modify?
5. What history is displayed?
6. What notifications are triggered?
7. What report is generated?
8. What happens on mobile?
9. What happens when permission is denied?
10. What happens when the database returns an error?

---

# 63. PAGE IMPLEMENTATION CHECKLIST

Before considering a page complete:

```text
[ ] Authenticated route
[ ] Correct permission
[ ] RLS-compatible data access
[ ] Loading state
[ ] Empty state
[ ] Error state
[ ] Success feedback
[ ] Responsive
[ ] Accessible
[ ] Search/filter if applicable
[ ] Pagination if applicable
[ ] Audit action where required
[ ] History where required
[ ] Related records
[ ] Report/export permission
```

---

# 64. INITIAL PAGE MAP

React implementation should progressively create:

```text
AUTH
├── Login
├── Forgot Password
└── Account Status

DASHBOARD
├── Employee Dashboard
├── Unit Dashboard
└── Leadership Dashboard

WORK
├── My Tasks
├── Task Detail
├── Task Management
├── Disposition
└── Workload

LETTERS
├── Incoming
├── Incoming Detail
├── Outgoing
├── Outgoing Detail
└── Disposition

TRAVEL
├── My Travel
├── Proposal
├── Approval
├── Travel Detail
└── History

DOCUMENTS
├── Documents
├── Document Detail
└── Archive

AGENDA
├── Calendar
├── Agenda List
└── Agenda Detail

SERVICES
├── Public Services
├── Service Detail
├── Requests
├── Request Detail
└── Service Reports

PLANNING
├── RENJA
└── RKPD

PEKPPP
├── Evaluation
├── Monitoring
└── Reports

REPORTS
├── Monthly
├── Annual
└── Dashboard

ADMIN
├── Employees
├── Organization
├── Positions
├── Roles
├── Permissions
└── Audit
```

---

# 65. IMPLEMENTATION ORDER

Do not build all screens simultaneously.

Recommended sequence:

```text
1. Authentication
2. App Shell
3. Profile / Employee context
4. Permission-aware navigation
5. Dashboard
6. Task
7. Disposition
8. Letters
9. Documents / Archive
10. Travel
11. Agenda
12. Public Services
13. Planning
14. PEKPPP
15. Reporting
16. Administration
17. WhatsApp integration UI/status
```

The first milestone is:

```text
Login
  ↓
Authenticated Employee
  ↓
Correct Dashboard
  ↓
Correct Navigation
  ↓
RLS-protected Data
```

---

# 66. DEFINITION OF DONE — UI

A feature is not complete merely because the screen looks correct.

Definition of Done:

```text
UI implemented
+
Route protected
+
Permission evaluated
+
RLS tested
+
Loading state
+
Error state
+
Empty state
+
Responsive
+
Accessible
+
Audit requirements identified
+
Workflow connected
+
Documentation aligned
```

---

# 67. FINAL UI/UX PRINCIPLE

E-KANJOLI must feel like one integrated government platform, not a collection of unrelated CRUD pages.

The interface should make the organizational workflow visible:

```text
PEGAWAI
   ↓
PERINTAH
   ↓
TUGAS
   ↓
PELAKSANAAN
   ↓
BUKTI
   ↓
VERIFIKASI
   ↓
SELESAI
   ↓
HISTORY
   ↓
LAPORAN
```

For leadership:

```text
AKTIVITAS
   ↓
MONITORING
   ↓
BEBAN KERJA
   ↓
KINERJA
   ↓
LAPORAN
   ↓
KEPUTUSAN
```

For public services:

```text
PERMOHONAN
   ↓
VERIFIKASI
   ↓
PROSES
   ↓
SELESAI
   ↓
PELAPORAN
```

The UI must make these flows understandable while keeping authorization and data integrity enforced by the backend.

---

# 68. VERSION BASELINE

This document establishes:

> **E-KANJOLI UI/UX Design System v1.2**

It is the primary UI reference for React development and must remain synchronized with:

```text
03_DATABASE_SCHEMA.md
04_RBAC_AND_SECURITY.md
05_WORKFLOW.md
```

When business rules change, this document must be reviewed before modifying affected screens.
