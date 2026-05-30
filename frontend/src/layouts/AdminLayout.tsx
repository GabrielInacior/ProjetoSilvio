import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, CalendarRange,
  Newspaper, Package, CalendarDays, LogOut, Menu, X,
} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

const nav = [
  { to: '/admin/dashboard',   label: 'Dashboard',    Icon: LayoutDashboard },
  { to: '/admin/alunos',      label: 'Alunos',       Icon: Users },
  { to: '/admin/professores', label: 'Professores',  Icon: GraduationCap },
  { to: '/admin/cursos',      label: 'Cursos',       Icon: BookOpen },
  { to: '/admin/disciplinas', label: 'Disciplinas',  Icon: BookOpen },
  { to: '/admin/turmas',      label: 'Turmas',       Icon: CalendarRange },
  { to: '/admin/posts',       label: 'Blog Posts',   Icon: Newspaper },
  { to: '/admin/produtos',    label: 'Produtos',     Icon: Package },
  { to: '/admin/eventos',     label: 'Eventos',      Icon: CalendarDays },
]

function NavItems({ onClose }: { onClose?: () => void }) {
  return (
    <>
      {nav.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onClose}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors rounded-sm mx-2',
              isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
            )
          }
        >
          <Icon size={17} /> {label}
        </NavLink>
      ))}
    </>
  )
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { usuario, logout } = useAuthStore()
  const navigate = useNavigate()
  return (
    <div className="flex h-full flex-col bg-gray-900 text-white">
      <div className="px-6 py-5 border-b border-gray-700 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Inovatech</h1>
          <p className="text-gray-400 text-xs mt-0.5">Admin</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-white lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="space-y-0.5"><NavItems onClose={onClose} /></nav>
      </ScrollArea>
      <div className="px-5 py-4 border-t border-gray-700">
        <p className="text-xs text-gray-400 truncate mb-2">{usuario?.nome}</p>
        <button
          onClick={() => { logout(); navigate('/login'); onClose?.() }}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-xs transition-colors"
        >
          <LogOut size={14} /> Sair
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-3 bg-gray-900 text-white px-4 py-3 border-b border-gray-700">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800 h-8 w-8">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-0">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
        <span className="font-bold text-lg">Inovatech</span>
        <span className="text-gray-400 text-xs">Admin</span>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        <main className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
