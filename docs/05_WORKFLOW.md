# E-KANJOLI — WORKFLOW

> Status: APPROVED BASELINE
> Version: 1.0
> Last Updated: 2026-08-14
> Institution: Bappeda & Litbang Kabupaten Banggai Kepulauan
>
> Related Documents:
> - `00_PROJECT_CHARTER.md`
> - `01_PRD.md`
> - `02_SYSTEM_ARCHITECTURE.md`
> - `03_DATABASE_SCHEMA.md`
> - `04_RBAC_AND_SECURITY.md`

---

# 1. TUJUAN

Dokumen ini mendefinisikan workflow bisnis dan workflow sistem E-KANJOLI.

Workflow harus menjelaskan:

- siapa yang memulai proses;
- siapa yang menerima;
- siapa yang memverifikasi;
- siapa yang memproses;
- kapan pimpinan terlibat;
- kapan notifikasi dikirim;
- kapan audit log dibuat;
- kapan dokumen diarsipkan;
- status apa yang valid;
- siapa yang berhak melakukan setiap perubahan.

AI coding agent wajib menggunakan dokumen ini sebagai referensi utama ketika mengimplementasikan workflow.

---

# 2. PRINSIP WORKFLOW

Semua workflow E-KANJOLI mengikuti prinsip:

1. Single source of truth.
2. Status transition terkontrol.
3. Role-based access.
4. Separation of duties.
5. Auditability.
6. Traceability.
7. Approval eksplisit.
8. Notification event-driven.
9. Document versioning.
10. Archive after completion.
11. Fail closed.
12. Tidak ada perubahan status ilegal melalui frontend.

---

# 3. ACTOR SISTEM

Aktor internal:

```text
superadmin
admin_pekppp
admin_perencanaan
admin_litbang
admin_sekretariat
pimpinan
```

Aktor eksternal:

```text
masyarakat
OPD
mitra pemerintah
peneliti
pelaku usaha
pemohon layanan
```

Aktor tambahan yang dapat digunakan sebagai konsep operasional:

```text
front_office
```

`front_office` tidak otomatis menjadi role database baru.

Jika dalam implementasi diperlukan operator front office, penetapan role/permission harus terlebih dahulu disetujui dan diselaraskan dengan PRD serta RBAC.

---

# 4. WORKFLOW GENERIC

Workflow umum:

```text
INITIATED
    ↓
REGISTERED
    ↓
VERIFIED
    ↓
ASSIGNED
    ↓
IN_PROGRESS
    ↓
REVIEW
    ↓
APPROVAL_REQUIRED
    ↓
APPROVED
    ↓
COMPLETED
    ↓
ARCHIVED
```

Tidak semua modul harus menggunakan seluruh status.

Jika ditolak:

```text
REVIEW
   ↓
REJECTED
```

Jika perlu perbaikan:

```text
REVIEW
   ↓
REVISION_REQUIRED
   ↓
IN_PROGRESS
```

---

# 5. STATUS STANDARD

Status yang dapat digunakan:

```text
DRAFT
SUBMITTED
REGISTERED
VERIFIED
ASSIGNED
IN_PROGRESS
REVIEW
REVISION_REQUIRED
APPROVAL_REQUIRED
APPROVED
REJECTED
COMPLETED
CANCELLED
ARCHIVED
```

Setiap modul hanya boleh menggunakan subset status yang relevan.

---

# 6. WORKFLOW MASTER

```text
Pemohon / Pegawai
        ↓
Pengajuan
        ↓
Registrasi
        ↓
Validasi
        ↓
Penentuan unit / role
        ↓
Penugasan
        ↓
Proses
        ↓
Review
        ↓
Approval jika diperlukan
        ↓
Penyelesaian
        ↓
Notifikasi
        ↓
Arsip
        ↓
Audit trail
```

---

# 7. WORKFLOW PORTAL PUBLIK

## 7.1 Pengajuan Layanan

