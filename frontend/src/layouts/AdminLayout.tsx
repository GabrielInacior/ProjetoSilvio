import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, CalendarRange,
  Newspaper, Package, CalendarDays, LogOut
} from 'lucide-react'

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

export default function AdminLayout() {
  const { usuario, logout } = useAuthStore()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="px-6 py-5 border-b border-gray-700">
          <h1 className="text-xl font-bold">Inovatech</h1>
          <p className="text-gray-400 text-xs mt-0.5">Admin</p>
        </div>
        <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto">
          {nav.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`
              }
            >
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-gray-700">
          <p className="text-xs text-gray-400 truncate">{usuario?.nome}</p>
          <button onClick={() => { logout(); navigate('/login') }}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-xs mt-2 transition-colors"
          >
            <LogOut size={14} /> Sair
          </button>
        </div>
      </aside>
      <div className="flex-1 overflow-auto p-8">
        <Outlet />
      </div>
    </div>
  )
}
