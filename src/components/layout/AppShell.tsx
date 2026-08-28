import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onClose={closeMobileSidebar}
        onToggleCollapse={() =>
          setSidebarCollapsed((value) => !value)
        }
      />

      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <Topbar
        sidebarCollapsed={sidebarCollapsed}
        onMenuClick={() =>
          setMobileSidebarOpen(true)
        }
      />

      <div
        className={`
          min-h-screen pt-16
          transition-[margin] duration-300
          ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}
        `}
      >
        <main className="min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
