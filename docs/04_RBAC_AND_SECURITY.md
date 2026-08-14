# E-KANJOLI — RBAC AND SECURITY

> Status: APPROVED BASELINE  
> Version: 1.0  
> Last Updated: 2026-08-14  
> Institution: Bappeda & Litbang Kabupaten Banggai Kepulauan  
> Related Documents:
> - `00_PROJECT_CHARTER.md`
> - `01_PRD.md`
> - `02_SYSTEM_ARCHITECTURE.md`
> - `03_DATABASE_SCHEMA.md`

---

# 1. TUJUAN

Dokumen ini menetapkan aturan **Role-Based Access Control (RBAC)**, authorization, keamanan aplikasi, keamanan database, keamanan storage, auditability, dan prinsip least privilege untuk E-KANJOLI.

Semua implementasi aplikasi harus mengikuti dokumen ini.

AI coding agent **tidak boleh mengubah aturan akses, role, permission, RLS, atau alur approval bisnis secara sepihak**.

Jika kebutuhan baru bertentangan dengan dokumen ini, perubahan harus dilakukan melalui perubahan PRD/dokumen baseline terlebih dahulu.

---

# 2. PRINSIP KEAMANAN

E-KANJOLI menggunakan prinsip:

1. Secure by Design
2. Defense in Depth
3. Least Privilege
4. Role-Based Access Control
5. Database-Level Authorization
6. Separation of Duties
7. Explicit Permission
8. Fail Closed
9. Auditability
10. Traceability
11. Data Integrity
12. Secure File Access
13. Secure Session Management
14. Input Validation
15. Output Encoding
16. No Trust in Client-Side Authorization

---

# 3. ROLE RESMI

Role resmi sistem:

```text
superadmin
admin_pekppp
admin_perencanaan
admin_litbang
admin_sekretariat
pimpinan
```

Portal publik tidak menggunakan role internal.

Public user hanya dapat mengakses fungsi publik yang memang disediakan tanpa memperoleh akses ke dashboard internal.

---

# 4. DEFINISI ROLE

## 4.1 superadmin

Administrator sistem.

Tanggung jawab:

- Manajemen user
- Manajemen role
- Konfigurasi sistem
- Konfigurasi master data
- Monitoring audit log
- Administrasi storage
- Backup dan recovery
- Konfigurasi keamanan teknis

Batasan:

- Tidak boleh mengubah data bisnis tanpa kebutuhan administratif.
- Setiap tindakan sensitif harus tercatat pada audit log.

---

## 4.2 admin_pekppp

Tim evaluator internal PEKPPP.

Tanggung jawab:

- Kuesioner evaluasi PEKPPP
- Form F01
- Aspek evaluasi
- Bukti dukung
- Verifikasi data evaluasi
- Persiapan data evaluasi eksternal

Tidak memiliki akses administratif terhadap modul umum kantor kecuali permission khusus yang diberikan.

---

## 4.3 admin_perencanaan

Admin Bidang Perencanaan.

Mengelola:

1. Permohonan data dan informasi pembangunan daerah
2. Asistensi/fasilitasi Renstra/Renja
3. Asistensi e-Monev
4. Musrenbang RKPD/RPJMD
5. Pokir DPRD
6. Dokumen perencanaan yang menjadi kewenangannya

---

## 4.4 admin_litbang

Admin Bidang Litbang.

Mengelola:

1. Rekomendasi/izin penelitian daerah
2. Fasilitasi inovasi dan kelitbangan
3. TJSLP/CSR
4. Pengkajian, pengembangan dan penerapan teknologi daerah
5. Dokumen kelitbangan yang menjadi kewenangannya

---

## 4.5 admin_sekretariat

Admin Sekretariat.

Mengelola:

- Surat masuk
- Surat keluar
- Registrasi surat
- e-Disposisi
- Perjalanan dinas
- SPT
- SPPD
- Laporan perjalanan
- Daftar aset
- Arsip dokumen
- RENJA
- RKPD
- Administrasi sekretariat
- Layanan PPID/Pengaduan
- Notifikasi administrasi

---

## 4.6 pimpinan

Pimpinan/pejabat yang berwenang.

Default access:

- Read-only dashboard
- Monitoring seluruh bidang
- Monitoring layanan
- Monitoring surat
- Monitoring disposisi
- Monitoring perjalanan dinas
- Monitoring aset
- Monitoring PEKPPP
- Monitoring kinerja

Action khusus:

- Approval yang secara bisnis memang membutuhkan persetujuan pimpinan
- Memberikan keputusan/approval
- Ekspor laporan

Pimpinan tidak memperoleh hak konfigurasi sistem.

---

# 5. ACCESS MODEL

Model authorization:

```text
User
  ↓
Authenticated Session
  ↓
User Role
  ↓
Permission
  ↓
Resource
  ↓
Action
  ↓
Database RLS / Server Authorization
```

Client-side route guard hanya berfungsi sebagai UX.

**Security enforcement wajib berada di server/database.**

---

# 6. ACTION MODEL

Action standar:

```text
view
list
create
update
delete
submit
verify
approve
reject
assign
disposition
upload
download
export
archive
restore
manage
configure
```

Tidak semua role memperoleh seluruh action.

---

# 7. PERMISSION MATRIX UTAMA

| Modul | Superadmin | Sekretariat | Perencanaan | Litbang | PEKPPP | Pimpinan |
|---|---|---|---|---|---|---|
| User Management | CRUD | - | - | - | - | - |
| System Config | CRUD | - | - | - | - | - |
| Surat Masuk | Admin | CRUD | View terkait | View terkait | - | View/Approve |
| Surat Keluar | Admin | CRUD | View terkait | View terkait | - | View/Approve |
| e-Disposisi | Admin | CRUD/Assign | Receive/Process | Receive/Process | - | Approve/View |
| Perjalanan Dinas | Admin | CRUD | View terkait | View terkait | - | Approve/View |
| Aset | Admin | CRUD | View | View | - | View |
| Arsip | Admin | CRUD | Manage bidang | Manage bidang | View bukti | View |
| RENJA | Admin | Manage | CRUD bidang | View | - | View |
| RKPD | Admin | Manage | CRUD bidang | View | - | View |
| Layanan Publik | Admin | PPID | CRUD bidang | CRUD bidang | - | View/Approve |
| PEKPPP | Admin | - | - | - | CRUD | View |
| Dashboard | Full | Sekretariat | Bidang | Bidang | PEKPPP | Full |
| Audit Log | Full | View terbatas | View terbatas | View terbatas | View terkait | View |
| Reporting | Full | Create | Create | Create | Create | Export/Full |

Keterangan:

- `CRUD` = create, read, update, delete sesuai batas modul
- `View` = read-only
- `View terkait` = hanya data yang relevan dengan kewenangan
- `Full` = sesuai otorisasi administratif
- `-` = tidak memiliki akses

---

# 8. FIELD-LEVEL AND DATA-SCOPE SECURITY

Selain role, beberapa data harus dibatasi berdasarkan scope.

Contoh:

```text
admin_perencanaan
    → hanya permohonan layanan bidang perencanaan

admin_litbang
    → hanya permohonan layanan bidang litbang

admin_sekretariat
    → administrasi sekretariat + PPID

admin_pekppp
    → data PEKPPP

pimpinan
    → lintas bidang dalam mode monitoring
```

Jangan memberikan seluruh tabel kepada role hanya karena role tersebut dapat membuka modul tertentu.

---

# 9. SUPABASE ROW LEVEL SECURITY

Semua tabel yang mengandung data sensitif atau internal wajib menggunakan RLS.

Minimal:

