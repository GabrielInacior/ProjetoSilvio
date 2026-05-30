import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { BookOpen, BarChart2, FileText, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Olá, {usuario?.nome?.split(' ')[0]}!</h1>
        <p className="text-muted-foreground mt-1">
          Bem-vindo ao portal acadêmico.
          {aluno && ` RA: ${aluno.ra} — ${aluno.curso}`}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, Icon, to, color }) => (
          <Link key={to} to={to}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`${color} text-white p-3 rounded-xl flex-shrink-0`}><Icon size={22} /></div>
                <div>
                  <div className="text-xl font-bold">{value}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {matriculas.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4">Turmas do semestre</h2>
            <div className="space-y-3">
              {matriculas.slice(0, 5).map((m: { id: number; disciplina: string; professor: string; sala: string; status: string; diaSemana: string; horaInicio: string }) => (
                <div key={m.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sm">{m.disciplina}</p>
                    <p className="text-xs text-muted-foreground">{m.professor} • {m.sala} • {m.diaSemana} {m.horaInicio}</p>
                  </div>
                  <Badge variant={m.status === 'ATIVA' ? 'success' : 'secondary'}>{m.status}</Badge>
                </div>
              ))}
            </div>
            <Link to="/app/matriculas" className="text-blue-700 text-sm font-medium mt-3 inline-block hover:underline">
              Ver todas →
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
