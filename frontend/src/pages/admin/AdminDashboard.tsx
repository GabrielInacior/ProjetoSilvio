import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Users, GraduationCap, BookOpen, Package } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  const { data: alunos } = useQuery({ queryKey: ['admin-alunos-count'], queryFn: () => api.get('/alunos?size=1').then(r => r.data.totalElements) })
  const { data: profs } = useQuery({ queryKey: ['admin-profs-count'], queryFn: () => api.get('/professores?size=1').then(r => r.data.totalElements) })
  const { data: cursos } = useQuery({ queryKey: ['cursos'], queryFn: () => api.get('/cursos').then(r => r.data) })
  const { data: produtos } = useQuery({ queryKey: ['produtos-count'], queryFn: () => api.get('/produtos?size=1').then(r => r.data.totalElements) })

  const cards = [
    { label: 'Alunos', value: alunos ?? '—', Icon: Users, to: '/admin/alunos', color: 'bg-blue-600' },
    { label: 'Professores', value: profs ?? '—', Icon: GraduationCap, to: '/admin/professores', color: 'bg-emerald-600' },
    { label: 'Cursos', value: cursos?.length ?? '—', Icon: BookOpen, to: '/admin/cursos', color: 'bg-violet-600' },
    { label: 'Produtos', value: produtos ?? '—', Icon: Package, to: '/admin/produtos', color: 'bg-orange-600' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Administrativo</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map(({ label, value, Icon, to, color }) => (
          <Link key={to} to={to} className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className={`${color} text-white p-3 rounded-xl`}><Icon size={22} /></div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          </Link>
        ))}
      </div>
      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-3">Acesso rápido</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            ['/admin/alunos', 'Gerenciar Alunos'],
            ['/admin/professores', 'Gerenciar Professores'],
            ['/admin/turmas', 'Gerenciar Turmas'],
            ['/admin/posts', 'Blog Posts'],
          ].map(([to, label]) => (
            <Link key={to} to={to} className="border rounded-lg px-3 py-2.5 text-sm text-center text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
