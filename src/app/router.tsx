import { createBrowserRouter } from 'react-router-dom'

import { ProtectedRoute } from '../features/auth/ProtectedRoute'
import { AppShell } from '../components/layout/AppShell'

import { DashboardPage } from '../pages/DashboardPage'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { UnauthorizedPage } from '../pages/UnauthorizedPage'

import { SuratMasukPage } from '../pages/smart-office/SuratMasukPage'
import { SuratKeluarPage } from '../pages/smart-office/SuratKeluarPage'
import { DisposisiPage } from '../pages/smart-office/DisposisiPage'
import { SptPage } from '../pages/smart-office/SptPage'
import { SpdPage } from '../pages/smart-office/SpdPage'
import { LaporanPerjalananPage } from '../pages/smart-office/LaporanPerjalananPage'
import { AsetPage } from '../pages/smart-office/AsetPage'
import { RenjaPage } from '../pages/smart-office/RenjaPage'
import { RkpdPage } from '../pages/smart-office/RkpdPage'

import { PerencanaanPage } from '../pages/layanan/PerencanaanPage'
import { LitbangPage } from '../pages/layanan/LitbangPage'
import { PpidPage } from '../pages/layanan/PpidPage'

import { PekpppPage } from '../pages/pekppp/PekpppPage'

import { NotifikasiPage } from '../pages/monitoring/NotifikasiPage'
import { AktivitasPage } from '../pages/monitoring/AktivitasPage'

import { PenggunaPage } from '../pages/admin/PenggunaPage'
import { AuditLogPage } from '../pages/admin/AuditLogPage'

const ALL_ROLES = [
  'superadmin',
  'admin_pekppp',
  'admin_perencanaan',
  'admin_litbang',
  'admin_sekretariat',
  'pimpinan',
] as const

const SMART_OFFICE_ROLES = [
  'superadmin',
  'admin_sekretariat',
  'pimpinan',
] as const

const PERENCANAAN_ROLES = [
  'superadmin',
  'admin_perencanaan',
  'pimpinan',
] as const

const LITBANG_ROLES = [
  'superadmin',
  'admin_litbang',
  'pimpinan',
] as const

const PEKPPP_ROLES = [
  'superadmin',
  'admin_pekppp',
  'pimpinan',
] as const

const MONITORING_ROLES = ALL_ROLES

const ADMIN_ROLES = [
  'superadmin',
] as const

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },

  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },

          // SMART OFFICE
          {
            element: (
              <ProtectedRoute
                allowedRoles={[...SMART_OFFICE_ROLES]}
              />
            ),
            children: [
              {
                path: 'smart-office/surat-masuk',
                element: <SuratMasukPage />,
              },
              {
                path: 'smart-office/surat-keluar',
                element: <SuratKeluarPage />,
              },
              {
                path: 'smart-office/disposisi',
                element: <DisposisiPage />,
              },
              {
                path: 'smart-office/perjalanan/spt',
                element: <SptPage />,
              },
              {
                path: 'smart-office/perjalanan/spd',
                element: <SpdPage />,
              },
              {
                path: 'smart-office/perjalanan/laporan',
                element: <LaporanPerjalananPage />,
              },
              {
                path: 'smart-office/aset',
                element: <AsetPage />,
              },
              {
                path: 'smart-office/arsip/renja',
                element: <RenjaPage />,
              },
              {
                path: 'smart-office/arsip/rkpd',
                element: <RkpdPage />,
              },
            ],
          },

          // LAYANAN PUBLIK - PERENCANAAN
          {
            element: (
              <ProtectedRoute
                allowedRoles={[...PERENCANAAN_ROLES]}
              />
            ),
            children: [
              {
                path: 'layanan/perencanaan',
                element: <PerencanaanPage />,
              },
            ],
          },

          // LAYANAN PUBLIK - LITBANG
          {
            element: (
              <ProtectedRoute
                allowedRoles={[...LITBANG_ROLES]}
              />
            ),
            children: [
              {
                path: 'layanan/litbang',
                element: <LitbangPage />,
              },
            ],
          },

          // LAYANAN PUBLIK - PPID
          {
            element: (
              <ProtectedRoute
                allowedRoles={[...SMART_OFFICE_ROLES]}
              />
            ),
            children: [
              {
                path: 'layanan/ppid',
                element: <PpidPage />,
              },
            ],
          },

          // PEKPPP
          {
            element: (
              <ProtectedRoute
                allowedRoles={[...PEKPPP_ROLES]}
              />
            ),
            children: [
              {
                path: 'pekppp',
                element: <PekpppPage />,
              },
            ],
          },

          // MONITORING
          {
            element: (
              <ProtectedRoute
                allowedRoles={[...MONITORING_ROLES]}
              />
            ),
            children: [
              {
                path: 'notifikasi',
                element: <NotifikasiPage />,
              },
              {
                path: 'aktivitas',
                element: <AktivitasPage />,
              },
            ],
          },

          // ADMINISTRASI
          {
            element: (
              <ProtectedRoute
                allowedRoles={[...ADMIN_ROLES]}
              />
            ),
            children: [
              {
                path: 'admin/pengguna',
                element: <PenggunaPage />,
              },
              {
                path: 'admin/audit-log',
                element: <AuditLogPage />,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    path: '*',
    element: <NotFoundPage />,
  },
])
