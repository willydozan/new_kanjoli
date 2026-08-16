-- E-KANJOLI 001_initial_data.sql
-- Canonical model: Dokumen/Permohonan -> Klasifikasi -> Domain Layanan
-- -> Jenis Layanan -> Unit Pelaksana -> Routing -> Disposisi -> Pegawai
-- -> Workflow -> Notification -> Penyelesaian -> Laporan -> Arsip

begin;

insert into public.organization_units(code,name,unit_type) values
('BAPPEDA_LITBANG','Bappeda dan Litbang','organization'),
('SEKRETARIAT','Sekretariat','domain_unit'),
('PERENCANAAN','Bidang Perencanaan','domain_unit'),
('BIDANG_PERENCANAAN_MAKRO','Bidang Perencanaan Makro','implementing_unit'),
('BIDANG_PERENCANAAN_SOSBUD','Bidang Perencanaan Sosial Budaya','implementing_unit'),
('BIDANG_PERENCANAAN_EKONOMI','Bidang Perencanaan Ekonomi','implementing_unit'),
('BIDANG_PERENCANAAN_FISPRAS','Bidang Perencanaan Fisik dan Prasarana','implementing_unit'),
('BIDANG_LITBANG','Bidang Penelitian dan Pengembangan','domain_unit')
on conflict(code) do update set name=excluded.name,unit_type=excluded.unit_type;

update public.organization_units c set parent_unit_id=p.id from public.organization_units p
where c.code in ('SEKRETARIAT','PERENCANAAN','BIDANG_LITBANG') and p.code='BAPPEDA_LITBANG';
update public.organization_units c set parent_unit_id=p.id from public.organization_units p
where c.code in ('BIDANG_PERENCANAAN_MAKRO','BIDANG_PERENCANAAN_SOSBUD','BIDANG_PERENCANAAN_EKONOMI','BIDANG_PERENCANAAN_FISPRAS') and p.code='PERENCANAAN';

insert into public.positions(code,name,level,is_leadership) values
('KEPALA_BADAN','Kepala Badan',100,true),('SEKRETARIS','Sekretaris',90,true),
('KEPALA_BIDANG','Kepala Bidang',80,true),('KEPALA_SUBBAG','Kepala Subbagian',70,true),
('PEGAWAI','Pegawai',50,false)
on conflict(code) do update set name=excluded.name,level=excluded.level,is_leadership=excluded.is_leadership;

insert into public.roles(code,name,description) values
('superadmin','Superadmin','Pengelola teknis sistem'),
('pimpinan','Pimpinan','Kepala Badan/pimpinan'),
('sekretaris','Sekretaris','Sekretaris organisasi'),
('kepala_bidang','Kepala Bidang','Kepala unit pelaksana'),
('kepala_subbag','Kepala Subbag','Kepala subbagian'),
('pegawai','Pegawai','Pelaksana'),
('admin_perencanaan','Admin Perencanaan','Admin domain Perencanaan'),
('admin_litbang','Admin Litbang','Admin domain Litbang'),
('admin_sekretariat','Admin Sekretariat','Admin domain Sekretariat'),
('admin_pekppp','Admin PEKPPP','Admin PEKPPP')
on conflict(code) do update set name=excluded.name,description=excluded.description;

