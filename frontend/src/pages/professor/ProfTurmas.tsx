import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Link } from 'react-router-dom'
import { ChevronRight, BookOpen } from 'lucide-react'

export default function ProfTurmas() {
  const { data: turmas = [], isLoading } = useQuery({
    queryKey: ['prof-turmas'],
    queryFn: () => api.get('/professor/turmas').then((r) => r.data),
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Minhas Turmas</h1>
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />)}
        </div>
      ) : turmas.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
          Nenhuma turma atribuída.
        </div>
      ) : (
        <div className="space-y-3">
          {(turmas as { id: number; disciplina: string; ano: number; semestre: number; sala: string; vagas: number; diaSemana: string; horaInicio: string; horaFim: string; status: string }[]).map((t) => (
            <Link key={t.id} to={`/prof/turmas/${t.id}`}
              className="bg-white border rounded-xl px-5 py-4 flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="font-semibold text-gray-900">{t.disciplina}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {t.ano}/{t.semestre}º semestre — Sala {t.sala} — {t.diaSemana} {t.horaInicio}–{t.horaFim}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{t.vagas} vagas</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  t.status === 'ATIVA' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>{t.status}</span>
                <ChevronRight size={18} className="text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