```text
Pemohon
   ↓
Pilih layanan
   ↓
Form dinamis
   ↓
Upload persyaratan
   ↓
Submit
   ↓
Validasi sistem
   ↓
Nomor tiket
   ↓
Notifikasi
   ↓
Admin bidang terkait
```

Sistem menghasilkan:

```text
ticket_number
created_at
service_id
applicant information
status
```

---

# 8. WORKFLOW TRACKING TIKET

```text
Pemohon
   ↓
Masukkan nomor tiket
   ↓
Verifikasi
   ↓
Sistem mencari request
   ↓
Tampilkan status publik
```

Status publik tidak boleh menampilkan catatan internal.

Contoh:

```text
Pengajuan diterima
Sedang diverifikasi
Sedang diproses
Menunggu persetujuan
Selesai
Ditolak
```

---

# 9. WORKFLOW LAYANAN PUBLIK

Workflow standar:

```text
SUBMITTED
    ↓
REGISTERED
    ↓
VERIFIED
    ↓
ASSIGNED
    ↓
IN_PROGRESS
    ↓
REVIEW
    ↓
APPROVED / REJECTED
    ↓
COMPLETED
    ↓
ARCHIVED
```

Jika dokumen pemohon kurang:

```text
VERIFIED
   ↓
REVISION_REQUIRED
   ↓
Pemohon melengkapi
   ↓
VERIFIED
```

---

# 10. PENENTUAN UNIT LAYANAN

Service memiliki:

```text
service_id
category
assigned_role
```

Mapping:

```text
PERENCANAAN
    → admin_perencanaan

LITBANG
    → admin_litbang

SEKRETARIAT / PPID
    → admin_sekretariat
```

Routing request harus dilakukan berdasarkan `service_id` dan konfigurasi layanan.

Jangan hardcode routing pada banyak komponen frontend.

---

# 11. LIMA LAYANAN PERENCANAAN

## 11.1 Data dan Informasi Pembangunan

```text
Pemohon
 ↓
Pengajuan
 ↓
Admin Perencanaan
 ↓
Validasi kebutuhan data
 ↓
Pencarian data
 ↓
Review
 ↓
Persetujuan bila diperlukan
 ↓
Data/dokumen disiapkan
 ↓
Pemohon diberi notifikasi
 ↓
Selesai
```

---

## 11.2 Asistensi Renstra/Renja

```text
OPD/Mitra
 ↓
Permohonan asistensi
 ↓
Admin Perencanaan
 ↓
Verifikasi dokumen
 ↓
Penjadwalan asistensi
 ↓
Pelaksanaan asistensi
 ↓
Catatan hasil
 ↓
Finalisasi
 ↓
Arsip
```

---

## 11.3 e-Monev

```text
OPD
 ↓
Permintaan/fasilitasi
 ↓
Admin Perencanaan
 ↓
Input / review data
 ↓
Validasi
 ↓
Evaluasi
 ↓
Hasil
 ↓
Laporan
 ↓
Arsip
```

---

## 11.4 Musrenbang RKPD/RPJMD

```text
Pemohon / OPD
 ↓
Pengajuan/fasilitasi
 ↓
Admin Perencanaan
 ↓
Verifikasi
 ↓
Penjadwalan
 ↓
Pelaksanaan
 ↓
Dokumentasi
 ↓
Berita/catatan hasil
 ↓
Arsip
```

---

## 11.5 Pokir DPRD

```text
Pengusul
 ↓
Pengajuan
 ↓
Registrasi
 ↓
Verifikasi
 ↓
Kajian / sinkronisasi
 ↓
Review
 ↓
Keputusan / tindak lanjut
 ↓
Status diperbarui
 ↓
Arsip
```

---

# 12. EMPAT LAYANAN LITBANG

## 12.1 Rekomendasi / Izin Penelitian

```text
Peneliti
 ↓
Pengajuan
 ↓
Admin Litbang
 ↓
Verifikasi persyaratan
 ↓
Review
 ↓
Approval bila diperlukan
 ↓
Surat rekomendasi/izin
 ↓
Notifikasi
 ↓
Arsip
```

