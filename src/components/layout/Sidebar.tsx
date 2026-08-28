import {
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { SidebarNav } from '../navigation/SidebarNav'

type SidebarProps = {
  collapsed: boolean
  mobileOpen: boolean
  onClose: () => void
  onToggleCollapse: () => void
}

export function Sidebar({
  collapsed,
  mobileOpen,
  onClose,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 flex
        flex-col border-r border-slate-200 bg-white
        shadow-[8px_0_30px_rgba(15,23,42,0.04)]
        transition-[width,transform] duration-300
        ${
          collapsed
            ? 'lg:w-20'
            : 'lg:w-72'
        }
        w-[280px]
        ${
          mobileOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }
      `}
    >
      <div
        className={`
          flex h-16 shrink-0 items-center
          border-b border-slate-100
          ${
            collapsed
              ? 'justify-center px-3'
              : 'gap-3 px-4'
          }
        `}
      >
        <div
          className="
            flex h-10 w-10 shrink-0 items-center
            justify-center rounded-xl bg-slate-950
            text-white shadow-sm
          "
        >
          <Building2 size={20} strokeWidth={1.8} />
        </div>

        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-bold tracking-tight text-slate-950">
              E-KANJOLI
            </p>

            <p className="mt-0.5 truncate text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Smart Government Office
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup menu"
          className="
            flex h-9 w-9 shrink-0 items-center
            justify-center rounded-lg
            text-slate-400 transition
            hover:bg-slate-100 hover:text-slate-900
            lg:hidden
          "
        >
          <ChevronLeft size={19} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-5">
        <SidebarNav
          collapsed={collapsed}
          onNavigate={onClose}
          onExpand={() => {
            if (collapsed) {
              onToggleCollapse()
            }
          }}
        />
      </div>

      <div className="shrink-0 border-t border-slate-100 p-3">
        {!collapsed ? (
          <>
            <div className="rounded-xl bg-slate-50 px-3 py-2.5">
              <p className="truncate text-[11px] font-semibold text-slate-700">
                Bappeda & Litbang
              </p>

              <p className="mt-0.5 truncate text-[9px] text-slate-400">
                Kabupaten Banggai Kepulauan
              </p>
            </div>

            <button
              type="button"
              onClick={onToggleCollapse}
              className="
                mt-2 flex w-full items-center justify-center
                gap-2 rounded-lg px-3 py-2
                text-[10px] font-semibold text-slate-400
                transition hover:bg-slate-50
                hover:text-slate-700
              "
            >
              <ChevronLeft size={14} />
              Perkecil menu
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Perbesar menu"
            title="Perbesar menu"
            className="
              flex h-10 w-full items-center
              justify-center rounded-lg
              text-slate-400 transition
              hover:bg-slate-50 hover:text-slate-700
            "
          >
            <ChevronRight size={17} />
          </button>
        )}
      </div>
    </aside>
  )
}
