import {
  Activity,
  Archive,
  Bell,
  Boxes,
  ClipboardCheck,
  ClipboardList,
  Forward,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Plane,
  Send,
  ShieldCheck,
  Users,
  FlaskConical,
  ChevronDown,
} from 'lucide-react'
import { useState } from 'react'
import { navigation } from '../../config/navigation'
import { MOCK_USER } from '../../config/constants'
import type { NavigationItem } from '../../config/navigation'

const icons = {
  LayoutDashboard,
  Mail,
  Send,
  Forward,
  Plane,
  Boxes,
  Archive,
  ClipboardList,
  FlaskConical,
  MessageSquare,
  ClipboardCheck,
  Bell,
  Activity,
  Users,
  ShieldCheck,
}

function NavigationIcon({ name }: { name?: string }) {
  if (!name) return null

  const Icon = icons[name as keyof typeof icons]

  if (!Icon) return null

  return <Icon size={18} strokeWidth={1.8} />
}

function NavigationItemView({
  item,
}: {
  item: NavigationItem
}) {
  const [open, setOpen] = useState(false)

  const visibleChildren =
    item.children?.filter((child) =>
      child.roles.includes(MOCK_USER.role),
    ) ?? []

  const hasChildren = visibleChildren.length > 0

  if (hasChildren) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <NavigationIcon name={item.icon} />

          <span className="flex-1">
            {item.label}
          </span>

          <ChevronDown
            size={16}
            className={`transition-transform ${
              open ? 'rotate-180' : ''
            }`}
          />
        </button>

        {open && (
          <div className="ml-5 mt-1 space-y-1 border-l border-slate-200 pl-3">
            {visibleChildren.map((child) => (
              <a
                key={child.href}
                href={child.href}
                className="block rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {child.label}
              </a>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <a
      href={item.href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
    >
      <NavigationIcon name={item.icon} />
      <span>{item.label}</span>
    </a>
  )
}

export function SidebarNav() {
  return (
    <nav className="space-y-6">
      {navigation.map((section, sectionIndex) => {
        const visibleItems = section.items.filter((item) =>
          item.roles.includes(MOCK_USER.role),
        )

        if (visibleItems.length === 0) {
          return null
        }

        return (
          <div key={section.title ?? sectionIndex}>
            {section.title && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {section.title}
              </p>
            )}

            <div className="space-y-1">
              {visibleItems.map((item) => (
                <NavigationItemView
                  key={item.href ?? item.label}
                  item={item}
                />
              ))}
            </div>
          </div>
        )
      })}
    </nav>
  )
}