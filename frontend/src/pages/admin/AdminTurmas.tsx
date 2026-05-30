import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Plus, Pencil, Ban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

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
    <div className="space-y-1">
      <Label>{label}</Label>
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Turmas</h1>
        <Button onClick={openNew} className="bg-blue-700 hover:bg-blue-800"><Plus size={16} className="mr-2" /> Nova Turma</Button>
      </div>

      <Card><CardContent className="p-0">
        {isLoading ? (
          <div className="p-4 space-y-2">{Array.from({ length: 8 }, (_, i) => `skel-${i}`).map(k => <Skeleton key={k} className="h-10 w-full" />)}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>{['Disciplina', 'Professor', 'Ano/Sem', 'Sala', 'Dia/Hora', 'Vagas', 'Status', ''].map(h => (
                <TableHead key={h}>{h}</TableHead>
              ))}</TableRow>
            </TableHeader>
            <TableBody>
              {turmas.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.disciplina}</TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">{t.professor ?? '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{t.ano}/{semLabel(t.semestre)}</TableCell>
                  <TableCell className="text-muted-foreground hidden lg:table-cell">{t.sala}</TableCell>
                  <TableCell className="text-muted-foreground text-xs hidden xl:table-cell">{t.diaSemana} {t.horaInicio}–{t.horaFim}</TableCell>
                  <TableCell className="text-muted-foreground hidden lg:table-cell">{t.vagas}</TableCell>
                  <TableCell>
                    {(() => {
                      if (t.status === 'ATIVA') return <Badge variant="success">{t.status}</Badge>
                      if (t.status === 'CANCELADA') return <Badge variant="destructive">{t.status}</Badge>
                      return <Badge variant="secondary">{t.status}</Badge>
                    })()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil size={15} /></Button>
                      {t.status !== 'CANCELADA' && (
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"
                          onClick={() => { if (confirm('Cancelar esta turma?')) mutCancelar.mutate(t.id) }}>
                          <Ban size={15} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent></Card>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
        {totalElements != null && <span>{totalElements} turmas</span>}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Anterior</Button>
          <Button variant="outline" size="sm" disabled={isLast} onClick={() => setPage(p => p + 1)}>Próxima</Button>
        </div>
      </div>

      <Dialog open={!!modal} onOpenChange={(open) => { if (!open) setModal(null) }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{modal === 'new' ? 'Nova Turma' : 'Editar Turma'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {modal === 'new' && (
              <>
                <Field label="Disciplina *">
                  <select {...register('disciplinaId', { required: true })} className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background">
                    <option value="">Selecione...</option>
                    {disciplinas.map(d => (
                      <option key={d.id} value={d.id}>{d.nome} ({d.codigo})</option>
                    ))}
                  </select>
                </Field>
                <Field label="Professor *">
                  <select {...register('professorId', { required: true })} className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background">
                    <option value="">Selecione...</option>
                    {professores.map(p => (
                      <option key={p.id} value={p.id}>{p.nome} — {p.siape}</option>
                    ))}
                  </select>
                </Field>
              </>
            )}
            {modal === 'edit' && editing && (
              <div className="text-sm text-muted-foreground bg-muted rounded-lg px-3 py-2">
                <strong>{editing.disciplina}</strong> — {editing.professor ?? 'Sem professor'}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Ano *">
                <Input type="number" {...register('ano', { required: true })} placeholder={String(new Date().getFullYear())} />
              </Field>
              <Field label="Semestre *">
                <select {...register('semestre', { required: true })} className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background">
                  <option value="PRIMEIRO">1º Semestre</option>
                  <option value="SEGUNDO">2º Semestre</option>
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Sala"><Input {...register('sala')} placeholder="Ex: Sala 101" /></Field>
              <Field label="Vagas"><Input type="number" {...register('vagas')} placeholder="40" /></Field>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Dia da semana">
                <select {...register('diaSemana')} className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background">
                  <option value="">—</option>
                  {DIAS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Início"><Input type="time" {...register('horaInicio')} /></Field>
              <Field label="Fim"><Input type="time" {...register('horaFim')} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Data início"><Input type="date" {...register('dataInicio')} /></Field>
              <Field label="Data fim"><Input type="date" {...register('dataFim')} /></Field>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setModal(null)}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-700 hover:bg-blue-800">
                {modal === 'new' ? 'Criar Turma' : 'Salvar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
