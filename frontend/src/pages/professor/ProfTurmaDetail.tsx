import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useState } from 'react'
import { toast } from 'sonner'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus } from 'lucide-react'

const aulaSchema = z.object({
  data: z.string().min(1, 'Data obrigatória'),
  horaInicio: z.string().min(1),
  horaFim: z.string().min(1),
  tema: z.string().optional(),
  conteudo: z.string().optional(),
})
type AulaForm = z.infer<typeof aulaSchema>

type NotaForm = {
  alunoId: number
  tipo: string
  valor: number
  peso: number
  descricao?: string
  dataAvaliacao?: string
}
const notaSchema: z.ZodType<NotaForm> = z.object({
  alunoId: z.coerce.number().min(1, 'Selecione o aluno'),
  tipo: z.string().min(1),
  valor: z.coerce.number().min(0).max(10),
  peso: z.coerce.number().min(1),
  descricao: z.string().optional(),
  dataAvaliacao: z.string().optional(),
})

const TABS = ['Alunos', 'Aulas', 'Notas', 'Frequência'] as const

function freqBarClass(pct: number) {
  if (pct >= 75) return 'bg-green-500'
  if (pct >= 50) return 'bg-yellow-400'
  return 'bg-red-500'
}

function freqTextClass(pct: number) {
  if (pct >= 75) return 'text-green-600'
  if (pct >= 50) return 'text-yellow-600'
  return 'text-red-500'
}

