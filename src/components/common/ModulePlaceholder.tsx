import type { LucideIcon } from 'lucide-react'

type ModulePlaceholderProps = {
  title: string
  description: string
  icon: LucideIcon
}

export function ModulePlaceholder({
  title,
  description,
  icon: Icon,
}: ModulePlaceholderProps) {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Icon size={19} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {title}
            </h1>

            <p className="text-sm text-slate-500">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-slate-700">
          Modul {title}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Halaman modul sudah tersedia dan siap dikembangkan.
        </p>
      </div>
    </div>
  )
}
