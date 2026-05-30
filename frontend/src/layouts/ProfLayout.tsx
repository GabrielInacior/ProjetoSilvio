import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { LayoutDashboard, BookOpen, ShoppingBag, User, LogOut, ShoppingCart, Package } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'

const nav = [
  { to: '/prof/dashboard', label: 'Dashboard',    Icon: LayoutDashboard },
  { to: '/prof/turmas',    label: 'Turmas',        Icon: BookOpen },
  { to: '/loja',           label: 'Loja',          Icon: ShoppingBag },
  { to: '/prof/pedidos',   label: 'Meus Pedidos',  Icon: Package },
  { to: '/prof/perfil',    label: 'Meu Perfil',    Icon: User },
]

export default function ProfLayout() {
  const { usuario, logout } = useAuthStore()
  const { items } = useCartStore()
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
          <p className="text-xs text-emerald-300 truncate mb-2">{usuario?.nome}</p>
          <div className="flex items-center gap-3">
            <Link to="/carrinho" className="relative text-emerald-300 hover:text-white">
              <ShoppingCart size={18} />
              {items.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {items.length}
                </span>
              )}
            </Link>
            <button onClick={() => { logout(); navigate('/login') }}
              className="flex items-center gap-2 text-emerald-300 hover:text-white text-xs transition-colors"
            >
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-8 py-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">Bem-vindo, Prof. <strong>{usuario?.nome?.split(' ')[0]}</strong></span>
          <div className="flex items-center gap-4">
            <Link to="/carrinho" className="relative text-gray-500 hover:text-gray-700">
              <ShoppingCart size={20} />
              {items.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {items.length}
                </span>
              )}
            </Link>
            <span className="text-sm text-gray-600">{usuario?.email}</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