```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

Policy harus menggunakan identitas user yang telah terautentikasi.

Jangan mengandalkan:

```text
localStorage.role
React state
hidden menu
URL protection
frontend condition
```

sebagai security boundary.

---

# 10. ROLE HELPER

Direkomendasikan memiliki helper database/server untuk membaca role user.

Contoh konseptual:

```sql
auth_user_role()
```

atau mekanisme equivalent yang aman.

Implementasi final harus menghindari recursion pada RLS.

---

# 11. SUPERADMIN SECURITY

Superadmin adalah role paling sensitif.

Akses:

- User management
- Role assignment
- Configuration
- Audit
- Storage administration
- System maintenance

Ketentuan:

1. Tidak boleh ada privilege escalation melalui frontend.
2. Role tidak boleh dapat diubah oleh user biasa.
3. Perubahan role harus tercatat.
4. Penghapusan user harus aman terhadap data historis.
5. User terakhir dengan akses administratif tidak boleh terhapus secara tidak sengaja.
6. Sensitive actions wajib masuk audit log.

---

# 12. USER MANAGEMENT

Superadmin dapat:

- Membuat user
- Mengaktifkan user
- Menonaktifkan user
- Mengubah role
- Mengubah metadata yang diizinkan

Sistem harus mempertahankan:

```text
created_by
updated_by
created_at
updated_at
```

Jika user dinonaktifkan, histori transaksi tetap dipertahankan.

Jangan melakukan hard delete terhadap user yang memiliki histori bisnis kecuali ada prosedur khusus.

---

# 13. AUTHENTICATION

Authentication menggunakan Supabase Auth atau mekanisme resmi yang disepakati arsitektur.

Minimal:

- Email/password atau identity provider resmi
- Session management
- Logout
- Password reset
- Account activation
- Account deactivation

Jangan menyimpan password sendiri di tabel aplikasi.

---

# 14. AUTHORIZATION

Authorization harus diverifikasi pada:

1. Route
2. API/server action
3. Database/RLS
4. Storage policy

Route protection hanya lapisan tambahan.

Contoh:

```text
User membuka /admin/perencanaan
        ↓
Route guard
        ↓
Server authorization
        ↓
Database RLS
        ↓
Data
```

---

# 15. PUBLIC PORTAL SECURITY

Portal publik boleh:

- Melihat katalog layanan
- Mengirim permohonan
- Melacak tiket
- Melihat informasi publik

Portal publik tidak boleh:

- Membaca tabel internal
- Membaca audit log
- Membaca surat internal
- Membaca disposisi
- Membaca data user
- Mengakses storage internal
- Mengakses data PEKPPP
- Mengakses dashboard pimpinan

Tracking tiket harus membatasi informasi berdasarkan token/ticket credential yang sesuai.

---

# 16. SERVICE REQUEST SECURITY

Nomor tiket bukan satu-satunya rahasia.

Jika tracking publik membutuhkan informasi pribadi, sistem sebaiknya menggunakan:

```text
ticket_number + verification token
```

atau mekanisme verifikasi lain.

Jangan menampilkan:

- detail internal
- catatan disposisi internal
- data pegawai
- dokumen rahasia
- komentar internal

kepada pemohon publik.

---

# 17. SURAT MASUK SECURITY

Surat masuk memiliki informasi administratif dan dokumen yang dapat bersifat internal.

Access:

```text
admin_sekretariat
    → create/read/update/register

pimpinan
    → view/approval sesuai workflow

bidang tujuan
    → hanya surat yang didisposisikan/ditujukan

superadmin
    → administrative access

public
    → none
```

Dokumen surat tidak boleh menjadi public bucket.

---

# 18. SURAT KELUAR SECURITY

Surat keluar harus mendukung workflow:

```text
Draft
  ↓
Review
  ↓
Approval
  ↓
Nomor Surat
  ↓
Final
  ↓