insert into public.permissions(code,name,resource,action,description) values
('dashboard.view','View dashboard','dashboard','view','Melihat dashboard'),
('employee.view','View employees','employee','view','Melihat pegawai'),
('employee.manage','Manage employees','employee','manage','Mengelola pegawai'),
('document.view','View documents','document','view','Melihat dokumen'),
('document.manage','Manage documents','document','manage','Mengelola dokumen/arsip'),
('service.view','View services','service','view','Melihat layanan'),
('service.manage','Manage services','service','manage','Mengelola domain, jenis layanan dan routing'),
('routing.create','Create routing','routing','create','Membuat routing'),
('routing.manage','Manage routing','routing','manage','Mengelola routing'),
('disposition.create','Create dispositions','disposition','create','Membuat disposisi'),
('disposition.execute','Execute dispositions','disposition','execute','Melaksanakan disposisi'),
('task.view','View tasks','task','view','Melihat tugas'),
('task.create','Create tasks','task','create','Membuat tugas'),
('task.assign','Assign tasks','task','assign','Menugaskan pekerjaan'),
('task.update','Update tasks','task','update','Memperbarui tugas'),
('task.approve','Approve tasks','task','approve','Memverifikasi tugas'),
('workflow.view','View workflow','workflow','view','Melihat workflow'),
('workflow.manage','Manage workflow','workflow','manage','Mengelola workflow'),
('notification.view','View notifications','notification','view','Melihat notifikasi'),
('notification.manage','Manage notifications','notification','manage','Mengelola notifikasi'),
('report.view','View reports','report','view','Melihat laporan'),
('report.manage','Manage reports','report','manage','Mengelola laporan'),
('audit.view','View audit','audit','view','Melihat audit trail'),
('pekppp.view','View PEKPPP','pekppp','view','Melihat PEKPPP'),
('pekppp.manage','Manage PEKPPP','pekppp','manage','Mengelola PEKPPP')
on conflict(code) do update set name=excluded.name,resource=excluded.resource,action=excluded.action,description=excluded.description;

insert into public.role_permissions(role_id,permission_id)
select r.id,p.id from public.roles r cross join public.permissions p where r.code='superadmin' on conflict do nothing;
insert into public.role_permissions(role_id,permission_id)
select r.id,p.id from public.roles r join public.permissions p on p.code in
('dashboard.view','employee.view','document.view','document.manage','service.view','routing.create','routing.manage','disposition.create','disposition.execute','task.view','task.create','task.assign','task.update','task.approve','workflow.view','notification.view','report.view','audit.view')
where r.code in('pimpinan','sekretaris','kepala_bidang') on conflict do nothing;
insert into public.role_permissions(role_id,permission_id)
select r.id,p.id from public.roles r join public.permissions p on p.code in
('dashboard.view','document.view','service.view','disposition.execute','task.view','task.update','workflow.view','notification.view')
where r.code in('kepala_subbag','pegawai') on conflict do nothing;
insert into public.role_permissions(role_id,permission_id)
select r.id,p.id from public.roles r join public.permissions p on p.code in
('dashboard.view','document.view','document.manage','service.view','service.manage','routing.create','routing.manage','disposition.create','disposition.execute','task.view','task.create','task.assign','task.update','workflow.view','notification.view','report.view','report.manage')
where r.code in('admin_perencanaan','admin_litbang','admin_sekretariat') on conflict do nothing;
insert into public.role_permissions(role_id,permission_id)
select r.id,p.id from public.roles r join public.permissions p on p.code in
('dashboard.view','document.view','service.view','workflow.view','notification.view','report.view','pekppp.view','pekppp.manage')
where r.code='admin_pekppp' on conflict do nothing;

insert into public.document_classifications(code,name,description,default_priority) values
('PERMOHONAN_DATA','Permohonan Data','Permohonan data/informasi untuk pekerjaan atau perencanaan','normal'),
('DOKUMEN_PERENCANAAN','Dokumen Perencanaan','Dokumen dan surat proses perencanaan daerah','normal'),
('KAJIAN_LITBANG','Kajian/Penelitian','Kajian, penelitian dan rekomendasi','normal'),
('INOVASI_DAERAH','Inovasi Daerah','Pengembangan dan evaluasi inovasi daerah','normal'),
('INFORMASI_PUBLIK','Informasi Publik','Permohonan informasi publik/PPID','normal'),
('ADMINISTRASI_INTERNAL','Administrasi Internal','Administrasi internal organisasi','normal'),
('PERJALANAN_DINAS','Perjalanan Dinas','Dokumen perjalanan dinas','normal')
on conflict(code) do update set name=excluded.name,description=excluded.description,default_priority=excluded.default_priority;

