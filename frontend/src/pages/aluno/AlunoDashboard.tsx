import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { BookOpen, BarChart2, Calendar, FileText, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AlunoDashboard() {
  const { usuario } = useAuthStore()
  const { data: aluno } = useQuery({
    queryKey: ['aluno-perfil'],
    queryFn: () => api.get('/aluno/perfil').then((r) => r.data),
  })
  const { data: matriculas = [] } = useQuery({
    queryKey: ['aluno-matriculas'],
    queryFn: () => api.get('/aluno/matriculas').then((r) => r.data),
  })

  const cards = [
    { label: 'Matrículas ativas', value: matriculas.filter((m: { status: string }) => m.status === 'ATIVA').length, Icon: BookOpen, to: '/app/matriculas', color: 'bg-blue-600' },
    { label: 'Disciplinas', value: matriculas.length, Icon: BarChart2, to: '/app/notas', color: 'bg-emerald-600' },
    { label: 'Documentos', value: 'PDF', Icon: FileText, to: '/app/documentos', color: 'bg-violet-600' },
    { label: 'Pedidos', value: 'Ver', Icon: ShoppingBag, to: '/app/pedidos', color: 'bg-orange-600' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Olá, {usuario?.nome?.split(' ')[0]}!</h1>
        <p className="text-gray-500 mt-1">
          Bem-vindo ao portal acadêmico.
          {aluno && ` RA: ${aluno.ra} — ${aluno.curso}`}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map(({ label, value, Icon, to, color }) => (
          <Link key={to} to={to}
            className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className={`${color} text-white p-3 rounded-xl`}>
              <Icon size={22} />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Active enrollments */}
      {matriculas.length > 0 && (
        <div className="bg-white border rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Turmas do semestre</h2>
          <div className="space-y-3">
            {matriculas.slice(0, 5).map((m: { id: number; disciplina: string; professor: string; sala: string; status: string; diaSemana: string; horaInicio: string }) => (
              <div key={m.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{m.disciplina}</p>
                  <p className="text-xs text-gray-500">{m.professor} • {m.sala} • {m.diaSemana} {m.horaInicio}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  m.status === 'ATIVA' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>{m.status}</span>
              </div>
            ))}
          </div>
          <Link to="/app/matriculas" className="text-blue-700 text-sm font-medium mt-3 inline-block hover:underline">
            Ver todas →
          </Link>
        </div>
      )}
    </div>
  )
}