Arsip
```

Dokumen final harus memiliki histori perubahan.

Setelah surat final diterbitkan, perubahan terhadap dokumen final harus dibatasi.

---

# 19. e-DISPOSISI SECURITY

Disposisi merupakan data internal.

Informasi disposisi minimal:

```text
surat
pemberi disposisi
penerima disposisi
instruksi
deadline
status
waktu
```

Hanya pihak terkait yang boleh membaca instruksi disposisi.

Admin sekretariat tidak boleh mengubah keputusan pimpinan tanpa permission khusus.

---

# 20. PERJALANAN DINAS SECURITY

Data perjalanan dinas mencakup:

- SPT
- SPPD
- Pegawai
- tujuan
- tanggal
- laporan

Workflow:

```text
Draft
→ Review
→ Approval
→ Issued
→ Completed
→ Reported
→ Archived
```

Approval harus tercatat.

---

# 21. ASSET SECURITY

Data aset hanya boleh diubah oleh role yang memiliki kewenangan.

Audit perubahan harus menyimpan:

```text
asset_id
old_value
new_value
changed_by
changed_at
reason
```

Jika aset dinyatakan dihapus/dipindahtangankan, gunakan status/soft-delete bila diperlukan untuk menjaga histori.

---

# 22. DOCUMENT MANAGEMENT SECURITY

Dokumen diklasifikasikan minimal:

```text
PUBLIC
INTERNAL
RESTRICTED
CONFIDENTIAL
```

Setiap dokumen harus memiliki access scope.

Contoh:

```text
document.visibility
document.owner_unit
document.related_module
document.access_scope
```

Jangan menyimpan dokumen sensitif pada public storage bucket.

---

# 23. STORAGE SECURITY

Gunakan private bucket untuk dokumen internal.

Akses file menggunakan signed URL atau mekanisme authorization yang setara.

Jangan:

- Menaruh credential di frontend
- Membuat bucket internal menjadi public
- Membuat service role key tersedia di browser
- Menyimpan secret dalam Git

---

# 24. ENVIRONMENT VARIABLES

Contoh:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Secret server-side tidak boleh diberi prefix `VITE_`.

Jangan commit:

```text
.env
.env.local
.env.production
service_role_key
private_key
credentials
```

Gunakan:

```text
.env.example
```

untuk dokumentasi konfigurasi.

---

# 25. SERVICE ROLE KEY

Supabase service role key:

- hanya server-side
- tidak boleh dikirim ke browser
- tidak boleh masuk Git
- tidak boleh ditampilkan pada log
- tidak boleh disimpan pada source code

---

# 26. AUDIT LOG

Action sensitif wajib diaudit.

Minimal:

```text
id
actor_user_id
actor_role
action
module
resource_type
resource_id
old_data
new_data
ip_address
user_agent
created_at
```

Audit log harus append-oriented.

User biasa tidak boleh menghapus audit log.

---

# 27. ACTION YANG WAJIB DIAUDIT

Minimal:

- Login
- Logout
- Failed login
- User creation
- User role change
- User deactivation
- Permission change
- Data creation
- Data update
- Data deletion
- Approval
- Rejection
- Disposition
- Document upload
- Document deletion
- Document download untuk dokumen sensitif
- Export
- Configuration change

---

# 28. SEPARATION OF DUTIES

Untuk proses penting:

```text
Creator ≠ Approver
```

Contoh:

Admin membuat draft surat.

Pihak berwenang melakukan approval.

Admin tidak boleh secara otomatis memberikan approval atas nama pimpinan.

Konfigurasi final harus mengikuti kewenangan organisasi.

---

# 29. APPROVAL SECURITY

Approval harus menyimpan:

```text
approved_by
approved_at
approval_status
approval_note
```

Approval tidak boleh hanya direpresentasikan oleh:

```text
status = APPROVED
```

tanpa identitas aktor.

---

# 30. STATUS TRANSITION SECURITY

Status harus memiliki transition rules.

Contoh:

```text
DRAFT → SUBMITTED
SUBMITTED → REVIEW
REVIEW → APPROVED
REVIEW → REJECTED
APPROVED → COMPLETED
COMPLETED → ARCHIVED
```

Jangan mengizinkan frontend mengubah status ke nilai apa pun tanpa validasi server.

---

# 31. FILE UPLOAD SECURITY

Upload harus memvalidasi:

- MIME type
- extension
- file size
- filename
- storage path
- authorization

Gunakan filename yang aman dan unik.

Jangan mempercayai filename dari user.

---

# 32. INPUT VALIDATION

Semua input harus divalidasi.

Validasi:

```text
required fields
format
length
enum
UUID
date
email
phone
file
numeric ranges
```

Gunakan schema validation pada server.

---

# 33. XSS / INJECTION

Semua data user dianggap tidak terpercaya.

Perlindungan wajib terhadap:

- XSS
- SQL injection
- HTML injection
- command injection
- path traversal
- malicious file upload

Gunakan parameterized query dan library resmi.

Jangan membuat SQL melalui string concatenation dari input user.

---

# 34. CSRF / SESSION

Gunakan mekanisme session dan cookie/token yang aman sesuai arsitektur.

Jangan membuat authentication sendiri.

Logout harus membatalkan session sesuai mekanisme provider.

---

# 35. ERROR HANDLING

Error yang ditampilkan ke publik tidak boleh membocorkan:

- SQL
- stack trace
- secret
- internal path
- database structure
- token
- credential

Detail error hanya boleh tersedia pada server log yang aman.

---

# 36. LOGGING

Log aplikasi harus menghindari:

- password
- access token
- refresh token
- service role key
- secret
- dokumen sensitif
- data pribadi yang tidak diperlukan

---

# 37. RATE LIMITING

Endpoint publik yang berisiko disalahgunakan harus memiliki rate limiting.

Minimal:

- login
- password reset
- public ticket lookup
- public service submission
- upload
- notification endpoint

---

# 38. DATA PRIVACY

Data pemohon harus diperlakukan sebagai data terbatas sesuai kebutuhan layanan.

Jangan menampilkan nomor telepon/email lengkap pada dashboard publik.

Dashboard publik hanya menampilkan informasi yang memang bersifat publik.

---

# 39. EXPORT SECURITY

Export hanya tersedia bagi role yang memiliki permission.

Export harus dicatat:

```text
exported_by
export_type
module
filter
timestamp
```

Jika mengandung data sensitif, file export harus diperlakukan sebagai private document.

---

# 40. NOTIFICATION SECURITY

Notifikasi tidak boleh membocorkan data sensitif.

Contoh aman:

```text
Ada surat baru yang memerlukan perhatian Anda.
```

Bukan:

```text
Surat rahasia Nomor X dari Y tentang Z telah masuk...
```

jika channel notifikasi tidak aman.

---

# 41. EMAIL SECURITY

Email harus dianggap sebagai channel dengan risiko kebocoran.

Dokumen sensitif sebaiknya tidak otomatis dikirim sebagai attachment tanpa authorization dan kebijakan yang jelas.

---

# 42. API SECURITY

Setiap API/server action harus:

1. Authenticate
2. Authorize
3. Validate input
4. Execute business rule
5. Persist transaction
6. Audit sensitive action
7. Return sanitized response

---

# 43. TRANSACTION INTEGRITY

Operasi multi-tabel yang harus konsisten harus menggunakan transaction atau mekanisme atomic equivalent.

Contoh:

```text
Create surat
+
Create nomor/register
+
Create audit log
```

harus dipastikan tidak meninggalkan data setengah jadi.

---

# 44. SOFT DELETE

Untuk data yang memiliki nilai historis, gunakan soft delete/status bila sesuai.

Contoh:

```text
deleted_at
deleted_by
is_active
status
```

Hard delete hanya digunakan jika memang aman dan diperlukan.

---

# 45. BACKUP AND RECOVERY

Database dan dokumen penting harus memiliki strategi backup.

Minimal dokumentasikan:

- Backup frequency
- Retention
- Recovery procedure
- Restore testing
- Responsibility

Backup tidak menggantikan audit log.

---

# 46. SECURITY CHECKLIST SEBELUM RELEASE

Sebelum production:

```text
[ ] RLS enabled
[ ] RLS policies tested
[ ] Role access tested
[ ] Public access tested
[ ] Storage policies tested
[ ] Secret scan
[ ] .env excluded
[ ] Service key not exposed
[ ] Upload validation tested
[ ] Authorization tested
[ ] Audit log tested
[ ] Approval workflow tested
[ ] Export permission tested
[ ] Error leakage tested
[ ] Rate limiting reviewed
[ ] Backup verified
```

---

# 47. AI CODING AGENT SECURITY RULES

AI coding agent wajib:

1. Membaca `00_PROJECT_CHARTER.md` sampai dokumen security sebelum mengubah arsitektur.
2. Tidak mengubah role resmi.
3. Tidak membuat role baru tanpa persetujuan.
4. Tidak menonaktifkan RLS untuk mempermudah development.
5. Tidak menggunakan service role key di frontend.
6. Tidak membuat storage bucket sensitif menjadi public.
7. Tidak menghapus audit logging untuk mempercepat implementasi.
8. Tidak bypass authorization.
9. Tidak mengubah approval rules secara sepihak.
10. Tidak membuat admin universal.
11. Tidak hardcode privilege pada UI sebagai satu-satunya security.
12. Tidak menghapus data produksi untuk debugging.
13. Tidak memasukkan secret ke Git.
14. Tidak mengubah schema production tanpa migration.
15. Tidak mengubah business rules yang bertentangan dengan PRD.

---

# 48. DEVELOPMENT MODE

Development environment boleh memiliki seed data.

Namun:

```text
development credentials ≠ production credentials
development database ≠ production database
```

Jangan menggunakan data pribadi/rahasia produksi sebagai seed tanpa prosedur yang sah.

---

# 49. TESTING RBAC

Minimal test matrix:

```text
superadmin
admin_pekppp
admin_perencanaan
admin_litbang
admin_sekretariat
pimpinan
public
```

Setiap role diuji terhadap:

```text
view
create
update
delete
approve
download
export
```

Untuk setiap modul yang relevan.

---

# 50. NEGATIVE AUTHORIZATION TEST

Security test tidak hanya menguji:

```text
role boleh → berhasil
```

tetapi juga:

```text
role tidak boleh → ditolak
```

Contoh:

```text
admin_litbang mencoba membaca surat internal
→ DENIED