insert into public.service_domains(code,name,description,owning_unit_id)
select v.code,v.name,v.description,u.id from (values
('PERENCANAAN','Layanan Bidang Perencanaan','Satu domain Perencanaan dengan empat bidang sebagai unit pelaksana.','PERENCANAAN'),
('LITBANG','Layanan Bidang Penelitian dan Pengembangan','Penelitian, kajian, data, inovasi, publikasi dan rekomendasi.','BIDANG_LITBANG'),
('SEKRETARIAT','Layanan Sekretariat','Administrasi umum, kepegawaian, aset/keuangan, persuratan dan PPID.','SEKRETARIAT')
) v(code,name,description,unit_code) join public.organization_units u on u.code=v.unit_code
on conflict(code) do update set name=excluded.name,description=excluded.description,owning_unit_id=excluded.owning_unit_id;

insert into public.service_types(domain_id,code,name,description,classification_id,default_unit_id,target_days)
select d.id,v.code,v.name,v.description,c.id,u.id,v.days from (values
('PERENCANAAN','PERENCANAAN_RKPD','Layanan RKPD','Penyusunan, sinkronisasi dan pengolahan data RKPD.','DOKUMEN_PERENCANAAN','PERENCANAAN',10),
('PERENCANAAN','PERENCANAAN_RPJPD','Layanan RPJPD','Penyusunan dan pemutakhiran RPJPD.','DOKUMEN_PERENCANAAN','PERENCANAAN',15),
('PERENCANAAN','PERENCANAAN_RPJMD','Layanan RPJMD','Penyusunan dan pemutakhiran RPJMD.','DOKUMEN_PERENCANAAN','PERENCANAAN',15),
('PERENCANAAN','PERENCANAAN_RENSTRA_RENJA','Layanan Renstra dan Renja','Penyusunan dan pemutakhiran Renstra/Renja.','DOKUMEN_PERENCANAAN','PERENCANAAN',10),
('PERENCANAAN','PERENCANAAN_DATA_ANALISIS','Layanan Data dan Analisis Perencanaan','Permintaan data, analisis dan bahan perencanaan.','PERMOHONAN_DATA','PERENCANAAN',7),
('LITBANG','LITBANG_PENELITIAN_KAJIAN','Layanan Penelitian dan Kajian','Penelitian, kajian dan rekomendasi.','KAJIAN_LITBANG','BIDANG_LITBANG',15),
('LITBANG','LITBANG_INOVASI','Layanan Inovasi Daerah','Fasilitasi, pengembangan dan evaluasi inovasi.','INOVASI_DAERAH','BIDANG_LITBANG',10),
('LITBANG','LITBANG_DATA','Layanan Data Litbang','Data hasil penelitian dan pengembangan.','PERMOHONAN_DATA','BIDANG_LITBANG',7),
('LITBANG','LITBANG_PUBLIKASI','Layanan Publikasi Litbang','Publikasi hasil penelitian/pengembangan.','KAJIAN_LITBANG','BIDANG_LITBANG',7),
('SEKRETARIAT','SEKRETARIAT_PERSURATAN','Layanan Persuratan dan Administrasi','Surat masuk/keluar dan administrasi umum.','ADMINISTRASI_INTERNAL','SEKRETARIAT',5),
('SEKRETARIAT','SEKRETARIAT_KEPEGAWAIAN','Layanan Kepegawaian','Administrasi kepegawaian.','ADMINISTRASI_INTERNAL','SEKRETARIAT',7),
('SEKRETARIAT','SEKRETARIAT_ASET_KEUANGAN','Layanan Aset dan Keuangan','Administrasi aset dan keuangan.','ADMINISTRASI_INTERNAL','SEKRETARIAT',7),
('SEKRETARIAT','SEKRETARIAT_PPID','Layanan Informasi Publik/PPID','Permohonan informasi publik.','INFORMASI_PUBLIK','SEKRETARIAT',10)
) v(domain_code,code,name,description,class_code,unit_code,days)
join public.service_domains d on d.code=v.domain_code join public.document_classifications c on c.code=v.class_code join public.organization_units u on u.code=v.unit_code
on conflict(code) do update set domain_id=excluded.domain_id,name=excluded.name,description=excluded.description,classification_id=excluded.classification_id,default_unit_id=excluded.default_unit_id,target_days=excluded.target_days;

