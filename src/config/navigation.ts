import type { UserRole } from '../types/auth'

export type NavigationItem = {
  label: string
  href?: string
  icon?: string
  roles: UserRole[]
  children?: NavigationItem[]
}

export type NavigationSection = {
  title?: string
  items: NavigationItem[]
}

const ALL_ROLES: UserRole[] = [
  'superadmin',
  'admin_pekppp',
  'admin_perencanaan',
  'admin_litbang',
  'admin_sekretariat',
  'pimpinan',
]

export const navigation: NavigationSection[] = [
  {
    items: [
      {
        label: 'Dashboard',
        href: '/',
        icon: 'LayoutDashboard',
        roles: ALL_ROLES,
      },
    ],
  },

  {
    title: 'SMART OFFICE',
    items: [
      {
        label: 'Surat Masuk',
        href: '/smart-office/surat-masuk',
        icon: 'Mail',
        roles: [
          'superadmin',
          'admin_sekretariat',
          'pimpinan',
        ],
      },
      {
        label: 'Surat Keluar',
        href: '/smart-office/surat-keluar',
        icon: 'Send',
        roles: [
          'superadmin',
          'admin_sekretariat',
          'pimpinan',
        ],
      },
      {
        label: 'e-Disposisi',
        href: '/smart-office/disposisi',
        icon: 'Forward',
        roles: [
          'superadmin',
          'admin_sekretariat',
          'pimpinan',
        ],
      },
      {
        label: 'Perjalanan Dinas',
        icon: 'Plane',
        roles: [
          'superadmin',
          'admin_sekretariat',
          'pimpinan',
        ],
        children: [
          {
            label: 'Surat Perintah Tugas',
            href: '/smart-office/perjalanan/spt',
            roles: [
              'superadmin',
              'admin_sekretariat',
              'pimpinan',
            ],
          },
          {
            label: 'Surat Perjalanan Dinas',
            href: '/smart-office/perjalanan/spd',
            roles: [
              'superadmin',
              'admin_sekretariat',
              'pimpinan',
            ],
          },
          {
            label: 'Laporan Perjalanan',
            href: '/smart-office/perjalanan/laporan',
            roles: [
              'superadmin',
              'admin_sekretariat',
              'pimpinan',
            ],
          },
        ],
      },
      {
        label: 'Daftar Aset',
        href: '/smart-office/aset',
        icon: 'Boxes',
        roles: [
          'superadmin',
          'admin_sekretariat',
          'pimpinan',
        ],
      },
      {
        label: 'Arsip Dokumen',
        icon: 'Archive',
        roles: [
          'superadmin',
          'admin_sekretariat',
          'pimpinan',
        ],
        children: [
          {
            label: 'RENJA',
            href: '/smart-office/arsip/renja',
            roles: ALL_ROLES,
          },
          {
            label: 'RKPD',
            href: '/smart-office/arsip/rkpd',
            roles: ALL_ROLES,
          },
        ],
      },
    ],
  },

  {
    title: 'LAYANAN PUBLIK',
    items: [
      {
        label: 'Perencanaan',
        href: '/layanan/perencanaan',
        icon: 'ClipboardList',
        roles: [
          'superadmin',
          'admin_perencanaan',
          'pimpinan',
        ],
      },
      {
        label: 'Litbang',
        href: '/layanan/litbang',
        icon: 'FlaskConical',
        roles: [
          'superadmin',
          'admin_litbang',
          'pimpinan',
        ],
      },
      {
        label: 'PPID & Pengaduan',
        href: '/layanan/ppid',
        icon: 'MessageSquare',
        roles: [
          'superadmin',
          'admin_sekretariat',
          'pimpinan',
        ],
      },
    ],
  },

  {
    title: 'PEKPPP',
    items: [
      {
        label: 'Evaluasi PEKPPP',
        href: '/pekppp',
        icon: 'ClipboardCheck',
        roles: [
          'superadmin',
          'admin_pekppp',
          'pimpinan',
        ],
      },
    ],
  },

  {
    title: 'MONITORING',
    items: [
      {
        label: 'Notifikasi',
        href: '/notifikasi',
        icon: 'Bell',
        roles: ALL_ROLES,
      },
      {
        label: 'Aktivitas',
        href: '/aktivitas',
        icon: 'Activity',
        roles: ALL_ROLES,
      },
    ],
  },

  {
    title: 'ADMINISTRASI',
    items: [
      {
        label: 'Pengguna',
        href: '/admin/pengguna',
        icon: 'Users',
        roles: [
          'superadmin',
        ],
      },
      {
        label: 'Audit Log',
        href: '/admin/audit-log',
        icon: 'ShieldCheck',
        roles: [
          'superadmin',
        ],
      },
    ],
  },
]