import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { PlusCircle, X, BookOpen } from 'lucide-react'
import { useState } from 'react'

type Matricula = {
  id: number
  disciplina: string
  professor: string
  sala: string
  diaSemana: string
  horaInicio: string
  horaFim: string
  ano: number
  semestre: string
  status: string
}

type Turma = {
  id: number
  disciplina: string
  professor: string | null
  sala: string
  diaSemana: string
  horaInicio: string
  horaFim: string
  ano: number
  semestre: string
  vagas: number
}

const semLabel = (s: string) => s === 'PRIMEIRO' ? '1º' : '2º'

function statusClass(s: string) {
  if (s === 'ATIVA') return 'bg-green-100 text-green-700'
  if (s === 'TRANCADA') return 'bg-yellow-100 text-yellow-700'
  return 'bg-gray-100 text-gray-600'
}

function plural(n: number, singular: string, plural: string) {
  return n === 1 ? singular : plural
}

export default function AlunoMatriculas() {
  const qc = useQueryClient()
  const [showDisponiveis, setShowDisponiveis] = useState(false)

  const { data: matriculas = [], isLoading } = useQuery<Matricula[]>({
    queryKey: ['aluno-matriculas'],
    queryFn: () => api.get('/aluno/matriculas').then(r => r.data),
  })

  const { data: disponiveis = [], isLoading: loadingDisp } = useQuery<Turma[]>({
    queryKey: ['aluno-turmas-disponiveis'],
    queryFn: () => api.get('/aluno/turmas/disponiveis').then(r => r.data),
    enabled: showDisponiveis,
  })

  const mutMatricular = useMutation({
    mutationFn: (turmaId: number) => api.post(`/aluno/turmas/${turmaId}/matricular`),
    onSuccess: () => {
      toast.success('Matrícula realizada com sucesso!')
      qc.invalidateQueries({ queryKey: ['aluno-matriculas'] })
      qc.invalidateQueries({ queryKey: ['aluno-turmas-disponiveis'] })
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? 'Erro ao realizar matrícula.')
    },
  })

  const mutCancelar = useMutation({
    mutationFn: (matriculaId: number) => api.delete(`/aluno/matriculas/${matriculaId}/cancelar`),
    onSuccess: () => {
      toast.success('Matrícula cancelada.')
      qc.invalidateQueries({ queryKey: ['aluno-matriculas'] })
      qc.invalidateQueries({ queryKey: ['aluno-turmas-disponiveis'] })
    },
    onError: () => toast.error('Erro ao cancelar matrícula.'),
  })

  function renderMatriculas() {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 4 }, (_, i) => `skel-${i}`).map(k => (
            <div key={k} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      )
    }
    if (matriculas.length === 0) {
      return (
        <div className="text-center py-16 text-gray-400">
          <BookOpen size={36} className="mx-auto mb-3 opacity-40" />
          <p>Você não possui matrículas ativas.</p>
          <button onClick={() => setShowDisponiveis(true)} className="text-sm text-blue-600 hover:underline mt-2">
            Ver turmas disponíveis
          </button>
        </div>
      )
    }
    return (
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Disciplina', 'Professor', 'Sala', 'Dia/Hora', 'Semestre', 'Status', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-gray-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {matriculas.map(m => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{m.disciplina}</td>
                <td className="px-4 py-3 text-gray-600">{m.professor ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{m.sala}</td>
                <td className="px-4 py-3 text-gray-600">{m.diaSemana} {m.horaInicio}–{m.horaFim}</td>
                <td className="px-4 py-3 text-gray-600">{m.ano}/{semLabel(m.semestre)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusClass(m.status)}`}>{m.status}</span>
                </td>
                <td className="px-4 py-3">
                  {m.status === 'ATIVA' && (
                    <button
                      onClick={() => { if (confirm(`Cancelar matrícula em ${m.disciplina}?`)) mutCancelar.mutate(m.id) }}
                      title="Cancelar matrícula"
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X size={15} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  function renderDisponiveis() {
    if (loadingDisp) {
      return (
        <div className="space-y-2">
          {Array.from({ length: 4 }, (_, i) => `disp-${i}`).map(k => (
            <div key={k} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      )
    }
    if (disponiveis.length === 0) {
      return (
        <div className="text-center py-12 text-gray-400 bg-white border rounded-xl">
          <p>Não há turmas disponíveis para matrícula no momento.</p>
        </div>
      )
    }
    return (
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Disciplina', 'Professor', 'Sala', 'Dia/Hora', 'Semestre', 'Vagas', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-gray-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {disponiveis.map(t => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{t.disciplina}</td>
                <td className="px-4 py-3 text-gray-600">{t.professor ?? <span className="text-gray-400 italic">A definir</span>}</td>
                <td className="px-4 py-3 text-gray-600">{t.sala}</td>
                <td className="px-4 py-3 text-gray-600">{t.diaSemana} {t.horaInicio}–{t.horaFim}</td>
                <td className="px-4 py-3 text-gray-600">{t.ano}/{semLabel(t.semestre)}</td>
                <td className="px-4 py-3 text-gray-600">{t.vagas}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => mutMatricular.mutate(t.id)}
                    disabled={mutMatricular.isPending}
                    className="flex items-center gap-1.5 bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-800 disabled:opacity-60 transition-colors"
                  >
                    <PlusCircle size={13} /> Matricular
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Minhas matrículas */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Minhas Matrículas</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {matriculas.length} {plural(matriculas.length, 'turma ativa', 'turmas ativas')}
            </p>
          </div>
          <button
            onClick={() => setShowDisponiveis(v => !v)}
            className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
          >
            <PlusCircle size={16} />
            {showDisponiveis ? 'Fechar' : 'Matricular-se'}
          </button>
        </div>
        {renderMatriculas()}
      </div>

      {/* Turmas disponíveis */}
      {showDisponiveis && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Turmas Disponíveis</h2>
          {renderDisponiveis()}
        </div>
      )}
    </div>
  )
}

