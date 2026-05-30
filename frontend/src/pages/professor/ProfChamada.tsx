import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { CheckCircle, XCircle, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type Aluno = { id: number; nome: string; ra: string }
type AulaInfo = { id: number; data: string; horaInicio: string; horaFim: string; tema?: string; status: string }
type ChamadaItem = { alunoId: number; presente: boolean }

export default function ProfChamada() {
  const { id, aulaId } = useParams<{ id: string; aulaId: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [presencas, setPresencas] = useState<Record<number, boolean>>({})
  const [inicializado, setInicializado] = useState(false)

  const { data: alunos = [], isLoading: loadingAlunos } = useQuery<Aluno[]>({
    queryKey: ['turma-alunos', id],
    queryFn: () => api.get(`/professor/turmas/${id}/alunos`).then(r => r.data),
  })

  const { data: aula } = useQuery<AulaInfo>({
    queryKey: ['aula-info', aulaId],
    queryFn: () => api.get(`/professor/aulas/${aulaId}`).then(r => r.data),
  })

  const { data: chamadaExistente = [] } = useQuery<ChamadaItem[]>({
    queryKey: ['aula-chamada', aulaId],
    queryFn: () => api.get(`/professor/aulas/${aulaId}/chamada`).then(r => r.data),
  })

  // Pré-preencher presenças quando alunos e chamada existente carregam
  useEffect(() => {
    if (inicializado || alunos.length === 0) return
    const mapa: Record<number, boolean> = {}
    if (chamadaExistente.length > 0) {
      chamadaExistente.forEach(c => { mapa[c.alunoId] = c.presente })
      alunos.forEach(a => { if (!(a.id in mapa)) mapa[a.id] = false })
    } else {
      alunos.forEach(a => { mapa[a.id] = false })
    }
    setPresencas(mapa)
    setInicializado(true)
  }, [alunos, chamadaExistente, inicializado])

  const togglePresenca = (alunoId: number) =>
    setPresencas(prev => ({ ...prev, [alunoId]: !prev[alunoId] }))

  const marcarTodos = (presente: boolean) => {
    const mapa: Record<number, boolean> = {}
    alunos.forEach(a => { mapa[a.id] = presente })
    setPresencas(mapa)
  }

  const salvar = useMutation({
    mutationFn: () => {
      const chamada = alunos.map(a => ({ alunoId: a.id, presente: presencas[a.id] ?? false }))
      return api.post(`/professor/aulas/${aulaId}/chamada`, chamada)
    },
    onSuccess: () => {
      toast.success('Chamada salva com sucesso!')
      qc.invalidateQueries({ queryKey: ['turma-aulas', id] })
      qc.invalidateQueries({ queryKey: ['aula-chamada', aulaId] })
      qc.invalidateQueries({ queryKey: ['turma-frequencia', id] })
      navigate(`/prof/turmas/${id}`)
    },
    onError: () => toast.error('Erro ao salvar chamada.'),
  })

  const totalPresentes = alunos.filter(a => presencas[a.id]).length
  const isEdicao = chamadaExistente.length > 0

  function salvarLabel() {
    if (salvar.isPending) return 'Salvando...'
    return isEdicao ? 'Salvar alterações' : 'Confirmar chamada'
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate(`/prof/turmas/${id}`)}>
        <ChevronLeft size={16} /> Voltar para turma
      </Button>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold">
            {isEdicao ? 'Editar chamada' : 'Fazer chamada'}
          </h1>
          {isEdicao && <Badge variant="warning">Editando</Badge>}
        </div>
        {aula && (
          <p className="text-sm text-muted-foreground">
            {aula.tema ?? 'Sem tema'} &mdash;{' '}
            {new Date(aula.data + 'T00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}{' '}
            · {aula.horaInicio}–{aula.horaFim}
          </p>
        )}
      </div>

      {loadingAlunos ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={`skel-${String(i)}`} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <>
          <Card>
            <div className="border-b px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">{totalPresentes}/{alunos.length} presentes</span>
              <div className="flex gap-3">
                <button onClick={() => marcarTodos(true)} className="text-green-700 hover:underline font-medium">
                  Todos presentes
                </button>
                <button onClick={() => marcarTodos(false)} className="text-destructive hover:underline font-medium">
                  Todos ausentes
                </button>
              </div>
            </div>
            <CardContent className="p-0">
              {alunos.map(a => {
                const presente = presencas[a.id] ?? false
                return (
                  <button key={a.id} type="button"
                    onClick={() => togglePresenca(a.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 border-b last:border-0 cursor-pointer transition-colors select-none text-left ${
                      presente ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-muted/50'
                    }`}
                  >
                    <div>
                      <p className="font-medium text-sm">{a.nome}</p>
                      <p className="text-xs text-muted-foreground">RA: {a.ra}</p>
                    </div>
                    {presente
                      ? <CheckCircle size={22} className="text-green-600 shrink-0" />
                      : <XCircle size={22} className="text-muted-foreground/30 shrink-0" />
                    }
                  </button>
                )
              })}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => navigate(`/prof/turmas/${id}`)}>Cancelar</Button>
            <Button className="flex-1 bg-emerald-700 hover:bg-emerald-800" onClick={() => salvar.mutate()} disabled={salvar.isPending}>
              {salvarLabel()}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
