import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { LayoutDashboard, BookOpen, Users, LogOut } from 'lucide-react'

const nav = [
  { to: '/prof/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/prof/turmas',    label: 'Turmas',    Icon: BookOpen },
]

export default function ProfLayout() {
  const { usuario, logout } = useAuthStore()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-emerald-900 text-white flex flex-col">
        <div className="px-6 py-5 border-b border-emerald-800">
          <h1 className="text-xl font-bold">Inovatech</h1>
          <p className="text-emerald-300 text-xs mt-0.5">Área do Professor</p>
        </div>
        <nav className="flex-1 py-4 space-y-0.5">
          {nav.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${isActive ? 'bg-emerald-700 text-white' : 'text-emerald-200 hover:bg-emerald-800 hover:text-white'}`
              }
            >
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-emerald-800">
          <p className="text-xs text-emerald-300 truncate">{usuario?.nome}</p>
          <button onClick={() => { logout(); navigate('/login') }}
            className="flex items-center gap-2 text-emerald-300 hover:text-white text-xs mt-2 transition-colors"
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