---

## 12.2 Inovasi dan Kelitbangan

```text
Pemohon / Mitra
 ↓
Pengajuan
 ↓
Verifikasi
 ↓
Review substansi
 ↓
Fasilitasi
 ↓
Hasil
 ↓
Dokumentasi
 ↓
Arsip
```

---

## 12.3 TJSLP / CSR

```text
Perusahaan / Mitra
 ↓
Pengajuan
 ↓
Registrasi
 ↓
Verifikasi
 ↓
Review
 ↓
Koordinasi
 ↓
Persetujuan / tindak lanjut
 ↓
Pelaksanaan
 ↓
Laporan
 ↓
Arsip
```

---

## 12.4 Teknologi Daerah

```text
Pemohon / Mitra
 ↓
Pengajuan
 ↓
Verifikasi
 ↓
Kajian
 ↓
Review teknis
 ↓
Rekomendasi
 ↓
Approval bila diperlukan
 ↓
Tindak lanjut
 ↓
Arsip
```

---

# 13. PPID / PELAYANAN INFORMASI PUBLIK

```text
Pemohon
 ↓
Permohonan informasi
 ↓
Admin Sekretariat
 ↓
Registrasi
 ↓
Verifikasi
 ↓
Identifikasi informasi
 ↓
Koordinasi unit terkait
 ↓
Penyusunan jawaban
 ↓
Approval bila diperlukan
 ↓
Jawaban dikirim
 ↓
Selesai
 ↓
Arsip
```

Jika permohonan merupakan pengaduan:

```text
Pengaduan
 ↓
Registrasi
 ↓
Klasifikasi
 ↓
Disposisi
 ↓
Unit terkait
 ↓
Tindak lanjut
 ↓
Jawaban
 ↓
Selesai
```

---

# 14. WORKFLOW SURAT MASUK

Surat masuk merupakan workflow inti Sekretariat.

```text
Surat diterima
      ↓
Front Office / Sekretariat
      ↓
Scan / Upload
      ↓
Registrasi
      ↓
Nomor agenda
      ↓
Klasifikasi
      ↓
Pemeriksaan
      ↓
Disposisi
      ↓
Pimpinan / pejabat berwenang
      ↓
Unit penerima
      ↓
Tindak lanjut
      ↓
Status selesai
      ↓
Arsip
```

---

# 15. FRONT OFFICE SURAT MASUK

Front office secara operasional dapat bertugas:

- menerima surat;
- memeriksa kelengkapan administratif awal;
- mencatat penerimaan;
- melakukan scanning;
- memasukkan metadata;
- meneruskan ke admin sekretariat.

Namun role database tidak boleh otomatis ditambah tanpa perubahan RBAC.

Model awal:

```text
Front Office
     ↓
Admin Sekretariat
     ↓
Registrasi resmi
     ↓
e-Disposisi
```

---

# 16. DATA SURAT MASUK

Minimal:

```text
nomor_surat
tanggal_surat
tanggal_diterima
asal_surat
perihal
sifat_surat
lampiran
jenis_surat
file_document
agenda_number
status
```

---

# 17. e-DISPOSISI

Workflow:

```text
Surat Masuk
    ↓
Admin Sekretariat
    ↓
Ajukan Disposisi
    ↓
Pimpinan
    ↓
Instruksi
    ↓
Pilih penerima/unit
    ↓
Deadline
    ↓
Submit disposisi
    ↓
Unit penerima
    ↓
Tindak lanjut
    ↓
Update progres
    ↓
Selesai
```

---

# 18. DISPOSISI BERJENJANG

Jika diperlukan:

```text
Pimpinan
   ↓
Sekretaris
   ↓
Kepala Bidang
   ↓
Staf/Pelaksana
```

Setiap disposisi menyimpan:

```text
from_user
to_user / to_unit
instruction
deadline
status
created_at
completed_at
```

---

# 19. WORKFLOW TINDAK LANJUT DISPOSISI