export default function ProfTurmaDetail() {
  const { id } = useParams<{ id: string }>()
  const qc = useQueryClient()
  const [tab, setTab] = useState<typeof TABS[number]>('Alunos')
  const [showAulaForm, setShowAulaForm] = useState(false)
  const [showNotaForm, setShowNotaForm] = useState(false)

  const { data: alunos = [] } = useQuery({ queryKey: ['turma-alunos', id], queryFn: () => api.get(`/professor/turmas/${id}/alunos`).then(r => r.data) })
  const { data: aulas = [] } = useQuery({ queryKey: ['turma-aulas', id], queryFn: () => api.get(`/professor/turmas/${id}/aulas`).then(r => r.data) })
  const { data: notas = [] } = useQuery({ queryKey: ['turma-notas', id], queryFn: () => api.get(`/professor/turmas/${id}/notas`).then(r => r.data) })
  const { data: frequencia = [] } = useQuery({ queryKey: ['turma-frequencia', id], queryFn: () => api.get(`/professor/turmas/${id}/frequencia`).then(r => r.data), enabled: tab === 'Frequência' })

  const aulaForm = useForm<AulaForm>({ resolver: zodResolver(aulaSchema) })
  const notaForm = useForm<NotaForm>({ resolver: zodResolver(notaSchema as any) as Resolver<NotaForm> })

  const criarAula = useMutation({
    mutationFn: (data: AulaForm) => api.post(`/professor/turmas/${id}/aulas`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['turma-aulas', id] }); toast.success('Aula registrada!'); setShowAulaForm(false); aulaForm.reset() },
    onError: () => toast.error('Erro ao registrar aula.'),
  })

  const criarNota = useMutation({
    mutationFn: (data: NotaForm) => api.post(`/professor/turmas/${id}/notas`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['turma-notas', id] }); toast.success('Nota lançada!'); setShowNotaForm(false); notaForm.reset() },
    onError: () => toast.error('Erro ao lançar nota.'),
  })

  const matricularAluno = useMutation({
    mutationFn: (alunoId: number) => api.post(`/professor/turmas/${id}/matricular`, { alunoId }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['turma-alunos', id] }); toast.success('Aluno adicionado!'); setShowAddAluno(false); setAddAlunoId('') },
    onError: () => toast.error('Erro ao adicionar aluno.'),
  })

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link to="/prof/turmas" className="text-gray-500 hover:text-gray-700 text-sm">Turmas</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-medium text-sm">Detalhes da Turma</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Alunos */}
      {tab === 'Alunos' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900">Alunos matriculados ({(alunos as any[]).length})</h2>
          </div>

          <div className="bg-white border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>{['RA', 'Nome', 'E-mail', 'Status'].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-gray-700">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {(alunos as { id: number; ra: string; nome: string; email: string; status: string }[]).map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-gray-700">{a.ra}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{a.nome}</td>
                    <td className="px-4 py-3 text-gray-600">{a.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.status === 'ATIVA' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Aulas */}
      {tab === 'Aulas' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900">Aulas</h2>
            <button onClick={() => setShowAulaForm(true)} className="flex items-center gap-1 bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-800">
              <Plus size={15} /> Nova aula
            </button>
          </div>

          {showAulaForm && (
            <form onSubmit={aulaForm.handleSubmit((d) => criarAula.mutate(d))}
              className="bg-white border rounded-xl p-5 mb-4 grid grid-cols-2 gap-4">
              {[['data', 'Data', 'date'], ['horaInicio', 'Hora início', 'time'], ['horaFim', 'Hora fim', 'time'], ['tema', 'Tema', 'text']].map(([field, label, type]) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type} {...aulaForm.register(field as keyof AulaForm)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Conteúdo</label>
                <textarea {...aulaForm.register('conteudo')} rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="col-span-2 flex gap-2 justify-end">
                <button type="button" onClick={() => setShowAulaForm(false)} className="text-sm text-gray-500 px-4 py-2">Cancelar</button>
                <button type="submit" disabled={criarAula.isPending} className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60">
                  {criarAula.isPending ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {(aulas as { id: number; data: string; horaInicio: string; horaFim: string; tema?: string; status: string }[]).map((a) => (
              <div key={a.id} className="bg-white border rounded-xl px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{a.tema ?? 'Sem tema'}</p>
                  <p className="text-xs text-gray-500">{new Date(a.data + 'T00:00').toLocaleDateString('pt-BR')} — {a.horaInicio}–{a.horaFim}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.status === 'REALIZADA' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {a.status}
                  </span>
                  <Link to={`/prof/turmas/${id}/chamada/${a.id}`}
                    className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                      a.status === 'REALIZADA'
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-blue-700 text-white hover:bg-blue-800'
                    }`}>
                    {a.status === 'REALIZADA' ? 'Editar chamada' : 'Fazer chamada'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notas */}
      {tab === 'Notas' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900">Notas</h2>
            <button onClick={() => setShowNotaForm(true)} className="flex items-center gap-1 bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-800">
              <Plus size={15} /> Lançar nota
            </button>
          </div>

          {showNotaForm && (
            <form onSubmit={notaForm.handleSubmit((d) => criarNota.mutate(d))}
              className="bg-white border rounded-xl p-5 mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Aluno</label>
                <select {...notaForm.register('alunoId')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Selecione</option>
                  {(alunos as { id: number; nome: string }[]).map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tipo</label>
                <select {...notaForm.register('tipo')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {['P1', 'P2', 'P3', 'TRABALHO', 'SEMINARIO', 'PROJETO', 'RECUPERACAO', 'FINAL'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              {[['valor', 'Valor (0–10)', 'number'], ['peso', 'Peso', 'number'], ['dataAvaliacao', 'Data', 'date'], ['descricao', 'Descrição', 'text']].map(([field, label, type]) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type} step={type === 'number' ? '0.1' : undefined} {...notaForm.register(field as keyof NotaForm)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
              <div className="col-span-2 flex gap-2 justify-end">
                <button type="button" onClick={() => setShowNotaForm(false)} className="text-sm text-gray-500 px-4 py-2">Cancelar</button>
                <button type="submit" disabled={criarNota.isPending} className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60">
                  {criarNota.isPending ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          )}

          <div className="bg-white border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>{['Aluno', 'Tipo', 'Valor', 'Peso', 'Data'].map(h => <th key={h} className="px-4 py-3 text-left font-semibold text-gray-700">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {(notas as { id: number; aluno: string; tipo: string; valor: number; peso: number; dataAvaliacao?: string }[]).map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{n.aluno}</td>
                    <td className="px-4 py-3 text-gray-600">{n.tipo}</td>
                    <td className="px-4 py-3"><span className={`font-bold ${n.valor >= 6 ? 'text-green-600' : 'text-red-500'}`}>{n.valor?.toFixed(1)}</span></td>
                    <td className="px-4 py-3 text-gray-600">{n.peso}x</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{n.dataAvaliacao ? new Date(n.dataAvaliacao).toLocaleDateString('pt-BR') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Frequência */}
      {tab === 'Frequência' && (
        <div>
          <h2 className="font-semibold text-gray-900 mb-4">Frequência por aluno</h2>
          <div className="bg-white border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>{['Aluno', 'Aulas realizadas', 'Presenças', 'Frequência'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gray-700">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y">
                {(frequencia as { alunoId: number; nome: string; totalAulas: number; presentes: number; percentual: number }[]).map(f => (
                  <tr key={f.alunoId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{f.nome}</td>
                    <td className="px-4 py-3 text-gray-600">{f.totalAulas}</td>
                    <td className="px-4 py-3 text-gray-600">{f.presentes}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${freqBarClass(f.percentual)}`}
                            style={{ width: `${f.percentual}%` }} />
                        </div>
                        <span className={`text-xs font-bold ${freqTextClass(f.percentual)}`}>{f.percentual.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {(frequencia as unknown[]).length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-sm">Nenhuma chamada registrada ainda.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
