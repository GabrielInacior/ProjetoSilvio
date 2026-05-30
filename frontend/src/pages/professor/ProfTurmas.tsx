import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Link } from 'react-router-dom'
import { ChevronRight, BookOpen, PlusCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Minhas Turmas</h1>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={`skel-${i}`} className="h-20 w-full" />)}
          </div>
        ) : turmas.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border rounded-xl">
            <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
            <p>Nenhuma turma atribuída ainda.</p>
            <p className="text-sm mt-1">Assuma uma turma disponível abaixo.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {turmas.map((t) => (
              <Link key={t.id} to={`/prof/turmas/${t.id}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="px-5 py-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{t.disciplina}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {t.ano}/{t.semestre === 'PRIMEIRO' ? '1' : '2'}º semestre — Sala {t.sala} — {t.diaSemana} {t.horaInicio}–{t.horaFim}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{t.vagas} vagas</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={t.status === 'ATIVA' ? 'success' : 'secondary'}>{t.status}</Badge>
                      <ChevronRight size={18} className="text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <PlusCircle size={20} className="text-blue-600" />
          Turmas sem professor
        </h2>
        {loadingDisp ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => <Skeleton key={`disp-${i}`} className="h-20 w-full" />)}
          </div>
        ) : disponiveis.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border rounded-xl text-sm">
            Nenhuma turma disponível no momento.
          </div>
        ) : (
          <div className="space-y-3">
            {disponiveis.map((t) => (
              <Card key={t.id}>
                <CardContent className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{t.disciplina}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {t.ano}/{t.semestre === 'PRIMEIRO' ? '1' : '2'}º semestre
                      {t.sala && ` — Sala ${t.sala}`}
                      {t.diaSemana && ` — ${t.diaSemana} ${t.horaInicio}–${t.horaFim}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.vagas} vagas</p>
                  </div>
                  <Button className="ml-4" onClick={() => assumirMutation.mutate(t.id)} disabled={assumirMutation.isPending}>
                    Assumir
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

