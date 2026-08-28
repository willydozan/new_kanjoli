import {
  Bell,
  Check,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../features/auth/AuthProvider'

type TopbarProps = {
  sidebarCollapsed: boolean
  onMenuClick: () => void
}

type OpenPanel = 'search' | 'notifications' | 'profile' | null

export function Topbar({
  sidebarCollapsed,
  onMenuClick,
}: TopbarProps) {
  const [openPanel, setOpenPanel] =
    useState<OpenPanel>(null)
  const { profile } = useAuth()
  const displayName = profile?.fullName ?? 'Pengguna'
  const displayEmail = profile?.email ?? ''
  const displayRole = profile?.role
    ? profile.role.replace(/_/g, ' ')
    : 'Pengguna'
  const initials =
    displayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name[0]?.toUpperCase())
      .join('') || 'U'

  const searchRef = useRef<HTMLDivElement>(null)
  const notificationRef =
    useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node

      const clickedInside =
        searchRef.current?.contains(target) ||
        notificationRef.current?.contains(target) ||
        profileRef.current?.contains(target)

      if (!clickedInside) {
        setOpenPanel(null)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenPanel(null)
      }
    }

    document.addEventListener(
      'mousedown',
      handleOutsideClick,
    )

    document.addEventListener(
      'keydown',
      handleEscape,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick,
      )

      document.removeEventListener(
        'keydown',
        handleEscape,
      )
    }
  }, [])

  const togglePanel = (panel: OpenPanel) => {
    setOpenPanel((current) =>
      current === panel ? null : panel,
    )
  }

  return (
    <header
      className={`
        fixed top-0 right-0 z-30
        flex h-16 items-center
        border-b border-slate-200
        bg-white/95 px-4
        backdrop-blur-xl
        transition-[left] duration-300
        lg:px-6
        ${
          sidebarCollapsed
            ? 'lg:left-20'
            : 'lg:left-72'
        }
      `}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Buka menu"
          className="
            flex h-10 w-10 shrink-0 items-center
            justify-center rounded-xl
            border border-slate-200
            bg-slate-50
            text-slate-500
            transition
            hover:border-slate-300
            hover:bg-white
            hover:text-slate-900
            lg:hidden
          "
        >
          <Menu size={20} />
        </button>

        <div className="hidden min-w-0 lg:block">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
            E-KANJOLI
          </p>

          <p className="truncate text-xs font-semibold text-slate-700">
            Smart Office & Pelayanan Publik
          </p>
        </div>
      </div>

      <div className="relative flex items-center gap-2 sm:gap-3">
        <div
          ref={searchRef}
          className="relative hidden sm:block"
        >
          <button
            type="button"
            aria-label="Pencarian"
            aria-expanded={openPanel === 'search'}
            onClick={() => togglePanel('search')}
            className="
              flex h-9 w-[220px]
              items-center gap-2
              rounded-xl
              border border-slate-200
              bg-slate-50
              px-3
              text-left
              text-xs
              text-slate-400
              transition
              hover:border-slate-300
              hover:bg-white
              hover:text-slate-600
            "
          >
            <Search
              size={15}
              className="shrink-0"
            />

            <span className="min-w-0 flex-1 truncate">
              Cari sesuatu...
            </span>

            <kbd
              className="
                shrink-0 rounded-md
                border border-slate-200
                bg-white px-1.5 py-0.5
                text-[9px] font-medium
                text-slate-400
              "
            >
              Ctrl K
            </kbd>
          </button>

          {openPanel === 'search' && (
            <div
              className="
                absolute right-0 top-12
                z-50 w-[340px]
                overflow-hidden
                rounded-2xl
                border border-slate-200
                bg-white
                shadow-xl
                shadow-slate-950/10
              "
            >
              <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
                <Search
                  size={17}
                  className="text-slate-400"
                />

                <input
                  autoFocus
                  type="text"
                  placeholder="Cari menu, dokumen, layanan..."
                  className="
                    min-w-0 flex-1
                    bg-transparent
                    text-sm
                    text-slate-800
                    outline-none
                    placeholder:text-slate-400
                  "
                />

                <button
                  type="button"
                  onClick={() => setOpenPanel(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="p-3">
                <p className="px-2 pb-2 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Pencarian Cepat
                </p>

                <button
                  type="button"
                  className="
                    flex w-full items-center
                    gap-3 rounded-xl px-3 py-2.5
                    text-left transition
                    hover:bg-slate-50
                  "
                >
                  <Search
                    size={15}
                    className="text-slate-400"
                  />

                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Cari dokumen atau surat
                    </p>

                    <p className="text-[10px] text-slate-400">
                      Surat masuk, surat keluar, arsip
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  className="
                    flex w-full items-center
                    gap-3 rounded-xl px-3 py-2.5
                    text-left transition
                    hover:bg-slate-50
                  "
                >
                  <Settings
                    size={15}
                    className="text-slate-400"
                  />

                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Cari layanan
                    </p>

                    <p className="text-[10px] text-slate-400">
                      Perencanaan, Litbang, PPID
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          ref={notificationRef}
          className="relative"
        >
          <button
            type="button"
            aria-label="Notifikasi"
            aria-expanded={
              openPanel === 'notifications'
            }
            onClick={() =>
              togglePanel('notifications')
            }
            className="
              relative flex h-9 w-9
              items-center justify-center
              rounded-xl
              text-slate-500
              transition
              hover:bg-slate-50
              hover:text-slate-900
            "
          >
            <Bell size={18} />

            <span
              className="
                absolute right-1.5 top-1.5
                h-2 w-2 rounded-full
                bg-emerald-500
                ring-2 ring-white
              "
            />
          </button>

          {openPanel === 'notifications' && (
            <div
              className="
                absolute right-0 top-12
                z-50 w-[340px]
                overflow-hidden
                rounded-2xl
                border border-slate-200
                bg-white
                shadow-xl
                shadow-slate-950/10
              "
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Notifikasi
                  </h3>

                  <p className="text-[10px] text-slate-400">
                    3 pemberitahuan baru
                  </p>
                </div>

                <button
                  type="button"
                  className="
                    flex items-center gap-1
                    rounded-lg px-2 py-1.5
                    text-[10px] font-semibold
                    text-slate-500
                    hover:bg-slate-50
                  "
                >
                  <Check size={13} />
                  Tandai dibaca
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                <NotificationItem
                  title="Surat masuk baru"
                  description="Surat dari Sekretariat Daerah"
                  time="10 menit lalu"
                  unread
                />

                <NotificationItem
                  title="Disposisi menunggu tindak lanjut"
                  description="Disposisi Kepala Badan"
                  time="35 menit lalu"
                  unread
                />

                <NotificationItem
                  title="Dokumen berhasil diarsipkan"
                  description="RENJA Tahun 2026"
                  time="1 jam lalu"
                />
              </div>

              <button
                type="button"
                className="
                  w-full border-t border-slate-100
                  px-4 py-3
                  text-center
                  text-[11px] font-semibold
                  text-slate-500
                  transition
                  hover:bg-slate-50
                  hover:text-slate-900
                "
              >
                Lihat semua notifikasi
              </button>
            </div>
          )}
        </div>

        <div className="h-7 w-px bg-slate-200" />

        <div
          ref={profileRef}
          className="relative"
        >
          <button
            type="button"
            aria-label="Menu pengguna"
            aria-expanded={
              openPanel === 'profile'
            }
            onClick={() => togglePanel('profile')}
            className="
              flex items-center gap-2
              rounded-xl px-1.5 py-1
              transition
              hover:bg-slate-50
            "
          >
            <div
              className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-full bg-slate-950
                text-[10px] font-bold text-white
              "
            >{initials}</div>

            <div className="hidden max-w-[150px] text-left md:block">
              <p className="truncate text-[11px] font-semibold text-slate-800">
                {displayName}
              </p>

              <p className="truncate text-[9px] text-slate-400">
                {displayRole}
              </p>
            </div>

            <ChevronDown
              size={14}
              className={`
                hidden text-slate-400
                transition-transform md:block
                ${
                  openPanel === 'profile'
                    ? 'rotate-180'
                    : ''
                }
              `}
            />
          </button>

          {openPanel === 'profile' && (
            <div
              className="
                absolute right-0 top-12
                z-50 w-[260px]
                overflow-hidden
                rounded-2xl
                border border-slate-200
                bg-white
                shadow-xl
                shadow-slate-950/10
              "
            >
              <div className="border-b border-slate-100 p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex h-11 w-11
                      items-center justify-center
                      rounded-full bg-slate-950
                      text-xs font-bold text-white
                    "
                  >{initials}</div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-900">
                      {displayName}
                    </p>

                    <p className="truncate text-[10px] text-slate-400">
                      {displayEmail}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <ProfileMenuItem
                  icon={User}
                  label="Profil Saya"
                />

                <ProfileMenuItem
                  icon={Settings}
                  label="Pengaturan"
                />
              </div>

              <div className="border-t border-slate-100 p-2">
                <button
                  type="button"
                  className="
                    flex w-full items-center gap-3
                    rounded-xl px-3 py-2.5
                    text-xs font-semibold
                    text-red-600
                    transition
                    hover:bg-red-50
                  "
                >
                  <LogOut size={16} />
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function NotificationItem({
  title,
  description,
  time,
  unread = false,
}: {
  title: string
  description: string
  time: string
  unread?: boolean
}) {
  return (
    <button
      type="button"
      className="
        flex w-full items-start gap-3
        px-4 py-3.5 text-left
        transition hover:bg-slate-50
      "
    >
      <span
        className={`
          mt-1.5 h-2 w-2 shrink-0 rounded-full
          ${
            unread
              ? 'bg-emerald-500'
              : 'bg-slate-200'
          }
        `}
      />

      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-slate-700">
          {title}
        </span>

        <span className="mt-0.5 block truncate text-[10px] text-slate-400">
          {description}
        </span>

        <span className="mt-1 block text-[9px] text-slate-400">
          {time}
        </span>
      </span>
    </button>
  )
}

function ProfileMenuItem({
  icon: Icon,
  label,
}: {
  icon: typeof User
  label: string
}) {
  return (
    <button
      type="button"
      className="
        flex w-full items-center gap-3
        rounded-xl px-3 py-2.5
        text-xs font-medium
        text-slate-600
        transition
        hover:bg-slate-50
        hover:text-slate-900
      "
    >
      <Icon size={16} />
      {label}
    </button>
  )
}




