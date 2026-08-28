# E-KANJOLI — PRODUCT REQUIREMENT DOCUMENT



> Status: APPROVED BASELINE

> Version: 1.0

> Last Updated: 2026-08-14

> Institution: Bappeda \& Litbang Kabupaten Banggai Kepulauan

> Related Document: 00\_PROJECT\_CHARTER.md



\---



# 1. DOKUMEN INFORMASI



## 1.1 Nama Produk



\*\*E-KANJOLI\*\*



## 1.2 Kepanjangan



\*\*Elektronik - Kanal Aksessibilitas, Navigasi, Jasa Optimalisasi, \&

Layanan Integrasi\*\*



## 1.3 Jenis Produk



Integrated Government Smart Office \& Public Service Platform.



## 1.4 Platform



Web Application.



## 1.5 Target Pengguna



### Internal



\- Superadmin

\- Admin PEKPPP

\- Admin Perencanaan

\- Admin Litbang

\- Admin Sekretariat

\- Pimpinan



### Eksternal



\- Masyarakat

\- OPD

\- Mitra pemerintah

\- Peneliti

\- Pelaku usaha

\- Pemohon layanan lainnya



\---



# 2. TUJUAN PRODUK



E-KANJOLI bertujuan menyediakan satu sistem terpadu untuk:



1\. Digitalisasi administrasi perkantoran.

2\. Digitalisasi pelayanan publik.

3\. Pengelolaan dokumen dan arsip.

4\. Pengelolaan surat masuk dan surat keluar.

5\. Digitalisasi disposisi.

6\. Digitalisasi perjalanan dinas.

7\. Inventarisasi aset.

8\. Pengelolaan RENJA dan RKPD.

9\. Digitalisasi evaluasi PEKPPP.

10\. Monitoring kinerja layanan.

11\. Penyediaan dashboard pimpinan.

12\. Pencatatan audit trail.

13\. Penyediaan laporan.

14\. Penyediaan notifikasi.

15\. Peningkatan transparansi dan akuntabilitas.



\---



# 3. PRINSIP PRODUK



E-KANJOLI harus mengikuti prinsip:



\- Secure by Design

\- Role Based Access

\- Least Privilege

\- Auditability

\- Traceability

\- Data Integrity

\- Modular Architecture

\- Responsive Design

\- Accessibility

\- Maintainability

\- Scalability

\- Configuration over Hardcoding



\---



# 4. ROLE SISTEM



Role resmi:



```text

superadmin

admin\_pekppp

admin\_perencanaan

admin\_litbang

admin\_sekretariat

pimpinan

5. MATRIKS ROLE DAN DOMAIN
Domain	Superadmin	PEKPPP	Perencanaan	Litbang	Sekretariat	Pimpinan
System Management	CRUD	-	-	-	-	-
User Management	CRUD	-	-	-	-	Read
Public Services	Config	-	Own	Own	Own	Read
Service Requests	Read/Config	-	Own	Own	Own	Read
Surat Masuk	Config	-	-	-	CRUD	Read
Surat Keluar	Config	-	-	-	CRUD	Read/Approve*
e-Disposisi	Config	-	-	-	CRUD	Read/Approve*
Perjalanan Dinas	Config	-	-	-	CRUD	Read/Approve*
Aset	Config	-	-	-	CRUD	Read
Arsip	Config	-	-	-	CRUD	Read
RENJA	Config	-	Read	-	CRUD	Read
RKPD	Config	-	Read	-	CRUD	Read
PEKPPP	Config	CRUD	-	-	-	Read
Dashboard	Full	PEKPPP	Own	Own	Own	Executive
Audit Log	Full	Read Own	Read Own	Read Own	Read Own	Read
Reporting	Full	Own	Own	Own	Own	Full

* approval hanya berlaku jika workflow bisnis memberikan kewenangan
tersebut.

6. PORTAL PUBLIK

Portal publik adalah halaman yang dapat digunakan tanpa harus masuk
ke dashboard internal.

6.1 Halaman Publik

Minimal terdiri dari:

Beranda
Profil
Layanan
Detail Layanan
Persyaratan
Standar Pelayanan
Pengajuan
Tracking
Informasi Publik
Pengaduan
Berita/Informasi apabila diaktifkan
Kontak
7. KATALOG LAYANAN PUBLIK

Sistem harus menampilkan seluruh layanan publik yang aktif.

Setiap layanan memiliki:

ID;
kode layanan;
nama layanan;
kategori;
deskripsi;
dasar hukum;
persyaratan;
prosedur;
waktu penyelesaian;
output;
biaya;
kanal layanan;
jam layanan;
kontak;
role pengelola;
status aktif/nonaktif.

Layanan tidak boleh ditanam langsung di source code.

Data layanan harus berasal dari database.

8. 10 LAYANAN PUBLIK
8.1 Bidang Perencanaan
Service P01

Layanan Fasilitasi Permohonan Data dan Informasi Pembangunan Daerah

Pengelola:

admin_perencanaan

Service P02

Layanan Asistensi/Fasilitasi Perencanaan Pembangunan Daerah pada Mitra
OPD (Renstra/Renja)

Pengelola:

admin_perencanaan

Service P03

Layanan Asistensi Pelaporan Evaluasi dan Pengendalian Kinerja
Pembangunan (e-Monev)

Pengelola:

admin_perencanaan

Service P04

Layanan Fasilitasi Konsultasi/Pelaksanaan Musrenbang
(RKPD/RPJMD)

Pengelola:

admin_perencanaan

Service P05

Layanan Fasilitasi/Pengusulan Pokok-Pokok Pikiran (Pokir) DPRD

Pengelola:

admin_perencanaan

9. LAYANAN LITBANG
Service L01

Layanan Surat Rekomendasi / Izin Penelitian Daerah

Pengelola:

admin_litbang

Service L02

Layanan Fasilitasi Inovasi dan Kelitbangan Daerah

Pengelola:

admin_litbang

Service L03

Layanan Fasilitasi/Kemitraan Tanggung Jawab Sosial dan Lingkungan
Perusahaan (TJSLP/CSR)

Pengelola:

admin_litbang

Service L04

Layanan Pengkajian, Pengembangan, & Penerapan Teknologi Daerah

Pengelola:

admin_litbang

10. LAYANAN SEKRETARIAT / PPID
Service S01

Pelayanan Informasi Publik dan Pengaduan Masyarakat
(PPID Pelaksana)

Pengelola:

admin_sekretariat

11. PENGAJUAN LAYANAN PUBLIK

Pemohon dapat memilih layanan kemudian mengisi formulir.

Data umum:

nama;
email;
nomor telepon;
alamat;
instansi;
layanan;
tujuan;
uraian permohonan;
dokumen persyaratan;
pernyataan;
persetujuan pemrosesan data.

Formulir tambahan dapat berbeda berdasarkan jenis layanan.

12. DYNAMIC SERVICE FORM

Form layanan harus bersifat configurable.

Contoh:

service
    ↓
service_form_schema
    ↓
form fields
    ↓
applicant response

Sistem tidak boleh membuat satu form statis untuk seluruh layanan.

Field dapat memiliki tipe:

text;
textarea;
number;
date;
datetime;
select;
radio;
checkbox;
file;
email;
phone.
13. TICKETING

Setiap permohonan menghasilkan nomor tiket unik.

Format awal:

KANJOLI-YYYY-XXXXXX

Contoh:

KANJOLI-2026-000001

Nomor tiket harus:

unik;
tidak dapat diedit pemohon;
dapat digunakan untuk tracking;
tercatat pada audit trail.
14. STATUS PERMOHONAN

Status dasar:

PENDING
IN_PROGRESS
WAITING_APPLICANT
APPROVED
REJECTED
COMPLETED
CANCELLED

Status tambahan dapat digunakan apabila diperlukan oleh workflow
spesifik.

15. TRACKING PUBLIK

Pemohon dapat memasukkan:

nomor tiket;
informasi verifikasi tambahan apabila diperlukan.

Tracking menampilkan informasi yang aman untuk publik:

nomor tiket;
layanan;
tanggal pengajuan;
status;
tahapan;
catatan publik;
tanggal pembaruan.

Data internal tidak boleh ditampilkan.

16. WORKFLOW PELAYANAN PUBLIK

Workflow umum:

SUBMITTED
    ↓
PENDING
    ↓
VERIFICATION
    ↓
IN_PROGRESS
    ↓
WAITING_APPLICANT (opsional)
    ↓
APPROVED / REJECTED
    ↓
COMPLETED

Tidak semua layanan wajib menggunakan seluruh status.

Workflow dapat dikonfigurasi berdasarkan jenis layanan.

17. DASHBOARD ADMIN LAYANAN

Admin bidang hanya melihat layanan yang menjadi tanggung jawabnya.

Contoh:

admin_perencanaan
    ↓
P01
P02
P03
P04
P05
admin_litbang
    ↓
L01
L02
L03
L04
admin_sekretariat
    ↓
S01
+ Smart Office
18. FITUR ADMIN LAYANAN

Admin dapat:

melihat permohonan;
filter;
search;
melihat detail;
memverifikasi;
meminta perbaikan;
memberikan catatan;
mengubah status;
upload dokumen hasil;
menyelesaikan layanan.
19. SMART OFFICE

Smart Office merupakan domain internal.

Menu utama:

Smart Office
├── Surat Masuk
├── Surat Keluar
├── e-Disposisi
├── Perjalanan Dinas
│   ├── Surat Perintah Tugas
│   ├── Surat Perjalanan Dinas
│   └── Laporan Perjalanan
├── Daftar Aset
├── Arsip Dokumen
│   ├── RENJA
│   ├── RKPD
│   └── Dokumen Lainnya
└── Monitoring Administrasi
20. SURAT MASUK
20.1 Tujuan

Mencatat dan mengelola seluruh surat masuk yang diterima instansi.

20.2 Data

Minimal:

nomor agenda;
nomor surat;
tanggal surat;
tanggal diterima;
pengirim;
tujuan;
perihal;
klasifikasi;
sifat;
lampiran;
file;
sumber;
status.
20.3 Workflow
RECEIVED
→ REGISTERED
→ CLASSIFIED
→ DISPATCHED
→ FOLLOW_UP
→ COMPLETED
→ ARCHIVED
21. SURAT KELUAR
21.1 Data
nomor surat;
tanggal;
tujuan;
perihal;
klasifikasi;
sifat;
isi/ringkasan;
lampiran;
penandatangan;
file;
status.
21.2 Workflow
DRAFT
→ REVIEW
→ APPROVAL
→ NUMBERED
→ SIGNED
→ SENT
→ ARCHIVED
22. e-DISPOSISI

e-Disposisi digunakan untuk meneruskan surat atau instruksi.

Data:

surat;
pemberi;
penerima;
instruksi;
prioritas;
tenggat;
status;
catatan;
hasil;
lampiran.

Workflow:

CREATED
→ ASSIGNED
→ ACCEPTED
→ PROCESSING
→ COMPLETED
→ VERIFIED

Sistem harus mencatat seluruh histori.

23. PERJALANAN DINAS

Modul:

Perjalanan Dinas
├── SPT
├── SPPD
└── Laporan Perjalanan
24. SURAT PERINTAH TUGAS

Data:

nomor;
tanggal;
dasar;
pegawai;
jabatan;
tujuan;
kegiatan;
waktu;
tempat;
pemberi tugas;
dokumen.
25. SURAT PERJALANAN DINAS

Data:

nomor;
pegawai;
tujuan;
tanggal berangkat;
tanggal kembali;
transportasi;
rincian perjalanan;
dokumen;
status.
26. LAPORAN PERJALANAN

Data:

perjalanan;
pelaksana;
tujuan;
hasil;
kegiatan;
tanggal;
dokumentasi;
file laporan;
bukti pendukung;
verifikasi.

Workflow:

ASSIGNMENT
→ SPT
→ SPPD
→ TRAVEL
→ REPORT
→ VERIFICATION
→ ARCHIVE
27. DAFTAR ASET
27.1 Fungsi

Mencatat aset/inventaris yang dikelola unit kerja.

27.2 Data
kode aset;
nama;
kategori;
merk;
model;
nomor seri;
tahun;
sumber;
nilai;
lokasi;
pengguna;
kondisi;
status;
foto;
dokumen.
27.3 Status Kondisi

Contoh:

BAIK
RUSAK_RINGAN
RUSAK_BERAT
27.4 Histori

Perubahan:

lokasi;
pengguna;
kondisi;
status;

harus dapat dilacak.

28. ARSIP DOKUMEN

Sistem harus menyediakan document repository.

Fungsi:

upload;
metadata;
kategori;
pencarian;
filter;
preview;
download;
versioning;
archive;
access control.
29. RENJA

RENJA dikelola berdasarkan tahun.

Struktur konseptual:

RENJA
├── 2025
├── 2026
├── 2027
├── ...
└── Tahun berikutnya

Tahun harus bersifat dinamis.

Data metadata:

tahun;
unit;
judul;
nomor;
tanggal;
file;
versi;
status;
uploader.
30. RKPD

RKPD menggunakan struktur serupa.

Metadata:

tahun;
judul;
nomor;
tanggal;
file;
versi;
status;
uploader.
31. DOKUMEN LAINNYA

Arsip juga harus dapat digunakan untuk:

regulasi;
SOP;
surat keputusan;
laporan;
pedoman;
dokumen program;
dokumen kegiatan;
dokumen evaluasi;
bukti dukung.
32. PEKPPP

PEKPPP merupakan modul terpisah namun terintegrasi.

32.1 Fungsi
membuat periode evaluasi;
mengelola instrumen;
mengisi F01;
mengelola aspek;
mengisi jawaban;
memberikan nilai;
upload bukti;
verifikasi;
komentar evaluator;
finalisasi.
33. F01

Sistem harus memungkinkan struktur:

Periode Evaluasi
    ↓
Aspek
    ↓
Indikator
    ↓
Pertanyaan
    ↓
Jawaban
    ↓
Bukti Dukung
    ↓
Nilai
    ↓
Verifikasi

Struktur pertanyaan tidak boleh terlalu bergantung pada hardcoded
component.

34. BUKTI DUKUNG PEKPPP

Bukti dukung harus memiliki:

nama;
kategori;
file;
periode;
indikator;
uploader;
status;
catatan;
verifier.

Dokumen harus memiliki access control.

35. DASHBOARD PEKPPP

Menampilkan:

progress;
jumlah pertanyaan;
jumlah terisi;
jumlah belum terisi;
bukti dukung;
aspek;
nilai;
status verifikasi.
36. DASHBOARD PIMPINAN

Dashboard pimpinan harus memberikan ringkasan strategis.

Widget dapat meliputi:

Pelayanan Publik
total permohonan;
pending;
berjalan;
selesai;
ditolak;
overdue.
Smart Office
surat masuk;
surat keluar;
disposisi aktif;
disposisi terlambat;
perjalanan dinas.
Arsip
total dokumen;
dokumen berdasarkan kategori;
dokumen berdasarkan tahun.
PEKPPP
progress;
nilai;
bukti dukung;
status.
37. SLA

Setiap layanan dapat memiliki:

standar waktu;
target penyelesaian;
status SLA.

Sistem harus dapat menentukan:

ON_TIME
AT_RISK
OVERDUE

Dashboard harus dapat membandingkan waktu aktual dengan standar.

38. NOTIFIKASI

Notifikasi internal untuk:

permohonan baru;
perubahan status;
disposisi;
assignment;
approval;
rejection;
deadline;
dokumen;
verifikasi.

Notifikasi harus memiliki:

user;
type;
title;
message;
reference;
read status;
timestamp.
39. AUDIT LOG

Aktivitas penting wajib dicatat.

Contoh:

CREATE
UPDATE
DELETE
LOGIN
LOGOUT
APPROVE
REJECT
UPLOAD
DOWNLOAD
STATUS_CHANGE
ASSIGN
DISPATCH
VERIFY

Audit log minimal memiliki:

actor;
action;
entity;
entity_id;
timestamp;
metadata;
before;
after.
40. SEARCH

Sistem harus memiliki pencarian yang konsisten.

Search minimal untuk:

nomor tiket;
nomor surat;
nama pemohon;
nama dokumen;
kode aset;
nomor SPT;
nomor SPPD;
tahun;
kategori.
41. FILTER

Filter minimal:

status;
tanggal;
tahun;
bidang;
kategori;
role;
jenis dokumen;
layanan.
42. REPORTING

Sistem harus dapat menghasilkan laporan.

Contoh:

laporan layanan;
laporan SLA;
laporan surat masuk;
laporan surat keluar;
laporan disposisi;
laporan perjalanan dinas;
laporan aset;
laporan arsip;
laporan PEKPPP.

Format ekspor minimal:

PDF;
Excel/CSV apabila dibutuhkan.
43. APPROVAL

Approval digunakan hanya untuk proses yang membutuhkan kewenangan.

Contoh:

surat keluar;
perjalanan dinas;
rekomendasi;
hasil layanan;
finalisasi PEKPPP.

Approval harus menghasilkan audit trail.

44. FILE STORAGE

File disimpan pada Supabase Storage.

Prinsip:

bucket terpisah berdasarkan kebutuhan keamanan;
private bucket untuk dokumen internal;
signed URL untuk akses terbatas;
validasi tipe file;
batas ukuran;
metadata;
audit download.
45. AUTHENTICATION

Authentication menggunakan Supabase Auth.

Fungsi:

login;
logout;
session;
reset password;
profile.

Jika diperlukan pada tahap lanjutan:

MFA;
SSO;
external identity provider.
46. RBAC

Hak akses harus diterapkan pada:

UI

Menu dan tombol.

Route

Halaman yang dapat dibuka.

Business Logic

Operasi yang dapat dilakukan.

Database

Row Level Security.

Semua lapisan harus konsisten.

47. ROW LEVEL SECURITY

RLS merupakan security boundary utama database.

Contoh konsep:

admin_perencanaan
→ hanya service request Perencanaan


admin_litbang
→ hanya service request Litbang


admin_sekretariat
→ hanya service request Sekretariat


admin_pekppp
→ hanya data PEKPPP


pimpinan
→ read-only data yang diizinkan


superadmin
→ administrasi sistem

Policy aktual didefinisikan dalam:

03_DATABASE_SCHEMA.md

dan:

04_RBAC_AND_SECURITY.md

48. RESPONSIVE DESIGN

Aplikasi harus dapat digunakan pada:

desktop;
laptop;
tablet;
mobile browser.

Prioritas UI internal:

Desktop first

Prioritas portal publik:

Responsive / mobile friendly

49. UI/UX

Antarmuka harus:

sederhana;
profesional;
modern;
konsisten;
mudah dipahami pegawai;
tidak terlalu dekoratif;
mendukung pekerjaan cepat.

Komponen harus konsisten:

sidebar;
header;
breadcrumb;
table;
form;
modal;
drawer;
badge;
status;
notification;
dashboard card.

Detail desain ditentukan dalam:

06_UI_UX_DESIGN_SYSTEM.md

50. ACCESSIBILITY

Minimal mendukung:

keyboard navigation;
readable contrast;
label form;
focus state;
semantic HTML;
meaningful error message;
responsive layout.
51. ERROR HANDLING

Error harus:

informatif;
aman;
tidak membocorkan secret;
tidak menampilkan stack trace kepada user;
tercatat jika diperlukan.

Contoh pesan pengguna:

Permohonan tidak dapat diproses.
Silakan coba kembali atau hubungi administrator.
52. VALIDATION

Validasi harus dilakukan:

Client

Untuk UX.

Server/Database

Untuk security dan integrity.

Client-side validation tidak boleh dianggap sebagai security boundary.

53. DATA INTEGRITY

Sistem harus mencegah:

duplicate ticket;
duplicate identifier;
orphan records;
invalid status transition;
unauthorized modification;
inconsistent relationships.

Database constraint digunakan jika memungkinkan.

54. SOFT DELETE

Data penting tidak boleh langsung dihapus secara permanen tanpa
kebijakan.

Untuk data tertentu gunakan:

deleted_at
deleted_by

atau mekanisme archive.

Hard delete hanya untuk data yang memang diperbolehkan.

55. VERSIONING

Dokumen tertentu harus mendukung versi.

Contoh:

RENJA 2026
v1
v2
v3

Versi terbaru harus dapat ditentukan dengan jelas.

56. MASTER DATA

Master data yang diperlukan dapat mencakup:

role;
unit;
layanan;
kategori dokumen;
klasifikasi surat;
sifat surat;
status;
tahun;
lokasi aset;
kategori aset;
jenis perjalanan;
jenis notifikasi.

Master data yang bersifat dinamis sebaiknya berasal dari database.

57. ACTIVITY TIMELINE

Objek bisnis penting dapat memiliki timeline.

Contoh:

14 Aug 09:10
Permohonan dibuat


14 Aug 10:20
Dokumen diverifikasi


15 Aug 08:30
Permohonan diproses


16 Aug 14:00
Permohonan selesai

Timeline bukan pengganti audit log, tetapi representasi aktivitas yang
relevan bagi pengguna.

58. PUBLIC DATA VS INTERNAL DATA

Sistem harus memisahkan:

Public
informasi layanan;
status tiket;
informasi publik;
data yang memang dipublikasikan.
Internal
disposisi;
catatan internal;
audit;
data pengguna;
dokumen rahasia;
informasi evaluasi internal.

Data internal tidak boleh bocor melalui API publik.

59. PRIVACY

Data pemohon yang bersifat pribadi hanya boleh diakses oleh pihak yang
membutuhkan untuk menjalankan layanan.

Minimal:

nama;
email;
telepon;
alamat;

harus memiliki access control.

60. PERFORMANCE

Target awal:

halaman umum cepat ditampilkan;
tabel menggunakan pagination;
query menggunakan filter;
file tidak dimuat penuh jika tidak diperlukan;
dashboard menggunakan query yang efisien;
tidak mengambil seluruh tabel tanpa kebutuhan.
61. OBSERVABILITY

Sistem perlu menyediakan informasi untuk troubleshooting:

error log;
audit log;
activity;
database monitoring;
deployment log.
62. BACKUP

Database dan dokumen penting harus memiliki strategi backup.

Backup bukan bagian dari frontend.

Kebijakan backup harus ditentukan pada deployment stage.

63. DEVELOPMENT RULE

AI coding agent tidak boleh:

mengubah role tanpa persetujuan;
menghapus tabel penting;
mengubah workflow bisnis tanpa dokumentasi;
menambahkan dependency besar tanpa alasan;
menaruh secret di source code;
bypass RLS;
menggunakan service-role key di browser;
membuat dummy data sebagai pengganti database production logic.
64. IMPLEMENTATION ORDER

Urutan implementasi:

1. Foundation
2. Application Shell
3. Authentication
4. User Profile
5. RBAC
6. Database Foundation
7. Audit Log
8. Notification
9. Smart Office
10. Public Services
11. PEKPPP
12. Dashboard
13. Reporting
14. Testing
15. Security Review
16. Deployment
65. MVP

MVP minimal harus mencakup:

Authentication
login;
role.
Public
katalog;
detail layanan;
pengajuan;
ticket;
tracking.
Admin
inbox permohonan;
verifikasi;
status;
dokumen.
Smart Office
Surat Masuk;
Surat Keluar;
e-Disposisi.
PEKPPP
F01 dasar;
bukti dukung.
Dashboard
ringkasan.
Security
RBAC;
RLS;
audit.
66. ACCEPTANCE CRITERIA

Produk dianggap memenuhi PRD apabila:

Semua role dapat login sesuai kewenangannya.
Unauthorized user tidak dapat membuka modul terlarang.
RLS mencegah akses data lintas role.
10 layanan tersedia.
Pengajuan publik menghasilkan tiket.
Admin bidang hanya melihat layanan miliknya.
Status dapat ditelusuri.
Dokumen dapat diunggah dan dikontrol.
Surat masuk dapat diregistrasi.
Surat keluar dapat dikelola.
e-Disposisi dapat dilakukan.
Perjalanan dinas dapat dikelola.
Aset dapat dicatat.
RENJA dapat diarsipkan berdasarkan tahun.
RKPD dapat diarsipkan berdasarkan tahun.
PEKPPP dapat dinilai.
Bukti dukung dapat dikelola.
Dashboard pimpinan tersedia.
Audit trail berjalan.
Notifikasi berjalan.
Laporan dapat dibuat.
Sistem responsive.
Tidak ada secret di frontend.
Production build berhasil.
Automated tests untuk fungsi kritis tersedia.
67. DEFINITION OF DONE

Sebuah fitur dianggap selesai apabila:

requirement tersedia;
UI tersedia;
database tersedia;
RLS tersedia;
validation tersedia;
error handling tersedia;
audit tersedia jika diperlukan;
loading state tersedia;
empty state tersedia;
responsive;
test tersedia;
lint berhasil;
build berhasil;
tidak ada regression kritis.
68. DOKUMEN TURUNAN

PRD ini diturunkan menjadi:

02_SYSTEM_ARCHITECTURE.md
03_DATABASE_SCHEMA.md
04_RBAC_AND_SECURITY.md
05_WORKFLOW.md
06_UI_UX_DESIGN_SYSTEM.md
07_AI_DEVELOPMENT_RULES.md
08_SMART_OFFICE.md
09_PUBLIC_SERVICES.md
10_PEKPPP.md
11_DOCUMENT_MANAGEMENT.md
12_NOTIFICATION_SYSTEM.md
13_AUDIT_AND_ACTIVITY_LOG.md
14_REPORTING_AND_DASHBOARD.md
15_TESTING_STRATEGY.md
16_DEPLOYMENT_AND_DEVOPS.md
17_ROADMAP.md

Dokumen turunan tidak boleh bertentangan dengan PRD tanpa perubahan
yang terdokumentasi.

69. CHANGE MANAGEMENT

Perubahan requirement harus:

Diidentifikasi.
Dijelaskan alasannya.
Ditentukan dampaknya.
Diperbarui pada dokumentasi.
Diperiksa terhadap database dan workflow.
Baru kemudian diimplementasikan.

AI coding agent tidak boleh mengambil keputusan perubahan bisnis
secara sepihak.

70. PRODUCT BASELINE

Baseline produk:

E-KANJOLI v1.0

Definisi:

E-KANJOLI adalah platform Smart Office dan Pelayanan Publik
terintegrasi Bappeda & Litbang Kabupaten Banggai Kepulauan yang
menggabungkan administrasi surat, e-Disposisi, perjalanan dinas,
aset, arsip, RENJA, RKPD, sepuluh layanan publik, PEKPPP,
notifikasi, audit trail, dashboard pimpinan, dan reporting dalam
satu sistem dengan keamanan berbasis role dan database-level access
control.