```text
ASSIGNED
   ↓
ACKNOWLEDGED
   ↓
IN_PROGRESS
   ↓
REVIEW
   ↓
COMPLETED
```

Jika terlambat:

```text
OVERDUE
```

Sistem dapat mengirim reminder otomatis.

---

# 20. WORKFLOW SURAT KELUAR

```text
Draft
 ↓
Penyusunan
 ↓
Review
 ↓
Perbaikan jika diperlukan
 ↓
Approval
 ↓
Nomor surat
 ↓
Finalisasi
 ↓
Pengiriman
 ↓
Arsip
```

Nomor surat tidak boleh diberikan sebelum tahapan yang diwajibkan selesai.

---

# 21. SURAT KELUAR — REVISION

```text
REVIEW
   ↓
REVISION_REQUIRED
   ↓
DRAFT
   ↓
REVIEW
```

Setiap revisi penting harus dapat ditelusuri.

---

# 22. WORKFLOW PERJALANAN DINAS

Workflow utama:

```text
Usulan perjalanan
       ↓
Verifikasi
       ↓
Persetujuan
       ↓
SPT
       ↓
SPPD
       ↓
Pelaksanaan
       ↓
Laporan perjalanan
       ↓
Verifikasi laporan
       ↓
Selesai
       ↓
Arsip
```

---

# 23. SPT

```text
Draft SPT
 ↓
Review
 ↓
Approval
 ↓
Nomor SPT
 ↓
Final
 ↓
Issued
```

---

# 24. SPPD

```text
SPT approved
 ↓
Generate SPPD
 ↓
Review
 ↓
Approval/validation
 ↓
Final
 ↓
Issued
```

SPPD tidak boleh dibuat sebagai dokumen yang berdiri sendiri tanpa keterkaitan dengan perjalanan/SPT.

---

# 25. LAPORAN PERJALANAN

```text
Pegawai kembali
 ↓
Upload laporan
 ↓
Admin Sekretariat
 ↓
Verifikasi
 ↓
Revision jika perlu
 ↓
Approved
 ↓
Arsip
```

---

# 26. WORKFLOW ASET

```text
Pengadaan / penerimaan aset
       ↓
Registrasi aset
       ↓
Nomor/kode aset
       ↓
Inventarisasi
       ↓
Penempatan
       ↓
Pemeliharaan
       ↓
Mutasi bila ada
       ↓
Stock opname
       ↓
Penghapusan/pemindahtanganan
       ↓
Arsip histori
```

---

# 27. MUTASI ASET

```text
Usulan mutasi
 ↓
Verifikasi
 ↓
Approval
 ↓
Update lokasi/pengguna
 ↓
Audit log
```

Histori lokasi/pengguna sebelumnya tidak boleh hilang.

---

# 28. WORKFLOW ARSIP

```text
Dokumen selesai
      ↓
Klasifikasi
      ↓
Metadata
      ↓
Penetapan retensi
      ↓
Storage
      ↓
Index
      ↓
Pencarian
      ↓
Akses berdasarkan permission
      ↓
Arsip
```

---

# 29. RENJA

RENJA dikelola berdasarkan tahun.

Struktur:

```text
RENJA
 ├── 2025
 ├── 2026
 ├── 2027
 ├── 2028
 └── ...
```

Workflow:

```text
Draft
 ↓
Review
 ↓
Finalisasi
 ↓
Publish internal
 ↓
Arsip
```

---

# 30. RKPD

Struktur:

```text
RKPD
 ├── 2025
 ├── 2026
 ├── 2027
 └── ...
```

Workflow:

```text
Draft
 ↓
Review
 ↓
Finalisasi
 ↓
Approval bila diperlukan
 ↓
Dokumen final
 ↓
Arsip
```

---

# 31. WORKFLOW PEKPPP

```text
Persiapan evaluasi
       ↓
Pilih periode
       ↓
Form F01
       ↓
Input aspek
       ↓
Upload bukti dukung
       ↓
Self assessment
       ↓
Review evaluator
       ↓
Revisi bila diperlukan
       ↓
Finalisasi
       ↓
Export laporan
       ↓
Arsip
```

