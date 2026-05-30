import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { ShoppingCart, Menu, X, GraduationCap } from 'lucide-react'
import { useState } from 'react'

const links = [
  { to: '/',        label: 'Início' },
  { to: '/cursos',  label: 'Cursos' },
  { to: '/blog',    label: 'Blog' },
  { to: '/eventos', label: 'Eventos' },
  { to: '/sobre',   label: 'Sobre' },
  { to: '/loja',    label: 'Loja' },
]

export default function Navbar() {
  const { usuario, logout } = useAuthStore()
  const items = useCartStore((s) => s.items)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const portalLink = usuario
    ? usuario.tipo === 'ALUNO' ? '/app/dashboard'
    : usuario.tipo === 'PROFESSOR' ? '/prof/dashboard'
    : '/admin/dashboard'
    : '/login'

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-bold text-blue-700 text-lg">
          <GraduationCap size={24} />
          Inovatech
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? 'text-blue-700' : 'text-gray-600 hover:text-blue-700'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/carrinho" className="relative p-2 text-gray-600 hover:text-blue-700">
            <ShoppingCart size={20} />
            {items.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>
          {usuario ? (
            <div className="flex items-center gap-2">
              <Link to={portalLink}
                className="text-sm font-medium text-white bg-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-800 transition-colors">
                Portal
              </Link>
              <button onClick={() => { logout(); navigate('/') }}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors">
                Sair
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/cadastro"
                className="text-sm font-medium text-blue-700 border border-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors hidden sm:block">
                Cadastre-se
              </Link>
              <Link to="/login"
                className="text-sm font-medium text-white bg-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-800 transition-colors">
                Entrar
              </Link>
            </div>
          )}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-3 space-y-1">
          {links.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block py-2 text-sm font-medium ${isActive ? 'text-blue-700' : 'text-gray-600'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
