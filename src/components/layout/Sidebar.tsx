import { Building2 } from 'lucide-react'
import { SidebarNav } from '../navigation/SidebarNav'

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
          <Building2 size={19} />
        </div>

        <div>
          <div className="text-sm font-bold tracking-tight text-slate-900">
            E-KANJOLI
          </div>

          <div className="text-[10px] text-slate-400">
            Smart Office
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <SidebarNav />
      </div>

      <div className="border-t border-slate-200 p-4">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-medium text-slate-700">
            Bappeda & Litbang
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            Kabupaten Banggai Kepulauan
          </p>
        </div>
      </div>
    </aside>
  )
}