---

# 32. PEKPPP — BUKTI DUKUNG

```text
Evaluator
 ↓
Pilih aspek
 ↓
Upload bukti
 ↓
Validasi file
 ↓
Kaitkan dengan indikator
 ↓
Review
 ↓
Final
```

Bukti dukung memiliki access scope internal.

---

# 33. PEKPPP — PERIODE

Evaluasi harus dapat dibedakan berdasarkan:

```text
tahun
periode
unit
aspek
indikator
```

Data periode sebelumnya tidak boleh tertimpa ketika periode baru dibuat.

---

# 34. WORKFLOW PIMPINAN

Dashboard pimpinan:

```text
Login
 ↓
Dashboard Eksekutif
 ↓
Ringkasan
 ↓
Monitoring
 ↓
Detail
 ↓
Approval bila diperlukan
 ↓
Laporan
```

Pimpinan tidak mengelola konfigurasi sistem.

---

# 35. APPROVAL PIMPINAN

```text
Admin / unit
    ↓
Submit approval request
    ↓
Pimpinan
    ↓
Review
    ├── Approve
    ├── Reject
    └── Revision
```

Jika revision:

```text
Pimpinan
 ↓
REVISION_REQUIRED
 ↓
Unit memperbaiki
 ↓
Submit ulang
```

---

# 36. NOTIFICATION WORKFLOW

Notification dipicu oleh event.

Contoh:

```text
surat_masuk_registered
disposition_created
disposition_due
disposition_overdue
service_request_created
service_request_status_changed
approval_requested
approval_completed
document_uploaded
revision_requested
travel_approved
travel_report_due
pekppp_revision_requested
```

---

# 37. NOTIFICATION CHANNEL

Channel dapat meliputi:

```text
in_app
email
```

Channel tambahan hanya diterapkan setelah kebutuhan dan keamanan ditetapkan.

---

# 38. REMINDER

Reminder dapat digunakan untuk:

- disposisi mendekati deadline;
- disposisi terlambat;
- approval menunggu;
- laporan perjalanan belum masuk;
- permohonan layanan mendekati SLA;
- dokumen membutuhkan revisi;
- evaluasi PEKPPP.

---

# 39. SLA LAYANAN PUBLIK

Setiap layanan dapat memiliki:

```text
service_standard
target_duration
working_days
```

Sistem menghitung:

```text
elapsed_time
remaining_time
overdue
```

Dashboard pimpinan dapat menampilkan:

```text
Within SLA
At Risk
Overdue
Completed
```

---

# 40. AUDIT EVENT

Workflow sensitif harus menghasilkan audit event.

Contoh:

```text
SERVICE_SUBMITTED
SERVICE_ASSIGNED
SERVICE_APPROVED
SERVICE_REJECTED
LETTER_REGISTERED
DISPOSITION_CREATED
DISPOSITION_COMPLETED
TRAVEL_APPROVED
DOCUMENT_UPLOADED
ASSET_TRANSFERRED
PEKPPP_FINALIZED
```

---

# 41. WORKFLOW DOCUMENT

Setiap workflow dokumen harus mempertahankan:

```text
document_id
version
created_by
created_at
updated_by
updated_at
status
```

Jika revisi diperlukan:

```text
version 1
   ↓
revision
   ↓
version 2
```

---

# 42. WORKFLOW ARCHIVE

Setelah proses selesai:

```text
COMPLETED
    ↓
Archive validation
    ↓
ARCHIVED
```

Dokumen yang telah diarsipkan tidak boleh diedit secara normal.

Jika perlu koreksi:

```text
ARCHIVED
   ↓
Controlled restore/revision
   ↓
New version
   ↓
ARCHIVED
```

Tindakan tersebut wajib diaudit.

---

# 43. WORKFLOW ERROR / FAILURE

Jika proses gagal:

