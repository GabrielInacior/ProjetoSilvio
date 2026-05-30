import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Link } from 'react-router-dom'
import { ChevronRight, BookOpen, PlusCircle } from 'lucide-react'
import { toast } from 'sonner'

type Turma = {
  id: number
  disciplina: string
  professor: string | null
  ano: number
  semestre: string
  sala: string
  vagas: number
  diaSemana: string
  horaInicio: string
  horaFim: string
  status: string
}

export default function ProfTurmas() {
  const qc = useQueryClient()

  const { data: turmas = [], isLoading } = useQuery<Turma[]>({
    queryKey: ['prof-turmas'],
    queryFn: () => api.get('/professor/turmas').then((r) => r.data),
  })

  const { data: disponiveis = [], isLoading: loadingDisp } = useQuery<Turma[]>({
    queryKey: ['prof-turmas-disponiveis'],
    queryFn: () => api.get('/professor/turmas/disponiveis').then((r) => r.data),
  })

  const assumirMutation = useMutation({
    mutationFn: (turmaId: number) => api.post(`/professor/turmas/${turmaId}/assumir`),
    onSuccess: () => {
      toast.success('Turma assumida com sucesso!')
      qc.invalidateQueries({ queryKey: ['prof-turmas'] })
      qc.invalidateQueries({ queryKey: ['prof-turmas-disponiveis'] })
    },
    onError: () => toast.error('Não foi possível assumir a turma.'),
  })

  return (
    <div className="space-y-10">
      {/* Minhas turmas */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Minhas Turmas</h1>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        ) : turmas.length === 0 ? (
          <div className="text-center py-12 text-gray-400 border rounded-xl bg-gray-50">
            <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
            <p>Nenhuma turma atribuída ainda.</p>
            <p className="text-sm mt-1">Assuma uma turma disponível abaixo.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {turmas.map((t) => (
              <Link key={t.id} to={`/prof/turmas/${t.id}`}
                className="bg-white border rounded-xl px-5 py-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="font-semibold text-gray-900">{t.disciplina}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {t.ano}/{t.semestre === 'PRIMEIRO' ? '1' : '2'}º semestre — Sala {t.sala} — {t.diaSemana} {t.horaInicio}–{t.horaFim}
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

      {/* Turmas disponíveis */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <PlusCircle size={20} className="text-blue-600" />
          Turmas sem professor
        </h2>
        {loadingDisp ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        ) : disponiveis.length === 0 ? (
          <div className="text-center py-8 text-gray-400 border rounded-xl bg-gray-50 text-sm">
            Nenhuma turma disponível no momento.
          </div>
        ) : (
          <div className="space-y-3">
            {disponiveis.map((t) => (
              <div key={t.id} className="bg-white border border-blue-100 rounded-xl px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{t.disciplina}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {t.ano}/{t.semestre === 'PRIMEIRO' ? '1' : '2'}º semestre
                    {t.sala && ` — Sala ${t.sala}`}
                    {t.diaSemana && ` — ${t.diaSemana} ${t.horaInicio}–${t.horaFim}`}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.vagas} vagas</p>
                </div>
                <button
                  onClick={() => assumirMutation.mutate(t.id)}
                  disabled={assumirMutation.isPending}
                  className="ml-4 px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors"
                >
                  Assumir
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

