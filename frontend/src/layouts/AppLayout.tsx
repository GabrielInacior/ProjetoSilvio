import { useState } from 'react'
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useEffect } from 'react'
import { connectWS, disconnectWS } from '@/lib/websocket'
import { toast } from 'sonner'
import {
  LayoutDashboard, BookOpen, BarChart2, Calendar, FileText,
  ShoppingBag, User, LogOut, ClipboardList, Package, ShoppingCart, Menu, X,
} from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

const nav = [
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
              isActive ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-800 hover:text-white',
            )
          }
        >
          <Icon size={17} /> {label}
        </NavLink>
      ))}
    </>
  )
}

function CartBadge({ items, className }: { items: unknown[]; className?: string }) {
  return (
    <Link to="/carrinho" className={cn('relative', className)}>
      <ShoppingCart size={20} />
      {items.length > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-blue-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
          {items.length}
        </span>
      )}
    </Link>
  )
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { usuario, logout } = useAuthStore()
  const { items } = useCartStore()
  const navigate = useNavigate()
  return (
    <div className="flex h-full flex-col bg-blue-900 text-white">
      <div className="px-6 py-5 border-b border-blue-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Inovatech</h1>
          <p className="text-blue-300 text-xs mt-0.5">Área do Aluno</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-blue-300 hover:text-white lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="space-y-0.5"><NavItems onClose={onClose} /></nav>
      </ScrollArea>
      <div className="px-5 py-4 border-t border-blue-800">
        <p className="text-xs text-blue-300 truncate mb-2">{usuario?.nome}</p>
        <div className="flex items-center gap-3">
          <CartBadge items={items} className="text-blue-300 hover:text-white" />
          <button
            onClick={() => { logout(); navigate('/login'); onClose?.() }}
            className="flex items-center gap-2 text-blue-300 hover:text-white text-xs transition-colors"
          >
            <LogOut size={14} /> Sair
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { usuario, accessToken } = useAuthStore()
  const { items } = useCartStore()

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
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-blue-900 text-white px-4 py-3 border-b border-blue-800">
        <div className="flex items-center gap-3">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-blue-800 h-8 w-8">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 border-0">
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="font-bold">Inovatech</span>
        </div>
        <div className="flex items-center gap-3">
          <CartBadge items={items} className="text-blue-200 hover:text-white" />
          <span className="text-blue-200 text-xs truncate max-w-[120px]">{usuario?.email}</span>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        <header className="hidden lg:flex bg-white border-b px-8 py-4 items-center justify-end gap-3">
          <CartBadge items={items} className="text-gray-500 hover:text-blue-700 transition-colors" />
          <span className="text-sm text-gray-600">{usuario?.email}</span>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