```text
Operation failed
    ↓
Rollback transaction
    ↓
Log error
    ↓
Show safe error
```

Jangan meninggalkan status setengah jadi.

---

# 44. WORKFLOW CONCURRENCY

Jika dua user mengubah record yang sama:

```text
User A reads version 3
User B reads version 3

User A saves → version 4

User B saves
       ↓
Conflict detected
       ↓
Reject stale update
```

Sistem tidak boleh diam-diam menimpa perubahan terbaru.

---

# 45. WORKFLOW DELETE

Data bisnis tidak langsung dihapus secara permanen.

```text
Delete request
 ↓
Authorization
 ↓
Check dependency
 ↓
Soft delete / archive
 ↓
Audit
```

Hard delete hanya untuk data yang memang diperbolehkan.

---

# 46. WORKFLOW SEARCH

Pencarian harus menghormati permission.

```text
User search
 ↓
Authorization
 ↓
RLS
 ↓
Filter
 ↓
Result
```

User tidak boleh mendapatkan data yang sebenarnya tidak boleh dibaca hanya karena menggunakan search.

---

# 47. WORKFLOW EXPORT

```text
User request export
 ↓
Check permission
 ↓
Apply current filters
 ↓
Generate file
 ↓
Audit export
 ↓
Private download
```

Export tidak boleh melewati RLS/authorization.

---

# 48. CROSS-MODULE WORKFLOW

E-KANJOLI memiliki keterkaitan modul.

Contoh:

```text
Surat Masuk
   ↓
e-Disposisi
   ↓
Bidang
   ↓
Tindak lanjut
   ↓
Surat Keluar
   ↓
Arsip
```

Contoh lain:

```text
Perjalanan Dinas
   ↓
SPT
   ↓
SPPD
   ↓
Pelaksanaan
   ↓
Laporan
   ↓
Arsip
```

---

# 49. WORKFLOW DATA DAN DOCUMENT RELATIONSHIP

Dokumen harus dapat dikaitkan dengan entity bisnis:

```text
surat
service_request
disposition
travel_order
travel_report
asset
renja
rkpd
pekppp
```

Jangan membuat dokumen sebagai file tanpa metadata dan hubungan bisnis.

---

# 50. DASHBOARD WORKFLOW

Dashboard mengambil data dari status workflow.

Contoh:

```text
PENDING
IN_PROGRESS
APPROVAL_REQUIRED
OVERDUE
COMPLETED
```

Dashboard tidak boleh memiliki status bisnis sendiri yang bertentangan dengan data transaksi.

---

# 51. CROSS-ROLE HANDOFF

Ketika pekerjaan berpindah role:

```text
Actor A
 ↓
Submit
 ↓
System assigns
 ↓
Actor B
 ↓
Notification
 ↓
Actor B acknowledges
```

Setiap handoff harus dapat dilacak.

---

# 52. HANDOFF ANTAR BIDANG

Jika suatu permohonan salah routing:

```text
Admin menerima
 ↓
Tidak sesuai kewenangan
 ↓
Return / reroute
 ↓
Pilih unit tujuan
 ↓
Alasan
 ↓
Audit
```

Tidak boleh mengubah `assigned_role` secara sembarang tanpa histori.

---

# 53. WORKFLOW KORESPONDENSI

Surat yang menghasilkan tindak lanjut layanan dapat memiliki relationship:

```text
incoming_letter
    ↓
disposition
    ↓
service_request / internal_task
    ↓
outgoing_letter
    ↓
archive
```

---

# 54. INTERNAL TASK

Untuk disposisi yang membutuhkan pekerjaan, sistem dapat menggunakan task internal.

Minimal:

```text
title
description
assignee
due_date
priority
status
source
```

Status:

```text
TODO
IN_PROGRESS
BLOCKED
DONE
OVERDUE
```

---

# 55. PRIORITY

Prioritas dapat:

```text
LOW
NORMAL
HIGH
URGENT
```

Penggunaan `URGENT` harus mengikuti kebijakan organisasi.

---