admin_perencanaan mencoba mengubah PEKPPP
→ DENIED

public mencoba membaca disposisi
→ DENIED

pimpinan mencoba mengubah role user
→ DENIED
```

---

# 51. FRONTEND SECURITY

Frontend boleh menyembunyikan menu berdasarkan role untuk UX.

Namun:

```text
hidden menu ≠ authorization
```

Jika user memanggil endpoint secara langsung, backend/database tetap harus menolak akses yang tidak sah.

---

# 52. SECURITY BOUNDARY

Security boundary resmi:

```text
Browser
   ↓
Application
   ↓
Server/API
   ↓
Supabase Auth
   ↓
RLS
   ↓
Database / Storage
```

Database dan storage policy harus menjadi lapisan terakhir.

---

# 53. DEFAULT DENY

Default behavior:

```text
No permission
    ↓
DENY
```

Permission harus diberikan secara eksplisit.

Jangan menggunakan:

```text
if admin then allow everything
```

kecuali benar-benar merupakan permission superadmin yang sudah ditentukan.

---

# 54. CHANGE CONTROL

Perubahan terhadap:

- Role
- Permission
- RLS
- Approval
- Security policy
- Data classification
- Storage access
- Authentication

harus:

1. Didokumentasikan
2. Direview
3. Diimplementasikan
4. Diuji
5. Di-commit
6. Dicatat dalam changelog bila relevan

---

# 55. DEFINITION OF DONE — SECURITY

Fitur dianggap selesai apabila:

```text
[ ] Requirement sesuai PRD
[ ] Role sudah ditentukan
[ ] Permission sudah ditentukan
[ ] Server authorization tersedia
[ ] RLS tersedia
[ ] Storage policy tersedia jika diperlukan
[ ] Input validation tersedia
[ ] Audit tersedia untuk action sensitif
[ ] Negative authorization test tersedia
[ ] Tidak ada secret exposed
[ ] Tidak ada bypass authorization
[ ] Documentation diperbarui
```

---

# 56. SECURITY BASELINE

Baseline keamanan E-KANJOLI:

```text
Authentication
        +
RBAC
        +
Least Privilege
        +
Server Authorization
        +
Supabase RLS
        +
Storage Policies
        +
Audit Trail
        +
Input Validation
        +
Secure Secrets
        +
Negative Security Testing
```

Tidak satu pun lapisan boleh dianggap sebagai pengganti lapisan lainnya.

---

# 57. FINAL RULE

> **E-KANJOLI harus fail closed, bukan fail open.**

Jika sistem tidak dapat menentukan apakah user memiliki permission:

```text
DENY
```

Jika AI coding agent tidak yakin apakah suatu perubahan diperbolehkan:

```text
STOP
→ identifikasi requirement
→ periksa dokumen baseline
→ jangan mengambil keputusan bisnis sendiri
```

Keamanan dan hak akses adalah bagian dari business requirement, bukan sekadar implementasi frontend.

---

# 58. BASELINE

Dokumen ini merupakan baseline keamanan:

```text
E-KANJOLI RBAC & SECURITY v1.0
```

Perubahan terhadap dokumen ini harus tetap konsisten dengan:

```text
PRD
SYSTEM ARCHITECTURE
DATABASE SCHEMA
WORKFLOW
AI DEVELOPMENT RULES
```

Semua implementasi aplikasi harus mengacu pada baseline tersebut.
