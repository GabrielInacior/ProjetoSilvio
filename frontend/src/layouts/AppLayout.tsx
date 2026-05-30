import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useEffect } from 'react'
import { connectWS, disconnectWS } from '@/lib/websocket'
import { toast } from 'sonner'
import {
  LayoutDashboard, BookOpen, BarChart2, Calendar, FileText,
  ShoppingBag, Bell, User, LogOut, ClipboardList, Package, ShoppingCart
} from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'

const nav = [
  { to: '/app/dashboard',  label: 'Dashboard',   Icon: LayoutDashboard },
  { to: '/app/matriculas', label: 'Matrículas',  Icon: ClipboardList },
  { to: '/app/notas',      label: 'Notas',       Icon: BarChart2 },
  { to: '/app/frequencia', label: 'Frequência',  Icon: BookOpen },
  { to: '/app/calendario', label: 'Calendário',  Icon: Calendar },
  { to: '/app/documentos', label: 'Documentos',  Icon: FileText },
  { to: '/loja',           label: 'Loja',        Icon: ShoppingBag },
  { to: '/app/pedidos',    label: 'Meus Pedidos', Icon: Package },
  { to: '/app/perfil',     label: 'Perfil',      Icon: User },
]

export default function AppLayout() {
  const { usuario, accessToken, logout } = useAuthStore()
  const { items } = useCartStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (accessToken) {
      connectWS(accessToken, (msg: unknown) => {
        const n = msg as { titulo: string; mensagem: string }
        toast.info(n.titulo, { description: n.mensagem })
      })
    }
    return () => disconnectWS()
  }, [accessToken])

  const handleLogout = async () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="px-6 py-5 border-b border-blue-800">
          <h1 className="text-xl font-bold">Inovatech</h1>
          <p className="text-blue-300 text-xs mt-0.5">Área do Aluno</p>
        </div>
        <nav className="flex-1 py-4 space-y-0.5">
          {nav.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${isActive ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`
              }
            >
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-blue-800">
          <p className="text-xs text-blue-300 truncate">{usuario?.nome}</p>
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-blue-300 hover:text-white text-xs mt-2 transition-colors"
          >
            <LogOut size={14} /> Sair
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-8 py-4 flex items-center justify-end gap-3">
          <Link to="/carrinho" className="relative text-gray-500 hover:text-blue-700 transition-colors">
            <ShoppingCart size={20} />
            {items.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-blue-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>
          <Bell size={20} className="text-gray-500 cursor-pointer" />
          <span className="text-sm text-gray-600">{usuario?.email}</span>
        </header>
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
