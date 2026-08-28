import {
  Activity,
  Archive,
  Bell,
  Boxes,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  FlaskConical,
  Forward,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Plane,
  Send,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { navigation } from '../../config/navigation'
import { useAuth } from '../../features/auth/AuthProvider'
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

function NavigationIcon({
  name,
  active = false,
}: {
  name?: string
  active?: boolean
}) {
  if (!name) return null

  const Icon = icons[name as keyof typeof icons]

  if (!Icon) return null

  return (
    <Icon
      size={18}
      strokeWidth={active ? 2 : 1.8}
    />
  )
}

function NavigationItemView({
  item,
  role,
  collapsed,
  onNavigate,
  onExpand,
}: {
  item: NavigationItem
  role: string
  collapsed: boolean
  onNavigate?: () => void
  onExpand?: () => void
}) {
  const [open, setOpen] = useState(false)

  const visibleChildren =
    item.children?.filter((child) =>
      child.roles.includes(role as never),
    ) ?? []

  const hasChildren = visibleChildren.length > 0

  if (hasChildren) {
    return (
      <div>
        <button
          type="button"
          title={collapsed ? item.label : undefined}
          onClick={() => {
            if (collapsed) {
              onExpand?.()
              setOpen(true)
              return
            }

            setOpen((value) => !value)
          }}
          className={`
            group flex w-full items-center gap-3
            rounded-xl px-3 py-2.5
            text-[13px] font-medium transition
            ${
              open
                ? 'bg-slate-50 text-slate-950'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
            }
            ${collapsed ? 'justify-center px-2' : ''}
          `}
        >
          <span
            className={`
              flex h-8 w-8 shrink-0 items-center
              justify-center rounded-lg
              ${
                open
                  ? 'text-slate-950'
                  : 'text-slate-400 group-hover:text-slate-700'
              }
            `}
          >
            <NavigationIcon name={item.icon} />
          </span>

          {!collapsed && (
            <>
              <span className="min-w-0 flex-1 truncate text-left">
                {item.label}
              </span>

              <ChevronDown
                size={15}
                className={`
                  shrink-0 text-slate-400
                  transition-transform
                  ${open ? 'rotate-180' : ''}
                `}
              />
            </>
          )}
        </button>

        {!collapsed && open && (
          <div className="ml-5 mt-1 space-y-0.5 border-l border-slate-200 pl-3">
            {visibleChildren.map((child) => (
              <NavLink
                key={child.href}
                to={child.href ?? '#'}
                onClick={onNavigate}
                className={({ isActive }) => `
                  block rounded-lg px-3 py-2
                  text-xs font-medium transition
                  ${
                    isActive
                      ? 'bg-slate-100 text-slate-950'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                {child.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <NavLink
      to={item.href ?? '#'}
      end={item.href === '/'}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) => `
        group flex w-full items-center gap-3
        rounded-xl px-3 py-2.5
        text-[13px] font-medium transition
        ${
          isActive
            ? '!bg-slate-950 !text-white shadow-sm shadow-slate-950/15'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
        }
        ${collapsed ? 'justify-center px-2' : ''}
      `}
    >
      {({ isActive }) => (
        <>
          <span
            className={`
              flex h-8 w-8 shrink-0 items-center
              justify-center rounded-lg transition
              ${
                isActive
                  ? '!bg-white/10 !text-white'
                  : 'text-slate-400 group-hover:text-slate-700'
              }
            `}
          >
            <NavigationIcon
              name={item.icon}
              active={isActive}
            />
          </span>

          {!collapsed && (
            <span
              className={`
                min-w-0 flex-1 truncate
                ${isActive ? '!text-white' : 'text-inherit'}
              `}
            >
              {item.label}
            </span>
          )}

          {isActive && !collapsed && (
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
          )}
        </>
      )}
    </NavLink>
  )
}

export function SidebarNav({
  collapsed,
  onNavigate,
  onExpand,
}: {
  collapsed: boolean
  onNavigate?: () => void
  onExpand?: () => void
}) {
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <nav className="space-y-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-11 animate-pulse rounded-xl bg-slate-100"
          />
        ))}
      </nav>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <nav className="space-y-5">
      {navigation.map((section, sectionIndex) => {
        const visibleItems = section.items.filter((item) =>
          item.roles.includes(profile.role),
        )

        if (visibleItems.length === 0) {
          return null
        }

        return (
          <div key={section.title ?? sectionIndex}>
            {section.title && !collapsed && (
              <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                {section.title}
              </p>
            )}

            {collapsed && section.title && (
              <div className="mb-2 h-px bg-slate-100" />
            )}

            <div className="space-y-0.5">
              {visibleItems.map((item) => (
                <NavigationItemView
                  key={item.href ?? item.label}
                  item={item}
                  role={profile.role}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                  onExpand={onExpand}
                />
              ))}
            </div>
          </div>
        )
      })}
    </nav>
  )
}
