import { useState } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { connectWS, disconnectWS } from '@/lib/websocket'
import { toast } from 'sonner'
import { useEffect } from 'react'
import {
  LayoutDashboard, BookOpen, ShoppingBag, User, LogOut,
  ShoppingCart, Package, ClipboardList, BarChart2, Calendar,
  FileText, Menu, X,
} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

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
  const [mobileOpen, setMobileOpen] = useState(false)
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

  function SidebarContent({ onClose }: { onClose?: () => void }) {
    return (
      <div className={cn('flex h-full flex-col text-white', sidebarBg)}>
        <div className={cn('px-6 py-5 border-b flex items-center justify-between', borderColor)}>
          <div>
            <h1 className="text-xl font-bold">Inovatech</h1>
            <p className={cn('text-xs mt-0.5', mutedText)}>{areaLabel}</p>
          </div>
          {onClose && (
            <button onClick={onClose} className={cn(mutedText, 'hover:text-white lg:hidden')}>
              <X size={18} />
            </button>
          )}
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="space-y-0.5">
            {nav.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors rounded-sm mx-2',
                    isActive ? cn(activeBg, 'text-white') : cn(mutedText, hoverBg, 'hover:text-white'),
                  )
                }
              >
                <Icon size={17} /> {label}
              </NavLink>
            ))}
          </nav>
        </ScrollArea>
        <div className={cn('px-5 py-4 border-t', borderColor)}>
          <p className={cn('text-xs truncate mb-2', mutedText)}>{usuario?.nome}</p>
          <div className="flex items-center gap-3">
            <Link to="/carrinho" className={cn('relative', mutedText, 'hover:text-white')}>
              <ShoppingCart size={18} />
              {items.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {items.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => { logout(); navigate('/login'); onClose?.() }}
              className={cn('flex items-center gap-2 text-xs transition-colors', mutedText, 'hover:text-white')}
            >
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>
      </div>
    )
  }

  const mobileBg = isProf ? 'bg-emerald-900 border-emerald-800' : 'bg-blue-900 border-blue-800'

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className={cn('lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between text-white px-4 py-3 border-b', mobileBg)}>
        <div className="flex items-center gap-3">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-8 w-8">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 border-0">
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="font-bold">Inovatech</span>
        </div>
        <Link to="/carrinho" className={cn('relative', mutedText, 'hover:text-white')}>
          <ShoppingCart size={20} />
          {items.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
              {items.length}
            </span>
          )}
        </Link>
      </div>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        <header className="hidden lg:flex bg-white border-b px-8 py-4 items-center justify-between">
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
            <span className="text-sm text-gray-600">{usuario?.email}</span>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