-- Routing defaults. Perencanaan is one domain; its four fields are implementing units.
insert into public.routing_rules(service_domain_id,service_type_id,target_unit_id,target_role_code,rule_name,priority_order)
select d.id,s.id,u.id,'kepala_bidang',v.rule_name,v.ord from (values
('PERENCANAAN','PERENCANAAN_RPJPD','BIDANG_PERENCANAAN_MAKRO','RPJPD -> Perencanaan Makro',10),
('PERENCANAAN','PERENCANAAN_RPJMD','BIDANG_PERENCANAAN_MAKRO','RPJMD -> Perencanaan Makro',10),
('PERENCANAAN','PERENCANAAN_RKPD','PERENCANAAN','RKPD -> Domain Perencanaan; refinement by routing engine',20),
('PERENCANAAN','PERENCANAAN_RENSTRA_RENJA','PERENCANAAN','Renstra/Renja -> Domain Perencanaan; refinement by routing engine',20),
('PERENCANAAN','PERENCANAAN_DATA_ANALISIS','PERENCANAAN','Data/Analisis -> Domain Perencanaan; refinement by routing engine',30),
('LITBANG','LITBANG_PENELITIAN_KAJIAN','BIDANG_LITBANG','Penelitian/Kajian -> Litbang',10),
('LITBANG','LITBANG_INOVASI','BIDANG_LITBANG','Inovasi -> Litbang',10),
('LITBANG','LITBANG_DATA','BIDANG_LITBANG','Data Litbang -> Litbang',10),
('LITBANG','LITBANG_PUBLIKASI','BIDANG_LITBANG','Publikasi -> Litbang',10),
('SEKRETARIAT','SEKRETARIAT_PERSURATAN','SEKRETARIAT','Persuratan -> Sekretariat',10),
('SEKRETARIAT','SEKRETARIAT_KEPEGAWAIAN','SEKRETARIAT','Kepegawaian -> Sekretariat',10),
('SEKRETARIAT','SEKRETARIAT_ASET_KEUANGAN','SEKRETARIAT','Aset/Keuangan -> Sekretariat',10),
('SEKRETARIAT','SEKRETARIAT_PPID','SEKRETARIAT','PPID -> Sekretariat',10)
) v(domain_code,service_code,unit_code,rule_name,ord)
join public.service_domains d on d.code=v.domain_code join public.service_types s on s.code=v.service_code join public.organization_units u on u.code=v.unit_code
on conflict do nothing;

insert into public.workflow_definitions(code,name,description) values
('STANDARD_DOCUMENT','Workflow Dokumen Standar','Dokumen -> Klasifikasi -> Domain -> Jenis Layanan -> Unit Pelaksana -> Routing -> Disposisi -> Pegawai -> Workflow -> Notification -> Penyelesaian -> Laporan -> Arsip'),
('PUBLIC_SERVICE','Workflow Permohonan Layanan','Permohonan -> Klasifikasi -> Domain -> Jenis Layanan -> Unit Pelaksana -> Routing -> Pegawai -> Workflow -> Notification -> Penyelesaian -> Laporan -> Arsip')
on conflict(code) do update set name=excluded.name,description=excluded.description;

