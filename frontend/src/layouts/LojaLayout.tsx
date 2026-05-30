import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { connectWS, disconnectWS } from '@/lib/websocket'
import { toast } from 'sonner'
import { useEffect } from 'react'
import {
  LayoutDashboard, BookOpen, ShoppingBag, User, LogOut,
  ShoppingCart, Package, ClipboardList, BarChart2, Calendar,
  FileText, Bell,
} from 'lucide-react'

const alunoNav = [
  { to: '/app/dashboard',  label: 'Dashboard',    Icon: LayoutDashboard },
  { to: '/app/matriculas', label: 'Matrículas',   Icon: ClipboardList },
  { to: '/app/notas',      label: 'Notas',        Icon: BarChart2 },
  { to: '/app/frequencia', label: 'Frequência',   Icon: BookOpen },
  { to: '/app/calendario', label: 'Calendário',   Icon: Calendar },
  { to: '/app/documentos', label: 'Documentos',   Icon: FileText },
  { to: '/loja',           label: 'Loja',         Icon: ShoppingBag },
  { to: '/app/pedidos',    label: 'Meus Pedidos', Icon: Package },
  { to: '/app/perfil',     label: 'Perfil',       Icon: User },
]

const profNav = [
  { to: '/prof/dashboard', label: 'Dashboard',    Icon: LayoutDashboard },
  { to: '/prof/turmas',    label: 'Turmas',       Icon: BookOpen },
  { to: '/loja',           label: 'Loja',         Icon: ShoppingBag },
  { to: '/prof/pedidos',   label: 'Meus Pedidos', Icon: Package },
  { to: '/prof/perfil',    label: 'Meu Perfil',   Icon: User },
]

export default function LojaLayout() {
  const { usuario, accessToken, logout } = useAuthStore()
  const { items } = useCartStore()
  const navigate = useNavigate()

  const isProf = usuario?.tipo === 'PROFESSOR'
  const nav = isProf ? profNav : alunoNav
  const sidebarBg   = isProf ? 'bg-emerald-900' : 'bg-blue-900'
  const activeBg    = isProf ? 'bg-emerald-700' : 'bg-blue-700'
  const hoverBg     = isProf ? 'hover:bg-emerald-800' : 'hover:bg-blue-800'
  const borderColor = isProf ? 'border-emerald-800' : 'border-blue-800'
  const mutedText   = isProf ? 'text-emerald-300' : 'text-blue-300'
  const areaLabel   = isProf ? 'Área do Professor' : 'Área do Aluno'

  useEffect(() => {
    if (accessToken) {
      connectWS(accessToken, (msg: unknown) => {
        const n = msg as { titulo: string; mensagem: string }
        toast.info(n.titulo, { description: n.mensagem })
      })
    }
    return () => disconnectWS()
  }, [accessToken])

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`w-64 ${sidebarBg} text-white flex flex-col`}>
        <div className={`px-6 py-5 border-b ${borderColor}`}>
          <h1 className="text-xl font-bold">Inovatech</h1>
          <p className={`${mutedText} text-xs mt-0.5`}>{areaLabel}</p>
        </div>
        <nav className="flex-1 py-4 space-y-0.5">
          {nav.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                  isActive
                    ? `${activeBg} text-white`
                    : `${mutedText} ${hoverBg} hover:text-white`
                }`
              }
            >
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className={`px-5 py-4 border-t ${borderColor}`}>
          <p className={`text-xs ${mutedText} truncate mb-2`}>{usuario?.nome}</p>
          <div className="flex items-center gap-3">
            <Link to="/carrinho" className={`relative ${mutedText} hover:text-white`}>
              <ShoppingCart size={18} />
              {items.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {items.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => { logout(); navigate('/login') }}
              className={`flex items-center gap-2 ${mutedText} hover:text-white text-xs transition-colors`}
            >
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-8 py-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {isProf ? 'Prof. ' : ''}<strong>{usuario?.nome?.split(' ')[0]}</strong>
          </span>
          <div className="flex items-center gap-4">
            <Link to="/carrinho" className="relative text-gray-500 hover:text-gray-800 transition-colors">
              <ShoppingCart size={20} />
              {items.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {items.length}
                </span>
              )}
            </Link>
            <Bell size={20} className="text-gray-500 cursor-pointer" />
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
