import {
  Bell,
  ChevronDown,
  Menu,
} from 'lucide-react'
import { MOCK_USER } from '../../config/constants'

export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
      <button
        type="button"
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
      >
        <Menu size={20} />
      </button>

      <div className="hidden lg:block">
        <p className="text-sm font-medium text-slate-700">
          Smart Office & Pelayanan Publik
        </p>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          <Bell size={19} />

          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        <button
          type="button"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            AS
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold text-slate-800">
              {MOCK_USER.fullName}
            </p>

            <p className="text-[10px] text-slate-400">
              Admin Sekretariat
            </p>
          </div>

          <ChevronDown
            size={15}
            className="text-slate-400"
          />
        </button>
      </div>
    </header>
  )
}