# 56. ESCALATION

Jika pekerjaan melewati deadline:

```text
Task overdue
 ↓
Reminder
 ↓
Escalation
 ↓
Supervisor / pimpinan
```

Escalation harus configurable.

---

# 57. WORKFLOW PUBLIC TO INTERNAL

```text
PUBLIC REQUEST
      ↓
SERVICE REQUEST
      ↓
ADMIN UNIT
      ↓
INTERNAL TASK
      ↓
REVIEW
      ↓
APPROVAL
      ↓
PUBLIC RESPONSE
      ↓
ARCHIVE
```

Catatan internal tidak boleh masuk ke response publik.

---

# 58. WORKFLOW INTERNAL TO PUBLIC

Jika dokumen internal akan dipublikasikan:

```text
Internal document
 ↓
Classification review
 ↓
Public release approval
 ↓
Published copy
```

Dokumen internal asli tetap berada pada storage internal.

---

# 59. WORKFLOW PPID

Untuk informasi yang membutuhkan koordinasi:

```text
PPID
 ↓
Identifikasi unit pemilik informasi
 ↓
Request internal
 ↓
Unit menyediakan informasi
 ↓
Review klasifikasi
 ↓
PPID final response
 ↓
Pemohon
```

---

# 60. WORKFLOW PENGADUAN

```text
Pengadu
 ↓
Submit
 ↓
Ticket
 ↓
Classification
 ↓
Verification
 ↓
Disposition
 ↓
Unit terkait
 ↓
Investigation / response
 ↓
Review
 ↓
Response
 ↓
Close
```

---

# 61. WORKFLOW AUDIT

Audit tidak boleh mengubah workflow bisnis.

Audit hanya merekam:

```text
who
what
when
where
resource
before
after
```

---

# 62. WORKFLOW SYSTEM CONFIGURATION

Hanya superadmin:

```text
Configuration
 ↓
Validate
 ↓
Save
 ↓
Audit
```

Perubahan konfigurasi yang berdampak bisnis harus didokumentasikan.

---

# 63. WORKFLOW USER ROLE

```text
Superadmin
 ↓
Create / select user
 ↓
Assign role
 ↓
Validate
 ↓
Activate
 ↓
Audit
```

Role change:

```text
Old Role
 ↓
New Role
 ↓
Audit
```

---

# 64. WORKFLOW LOGIN

```text
User
 ↓
Login
 ↓
Authentication
 ↓
Session
 ↓
Load profile
 ↓
Load role
 ↓
Authorization
 ↓
Dashboard sesuai role
```

Jika akun nonaktif:

```text
Authentication / authorization
 ↓
Account disabled
 ↓
Access denied
```

---

# 65. WORKFLOW LOGOUT

```text
User
 ↓
Logout
 ↓
Session invalidation
 ↓
Return login
```

---

# 66. WORKFLOW BACKUP

```text
Scheduled backup
 ↓
Database backup
 ↓
Storage backup
 ↓
Verification
 ↓
Backup metadata
 ↓
Retention
```

Restore harus diuji secara berkala.

---

# 67. WORKFLOW DEPLOYMENT

```text
Development
 ↓
Lint
 ↓
Typecheck
 ↓
Unit test
 ↓
Integration test
 ↓
Build
 ↓
Review
 ↓
Staging
 ↓
Acceptance
 ↓
Production
```

Migration database harus melalui migration file yang versioned.

---

# 68. WORKFLOW BUG FIX

```text
Bug reported
 ↓
Reproduce
 ↓
Identify root cause
 ↓
Implement fix
 ↓
Test
 ↓
Review
 ↓
Commit
 ↓
Deploy
 ↓
Verify
```

Jangan memperbaiki bug dengan menghapus data produksi.

---

# 69. WORKFLOW AI DEVELOPMENT

AI coding agent harus:

```text
Read requirements
 ↓
Read architecture
 ↓
Read database
 ↓
Read RBAC
 ↓
Read workflow
 ↓
Plan
 ↓
Implement
 ↓
Test
 ↓
Review
 ↓
Report
```