insert into public.workflow_steps(workflow_id,step_code,step_name,step_order,responsible_role_code,requires_disposition,requires_verification,creates_notification,is_terminal)
select w.id,v.step_code,v.step_name,v.ord,v.role_code,v.disp,v.verify,v.notify,v.terminal
from public.workflow_definitions w cross join (values
('STANDARD_DOCUMENT','CLASSIFICATION','Klasifikasi',10,'admin_sekretariat',false,false,false,false),
('STANDARD_DOCUMENT','SERVICE_DOMAIN','Domain Layanan',20,'admin_sekretariat',false,false,false,false),
('STANDARD_DOCUMENT','SERVICE_TYPE','Jenis Layanan',30,'admin_sekretariat',false,false,false,false),
('STANDARD_DOCUMENT','IMPLEMENTING_UNIT','Unit Pelaksana',35,'admin_sekretariat',false,false,false,false),
('STANDARD_DOCUMENT','ROUTING','Routing',40,'admin_sekretariat',false,false,true,false),
('STANDARD_DOCUMENT','DISPOSITION','Disposisi',50,'kepala_bidang',true,false,true,false),
('STANDARD_DOCUMENT','EXECUTION','Pelaksanaan Pegawai',60,'pegawai',false,false,true,false),
('STANDARD_DOCUMENT','VERIFICATION','Verifikasi',70,'kepala_bidang',false,true,true,false),
('STANDARD_DOCUMENT','RESOLUTION','Penyelesaian',80,'kepala_bidang',false,false,true,false),
('STANDARD_DOCUMENT','REPORTING','Laporan',90,'admin_sekretariat',false,false,false,false),
('STANDARD_DOCUMENT','ARCHIVE','Arsip',100,'admin_sekretariat',false,false,false,true),
('PUBLIC_SERVICE','CLASSIFICATION','Klasifikasi',10,'admin_sekretariat',false,false,false,false),
('PUBLIC_SERVICE','SERVICE_DOMAIN','Domain Layanan',20,'admin_sekretariat',false,false,false,false),
('PUBLIC_SERVICE','SERVICE_TYPE','Jenis Layanan',30,'admin_sekretariat',false,false,false,false),
('PUBLIC_SERVICE','IMPLEMENTING_UNIT','Unit Pelaksana',35,'admin_sekretariat',false,false,false,false),
('PUBLIC_SERVICE','ROUTING','Routing',40,'admin_sekretariat',false,false,true,false),
('PUBLIC_SERVICE','EXECUTION','Pelaksanaan',50,'pegawai',false,false,true,false),
('PUBLIC_SERVICE','VERIFICATION','Verifikasi',60,'kepala_bidang',false,true,true,false),
('PUBLIC_SERVICE','RESOLUTION','Penyelesaian',70,'kepala_bidang',false,false,true,false),
('PUBLIC_SERVICE','REPORTING','Laporan',80,'admin_sekretariat',false,false,false,false),
('PUBLIC_SERVICE','ARCHIVE','Arsip',90,'admin_sekretariat',false,false,false,true)
) v(workflow_code,step_code,step_name,ord,role_code,disp,verify,notify,terminal)
where w.code=v.workflow_code
on conflict(workflow_id,step_code) do update set step_name=excluded.step_name,step_order=excluded.step_order,responsible_role_code=excluded.responsible_role_code,requires_disposition=excluded.requires_disposition,requires_verification=excluded.requires_verification,creates_notification=excluded.creates_notification,is_terminal=excluded.is_terminal;

insert into public.notification_templates(code,name,channel,subject_template,body_template) values
('ROUTING_ASSIGNED_APP','Routing Baru','in_app','Routing Baru E-KANJOLI','Ada dokumen/permohonan baru yang dirouting kepada Anda.'),
('DISPOSITION_RECEIVED_APP','Disposisi Baru','in_app','Disposisi Baru E-KANJOLI','Anda menerima disposisi baru.'),
('WORKFLOW_ACTION_APP','Perubahan Workflow','in_app','Perubahan Workflow E-KANJOLI','Status dokumen/permohonan berubah.'),
('ROUTING_ASSIGNED_WA','Routing Baru WhatsApp','whatsapp','Routing Baru E-KANJOLI','Ada dokumen/permohonan baru yang memerlukan perhatian Anda. Silakan periksa E-KANJOLI.'),
('DISPOSITION_RECEIVED_WA','Disposisi Baru WhatsApp','whatsapp','Disposisi Baru E-KANJOLI','Anda menerima disposisi baru. Silakan periksa E-KANJOLI.'),
('WORKFLOW_ACTION_WA','Perubahan Workflow WhatsApp','whatsapp','Perubahan Workflow E-KANJOLI','Ada perubahan status pada dokumen/permohonan yang menjadi tanggung jawab Anda.')
on conflict(code) do update set name=excluded.name,channel=excluded.channel,subject_template=excluded.subject_template,body_template=excluded.body_template;

commit;
