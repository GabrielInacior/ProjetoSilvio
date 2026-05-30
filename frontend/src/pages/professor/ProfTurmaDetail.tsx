import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useState } from 'react'
import { toast } from 'sonner'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'

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
  if (pct >= 75) return '[&>div]:bg-green-500'
  if (pct >= 50) return '[&>div]:bg-yellow-400'
  return '[&>div]:bg-red-500'
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link to="/prof/turmas" className="text-muted-foreground hover:text-foreground text-sm">Turmas</Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium text-sm">Detalhes da Turma</span>
      </div>

      <Tabs defaultValue="Alunos" onValueChange={(v) => setTab(v as typeof TABS[number])}>
        <TabsList>
          {TABS.map(t => <TabsTrigger key={t} value={t}>{t}</TabsTrigger>)}
        </TabsList>

        {/* Alunos */}
        <TabsContent value="Alunos" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Alunos matriculados ({(alunos as unknown[]).length})</h2>
          </div>
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>{['RA', 'Nome', 'E-mail', 'Status'].map(h => <TableHead key={h}>{h}</TableHead>)}</TableRow>
              </TableHeader>
              <TableBody>
                {(alunos as { id: number; ra: string; nome: string; email: string; status: string }[]).map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono">{a.ra}</TableCell>
                    <TableCell className="font-medium">{a.nome}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{a.email}</TableCell>
                    <TableCell><Badge variant={a.status === 'ATIVA' ? 'success' : 'secondary'}>{a.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        {/* Aulas */}
        <TabsContent value="Aulas" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Aulas</h2>
            <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800" onClick={() => setShowAulaForm(true)}>
              <Plus size={15} className="mr-1" /> Nova aula
            </Button>
          </div>

          {showAulaForm && (
            <Card><CardContent className="p-5">
              <form onSubmit={aulaForm.handleSubmit((d) => criarAula.mutate(d))} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([['data', 'Data', 'date'], ['horaInicio', 'Hora início', 'time'], ['horaFim', 'Hora fim', 'time'], ['tema', 'Tema', 'text']] as const).map(([field, label, type]) => (
                  <div key={field} className="space-y-1">
                    <Label>{label}</Label>
                    <Input type={type} {...aulaForm.register(field as keyof AulaForm)} />
                  </div>
                ))}
                <div className="sm:col-span-2 space-y-1">
                  <Label>Conteúdo</Label>
                  <textarea {...aulaForm.register('conteudo')} rows={2}
                    className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="sm:col-span-2 flex gap-2 justify-end">
                  <Button type="button" variant="ghost" onClick={() => setShowAulaForm(false)}>Cancelar</Button>
                  <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800" disabled={criarAula.isPending}>
                    {criarAula.isPending ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              </form>
            </CardContent></Card>
          )}

          <div className="space-y-3">
            {(aulas as { id: number; data: string; horaInicio: string; horaFim: string; tema?: string; status: string }[]).map((a) => (
              <Card key={a.id}><CardContent className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{a.tema ?? 'Sem tema'}</p>
                  <p className="text-xs text-muted-foreground">{new Date(a.data + 'T00:00').toLocaleDateString('pt-BR')} — {a.horaInicio}–{a.horaFim}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={a.status === 'REALIZADA' ? 'success' : 'warning'}>{a.status}</Badge>
                  <Button size="sm" variant={a.status === 'REALIZADA' ? 'outline' : 'default'} asChild>
                    <Link to={`/prof/turmas/${id}/chamada/${a.id}`}>
                      {a.status === 'REALIZADA' ? 'Editar chamada' : 'Fazer chamada'}
                    </Link>
                  </Button>
                </div>
              </CardContent></Card>
            ))}
          </div>
        </TabsContent>

        {/* Notas */}
        <TabsContent value="Notas" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Notas</h2>
            <Button size="sm" onClick={() => setShowNotaForm(true)}>
              <Plus size={15} className="mr-1" /> Lançar nota
            </Button>
          </div>

          {showNotaForm && (
            <Card><CardContent className="p-5">
              <form onSubmit={notaForm.handleSubmit((d) => criarNota.mutate(d))} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Aluno</Label>
                  <select {...notaForm.register('alunoId')} className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Selecione</option>
                    {(alunos as { id: number; nome: string }[]).map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label>Tipo</Label>
                  <select {...notaForm.register('tipo')} className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    {['P1', 'P2', 'P3', 'TRABALHO', 'SEMINARIO', 'PROJETO', 'RECUPERACAO', 'FINAL'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                {([['valor', 'Valor (0–10)', 'number'], ['peso', 'Peso', 'number'], ['dataAvaliacao', 'Data', 'date'], ['descricao', 'Descrição', 'text']] as const).map(([field, label, type]) => (
                  <div key={field} className="space-y-1">
                    <Label>{label}</Label>
                    <Input type={type} step={type === 'number' ? '0.1' : undefined} {...notaForm.register(field as keyof NotaForm)} />
                  </div>
                ))}
                <div className="sm:col-span-2 flex gap-2 justify-end">
                  <Button type="button" variant="ghost" onClick={() => setShowNotaForm(false)}>Cancelar</Button>
                  <Button type="submit" disabled={criarNota.isPending}>{criarNota.isPending ? 'Salvando...' : 'Salvar'}</Button>
                </div>
              </form>
            </CardContent></Card>
          )}

          <Card><CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>{['Aluno', 'Tipo', 'Valor', 'Peso', 'Data'].map(h => <TableHead key={h}>{h}</TableHead>)}</TableRow>
              </TableHeader>
              <TableBody>
                {(notas as { id: number; aluno: string; tipo: string; valor: number; peso: number; dataAvaliacao?: string }[]).map((n) => (
                  <TableRow key={n.id}>
                    <TableCell className="font-medium">{n.aluno}</TableCell>
                    <TableCell className="text-muted-foreground">{n.tipo}</TableCell>
                    <TableCell><span className={`font-bold ${n.valor >= 6 ? 'text-green-600' : 'text-red-500'}`}>{n.valor?.toFixed(1)}</span></TableCell>
                    <TableCell className="text-muted-foreground">{n.peso}x</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{n.dataAvaliacao ? new Date(n.dataAvaliacao).toLocaleDateString('pt-BR') : '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        {/* Frequência */}
        <TabsContent value="Frequência" className="space-y-4">
          <h2 className="font-semibold">Frequência por aluno</h2>
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>{['Aluno', 'Aulas realizadas', 'Presenças', 'Frequência'].map(h => <TableHead key={h}>{h}</TableHead>)}</TableRow>
              </TableHeader>
              <TableBody>
                {(frequencia as { alunoId: number; nome: string; totalAulas: number; presentes: number; percentual: number }[]).map(f => {
                  const barClass = freqBarClass(f.percentual)
                  return (
                  <TableRow key={f.alunoId}>
                    <TableCell className="font-medium">{f.nome}</TableCell>
                    <TableCell className="text-muted-foreground">{f.totalAulas}</TableCell>
                    <TableCell className="text-muted-foreground">{f.presentes}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={f.percentual} className={`w-24 ${barClass}`} />
                        <span className={`text-xs font-bold ${freqTextClass(f.percentual)}`}>{f.percentual.toFixed(1)}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                  )
                })}
                {(frequencia as unknown[]).length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground text-sm">Nenhuma chamada registrada ainda.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
