import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { BookOpen, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function ProfDashboard() {
  const { usuario } = useAuthStore()
  const { data: turmas = [] } = useQuery({
    queryKey: ['prof-turmas'],
    queryFn: () => api.get('/professor/turmas').then((r) => r.data),
  })
  const { data: perfil } = useQuery({
    queryKey: ['prof-perfil'],
    queryFn: () => api.get('/professor/perfil').then((r) => r.data),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Olá, Prof. {usuario?.nome?.split(' ')[0]}!</h1>
        {perfil && <p className="text-muted-foreground mt-1">SIAPE: {perfil.siape} — {perfil.titulacao}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card><CardContent className="p-5 flex items-center gap-4">
          <div className="bg-emerald-600 text-white p-3 rounded-xl"><BookOpen size={22} /></div>
          <div>
            <div className="text-2xl font-bold">{turmas.length}</div>
            <div className="text-xs text-muted-foreground">Turmas no semestre</div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-5 flex items-center gap-4">
          <div className="bg-blue-600 text-white p-3 rounded-xl"><Users size={22} /></div>
          <div>
            <div className="text-2xl font-bold">
              {turmas.reduce((s: number, t: { vagas: number }) => s + t.vagas, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total de vagas</div>
          </div>
        </CardContent></Card>
      </div>

      <Card><CardContent className="p-5">
        <h2 className="font-semibold mb-4">Minhas Turmas</h2>
        <div className="space-y-3">
          {(turmas as { id: number; disciplina: string; ano: number; semestre: number; sala: string; diaSemana: string; horaInicio: string; status: string }[]).map((t) => (
            <Link key={t.id} to={`/prof/turmas/${t.id}`}
              className="flex items-center justify-between border rounded-lg px-4 py-3 hover:bg-muted/50 transition-colors">
              <div>
                <p className="font-medium text-sm">{t.disciplina}</p>
                <p className="text-xs text-muted-foreground">{t.ano}/{t.semestre === 'PRIMEIRO' ? '1' : '2'}º — {t.sala} — {t.diaSemana} {t.horaInicio}</p>
              </div>
              <Badge variant={t.status === 'ATIVA' ? 'success' : 'secondary'}>{t.status}</Badge>
            </Link>
          ))}
        </div>
      </CardContent></Card>
    </div>
  )
}
