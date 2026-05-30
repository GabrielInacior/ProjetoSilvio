import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Plus, Pencil, Ban, X } from 'lucide-react'

type Turma = {
  id: number
  disciplina: string
  professor: string
  ano: number
  semestre: string
  sala: string
  diaSemana: string
  horaInicio: string
  horaFim: string
  vagas: number
  status: string
  dataInicio: string
  dataFim: string
}
type Disciplina = { id: number; nome: string; codigo: string }
type Professor  = { id: number; nome: string; siape: string }

type FormData = {
  disciplinaId: string
  professorId: string
  ano: string
  semestre: string
  sala: string
  vagas: string
  diaSemana: string
  horaInicio: string
  horaFim: string
  dataInicio: string
  dataFim: string
}

const DIAS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB']
const semLabel = (s: string) => s === 'PRIMEIRO' ? '1º' : '2º'
function statusClass(s: string) {
  if (s === 'ATIVA') return 'bg-green-100 text-green-700'
  if (s === 'CANCELADA') return 'bg-red-100 text-red-600'
  return 'bg-gray-100 text-gray-600'
}

function Field({ label, children }: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  )
}

export default function AdminTurmas() {
  const qc = useQueryClient()
  const [page, setPage] = useState(0)
  const [modal, setModal] = useState<'new' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Turma | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-turmas', page],
    queryFn: () => api.get(`/turmas?page=${page}&size=15`).then(r => r.data),
  })
  const { data: disciplinas = [] } = useQuery<Disciplina[]>({
    queryKey: ['disciplinas-all'],
    queryFn: () => api.get('/disciplinas').then(r => r.data),
  })
  const { data: profData } = useQuery({
    queryKey: ['professores-all'],
    queryFn: () => api.get('/professores?page=0&size=100').then(r => r.data),
  })
  const professores: Professor[] = profData?.content ?? []

  const turmas: Turma[] = Array.isArray(data) ? data : data?.content ?? []
  const totalElements = data?.totalElements
  const isLast = Array.isArray(data) ? true : data?.last

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>()

  const openNew = () => { setEditing(null); reset({}); setModal('new') }
  const openEdit = (t: Turma) => {
    setEditing(t)
    reset({
      disciplinaId: '', professorId: '',
      ano: String(t.ano), semestre: t.semestre,
      sala: t.sala, vagas: String(t.vagas),
      diaSemana: t.diaSemana, horaInicio: t.horaInicio, horaFim: t.horaFim,
      dataInicio: t.dataInicio?.slice(0, 10), dataFim: t.dataFim?.slice(0, 10),
    })
    setModal('edit')
  }

  const mutCriar = useMutation({
    mutationFn: (body: object) => api.post('/turmas', body).then(r => r.data),
    onSuccess: () => { toast.success('Turma criada!'); qc.invalidateQueries({ queryKey: ['admin-turmas'] }); setModal(null) },
    onError: () => toast.error('Erro ao criar turma.'),
  })

  const mutEditar = useMutation({
    mutationFn: ({ id, body }: { id: number; body: object }) => api.put(`/turmas/${id}`, body).then(r => r.data),
    onSuccess: () => { toast.success('Turma atualizada!'); qc.invalidateQueries({ queryKey: ['admin-turmas'] }); setModal(null) },
    onError: () => toast.error('Erro ao atualizar turma.'),
  })

  const mutCancelar = useMutation({
    mutationFn: (id: number) => api.delete(`/turmas/${id}`),
    onSuccess: () => { toast.success('Turma cancelada.'); qc.invalidateQueries({ queryKey: ['admin-turmas'] }) },
    onError: () => toast.error('Erro ao cancelar turma.'),
  })

  const onSubmit = (data: FormData) => {
    const body = {
      disciplinaId: Number(data.disciplinaId) || undefined,
      professorId: Number(data.professorId) || undefined,
      ano: Number(data.ano),
      semestre: data.semestre,
      sala: data.sala,
      vagas: Number(data.vagas),
      diaSemana: data.diaSemana,
      horaInicio: data.horaInicio,
      horaFim: data.horaFim,
      dataInicio: data.dataInicio || undefined,
      dataFim: data.dataFim || undefined,
    }
    if (modal === 'new') mutCriar.mutate(body)
    else if (editing) mutEditar.mutate({ id: editing.id, body })
  }

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Turmas</h1>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
          <Plus size={16} /> Nova Turma
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 8 }, (_, i) => `skel-${i}`).map(k => <div key={k} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}</div>
      ) : (
        <>
          <div className="bg-white border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>{['Disciplina', 'Professor', 'Ano/Sem', 'Sala', 'Dia/Hora', 'Vagas', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gray-700">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y">
                {turmas.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{t.disciplina}</td>
                    <td className="px-4 py-3 text-gray-600">{t.professor ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{t.ano}/{semLabel(t.semestre)}</td>
                    <td className="px-4 py-3 text-gray-600">{t.sala}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{t.diaSemana} {t.horaInicio}–{t.horaFim}</td>
                    <td className="px-4 py-3 text-gray-600">{t.vagas}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusClass(t.status)}`}>{t.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(t)} title="Editar"
                          className="text-gray-400 hover:text-blue-600 transition-colors">
                          <Pencil size={15} />
                        </button>
                        {t.status !== 'CANCELADA' && (
                          <button onClick={() => { if (confirm('Cancelar esta turma?')) mutCancelar.mutate(t.id) }}
                            title="Cancelar" className="text-gray-400 hover:text-red-600 transition-colors">
                            <Ban size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            {totalElements != null && <span>{totalElements} turmas</span>}
            <div className="flex gap-2">
              <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 border rounded-md disabled:opacity-40 hover:bg-gray-50">Anterior</button>
              <button disabled={isLast} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border rounded-md disabled:opacity-40 hover:bg-gray-50">Próxima</button>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold text-gray-900">
                {modal === 'new' ? 'Nova Turma' : 'Editar Turma'}
              </h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {modal === 'new' && (
                <>
                  <Field label="Disciplina *">
                    <select {...register('disciplinaId', { required: true })} className={inputCls}>
                      <option value="">Selecione...</option>
                      {disciplinas.map(d => (
                        <option key={d.id} value={d.id}>{d.nome} ({d.codigo})</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Professor *">
                    <select {...register('professorId', { required: true })} className={inputCls}>
                      <option value="">Selecione...</option>
                      {professores.map(p => (
                        <option key={p.id} value={p.id}>{p.nome} — {p.siape}</option>
                      ))}
                    </select>
                  </Field>
                </>
              )}
              {modal === 'edit' && editing && (
                <div className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                  <strong>{editing.disciplina}</strong> — {editing.professor ?? 'Sem professor'}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Ano *">
                  <input type="number" {...register('ano', { required: true })} placeholder={String(new Date().getFullYear())} className={inputCls} />
                </Field>
                <Field label="Semestre *">
                  <select {...register('semestre', { required: true })} className={inputCls}>
                    <option value="PRIMEIRO">1º Semestre</option>
                    <option value="SEGUNDO">2º Semestre</option>
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Sala">
                  <input {...register('sala')} placeholder="Ex: Sala 101" className={inputCls} />
                </Field>
                <Field label="Vagas">
                  <input type="number" {...register('vagas')} placeholder="40" className={inputCls} />
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Dia da semana">
                  <select {...register('diaSemana')} className={inputCls}>
                    <option value="">—</option>
                    {DIAS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </Field>
                <Field label="Início">
                  <input type="time" {...register('horaInicio')} className={inputCls} />
                </Field>
                <Field label="Fim">
                  <input type="time" {...register('horaFim')} className={inputCls} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Data início">
                  <input type="date" {...register('dataInicio')} className={inputCls} />
                </Field>
                <Field label="Data fim">
                  <input type="date" {...register('dataFim')} className={inputCls} />
                </Field>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 disabled:opacity-60 transition-colors">
                  {modal === 'new' ? 'Criar Turma' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
