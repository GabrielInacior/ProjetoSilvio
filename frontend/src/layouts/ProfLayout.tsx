import { useState } from 'react'
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { LayoutDashboard, BookOpen, ShoppingBag, User, LogOut, ShoppingCart, Package, Menu, X } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

const nav = [
  { to: '/prof/dashboard', label: 'Dashboard',   Icon: LayoutDashboard },
  { to: '/prof/turmas',    label: 'Turmas',       Icon: BookOpen },
  { to: '/loja',           label: 'Loja',         Icon: ShoppingBag },
  { to: '/prof/pedidos',   label: 'Meus Pedidos', Icon: Package },
  { to: '/prof/perfil',    label: 'Meu Perfil',   Icon: User },
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
              isActive ? 'bg-emerald-700 text-white' : 'text-emerald-200 hover:bg-emerald-800 hover:text-white',
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
        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
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
    <div className="flex h-full flex-col bg-emerald-900 text-white">
      <div className="px-6 py-5 border-b border-emerald-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Inovatech</h1>
          <p className="text-emerald-300 text-xs mt-0.5">Área do Professor</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-emerald-300 hover:text-white lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="space-y-0.5"><NavItems onClose={onClose} /></nav>
      </ScrollArea>
      <div className="px-5 py-4 border-t border-emerald-800">
        <p className="text-xs text-emerald-300 truncate mb-2">{usuario?.nome}</p>
        <div className="flex items-center gap-3">
          <CartBadge items={items} className="text-emerald-300 hover:text-white" />
          <button
            onClick={() => { logout(); navigate('/login'); onClose?.() }}
            className="flex items-center gap-2 text-emerald-300 hover:text-white text-xs transition-colors"
          >
            <LogOut size={14} /> Sair
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProfLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { usuario } = useAuthStore()
  const { items } = useCartStore()

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-emerald-900 text-white px-4 py-3 border-b border-emerald-800">
        <div className="flex items-center gap-3">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-emerald-800 h-8 w-8">
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
          <CartBadge items={items} className="text-emerald-200 hover:text-white" />
          <span className="text-emerald-200 text-xs truncate max-w-[120px]">{usuario?.nome?.split(' ')[0]}</span>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        <header className="hidden lg:flex bg-white border-b px-8 py-4 items-center justify-between">
          <span className="text-sm text-gray-500">Bem-vindo, Prof. <strong>{usuario?.nome?.split(' ')[0]}</strong></span>
          <div className="flex items-center gap-4">
            <CartBadge items={items} className="text-gray-500 hover:text-gray-700" />
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
