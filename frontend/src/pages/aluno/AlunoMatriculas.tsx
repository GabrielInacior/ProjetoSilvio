import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { PlusCircle, X, BookOpen } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

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

function statusVariant(s: string): 'success' | 'warning' | 'secondary' {
  if (s === 'ATIVA') return 'success'
  if (s === 'TRANCADA') return 'warning'
  return 'secondary'
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
          {Array.from({ length: 4 }, (_, i) => `skel-${i}`).map(k => <Skeleton key={k} className="h-12 w-full" />)}
        </div>
      )
    }
    if (matriculas.length === 0) {
      return (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen size={36} className="mx-auto mb-3 opacity-40" />
          <p>Você não possui matrículas ativas.</p>
          <button onClick={() => setShowDisponiveis(true)} className="text-sm text-blue-600 hover:underline mt-2">
            Ver turmas disponíveis
          </button>
        </div>
      )
    }
    return (
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Disciplina</TableHead>
              <TableHead className="hidden md:table-cell">Professor</TableHead>
              <TableHead className="hidden lg:table-cell">Sala</TableHead>
              <TableHead className="hidden xl:table-cell">Dia/Hora</TableHead>
              <TableHead className="hidden md:table-cell">Semestre</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {matriculas.map(m => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.disciplina}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{m.professor ?? '—'}</TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">{m.sala}</TableCell>
                <TableCell className="hidden xl:table-cell text-muted-foreground">{m.diaSemana} {m.horaInicio}–{m.horaFim}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{m.ano}/{semLabel(m.semestre)}</TableCell>
                <TableCell><Badge variant={statusVariant(m.status)}>{m.status}</Badge></TableCell>
                <TableCell>
                  {m.status === 'ATIVA' && (
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8"
                      title="Cancelar matrícula"
                      onClick={() => { if (confirm(`Cancelar matrícula em ${m.disciplina}?`)) mutCancelar.mutate(m.id) }}>
                      <X size={15} />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    )
  }

  function renderDisponiveis() {
    if (loadingDisp) {
      return (
        <div className="space-y-2">
          {Array.from({ length: 4 }, (_, i) => `disp-${i}`).map(k => <Skeleton key={k} className="h-12 w-full" />)}
        </div>
      )
    }
    if (disponiveis.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground border rounded-xl">
          <p>Não há turmas disponíveis para matrícula no momento.</p>
        </div>
      )
    }
    return (
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Disciplina</TableHead>
              <TableHead className="hidden md:table-cell">Professor</TableHead>
              <TableHead className="hidden lg:table-cell">Sala</TableHead>
              <TableHead className="hidden xl:table-cell">Dia/Hora</TableHead>
              <TableHead className="hidden md:table-cell">Semestre</TableHead>
              <TableHead className="hidden lg:table-cell">Vagas</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {disponiveis.map(t => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.disciplina}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{t.professor ?? <span className="italic text-muted-foreground">A definir</span>}</TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">{t.sala}</TableCell>
                <TableCell className="hidden xl:table-cell text-muted-foreground">{t.diaSemana} {t.horaInicio}–{t.horaFim}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{t.ano}/{semLabel(t.semestre)}</TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">{t.vagas}</TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => mutMatricular.mutate(t.id)} disabled={mutMatricular.isPending}>
                    <PlusCircle size={13} className="mr-1" /> Matricular
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold">Minhas Matrículas</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {matriculas.length} {plural(matriculas.length, 'turma ativa', 'turmas ativas')}
            </p>
          </div>
          <Button onClick={() => setShowDisponiveis(v => !v)}>
            <PlusCircle size={16} className="mr-2" />
            {showDisponiveis ? 'Fechar' : 'Matricular-se'}
          </Button>
        </div>
        {renderMatriculas()}
      </div>

      {showDisponiveis && (
        <div>
          <h2 className="text-lg font-bold mb-4">Turmas Disponíveis</h2>
          {renderDisponiveis()}
        </div>
      )}
    </div>
  )
}