Jika requirement tidak jelas:

```text
STOP
```

Jangan membuat keputusan bisnis sepihak.

---

# 70. WORKFLOW CHANGE REQUEST

Jika kebutuhan baru muncul:

```text
Request
 ↓
Analyze impact
 ↓
PRD review
 ↓
Architecture review
 ↓
Database impact
 ↓
RBAC impact
 ↓
Workflow impact
 ↓
Approval
 ↓
Documentation update
 ↓
Implementation
 ↓
Testing
```

---

# 71. WORKFLOW VERSIONING

Setiap perubahan workflow yang signifikan harus:

```text
document update
+
migration if needed
+
test update
+
audit/change record
```

---

# 72. DEFINITION OF DONE

Workflow dianggap selesai apabila:

```text
[ ] Actor jelas
[ ] Entry point jelas
[ ] Status jelas
[ ] Transition jelas
[ ] Permission jelas
[ ] Approval jelas
[ ] Notification jelas
[ ] Audit event jelas
[ ] Error path jelas
[ ] Revision path jelas
[ ] Archive path jelas
[ ] Negative authorization test tersedia
```

---

# 73. MASTER WORKFLOW E-KANJOLI

```text
                         E-KANJOLI
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
       PUBLIC              INTERNAL            LEADERSHIP
          │                   │                   │
          ↓                   ↓                   ↓
   Service Request       Smart Office        Dashboard
          │                   │                   │
          │          ┌────────┼────────┐          │
          │          │        │        │          │
          │       Surat    Perjalanan  Aset       │
          │          │        │        │          │
          │      Disposisi   SPT/SPPD  Invent.    │
          │          │        │        │          │
          └──────────┼────────┼────────┘          │
                     │        │                   │
                     ↓        ↓                   ↓
                  Bidang   Dokumen            Approval
                     │        │                   │
          ┌──────────┼────────┘                   │
          │          │                            │
     Perencanaan   Litbang                  Monitoring
          │          │                            │
          └──────────┼────────────────────────────┘
                     │
                     ↓
                  Selesai
                     │
                     ↓
                  Notifikasi
                     │
                     ↓
                   Arsip
                     │
                     ↓
                 Audit Trail
```

---

# 74. MASTER ROLE FLOW

```text
PUBLIC
  ↓
Portal layanan
  ↓
Admin Sekretariat / Admin Bidang
  ↓
Processing
  ↓
Pimpinan jika approval diperlukan
  ↓
Completion
```

Administrasi internal:

```text
Sekretariat
  ↓
Surat
  ↓
Disposisi
  ↓
Bidang
  ↓
Tindak lanjut
  ↓
Arsip
```

PEKPPP:

```text
Admin PEKPPP
  ↓
F01
  ↓
Bukti dukung
  ↓
Evaluasi
  ↓
Final
  ↓
Reporting
```

---

# 75. WORKFLOW SECURITY RULE

Setiap transition wajib menjawab:

```text
WHO?
WHAT?
WHEN?
WHY?
TO WHOM?
WHAT DATA?
WHAT PERMISSION?
WHAT AUDIT?
WHAT NOTIFICATION?
```

Jika salah satu aspek kritis tidak jelas, workflow belum siap diimplementasikan.

---

# 76. FINAL BASELINE

Workflow baseline E-KANJOLI:

```text
Public Service
+
Smart Office
+
Correspondence
+
e-Disposition
+
Official Travel
+
Asset Management
+
Document Archive
+
RENJA
+
RKPD
+
PEKPPP
+
Notification
+
Approval
+
Reporting
+
Audit Trail
```

Semua modul harus menggunakan workflow yang konsisten dengan:

```text
01_PRD.md
02_SYSTEM_ARCHITECTURE.md
03_DATABASE_SCHEMA.md
04_RBAC_AND_SECURITY.md
```

Dokumen ini menjadi baseline:

```text
E-KANJOLI WORKFLOW v1.0
```
