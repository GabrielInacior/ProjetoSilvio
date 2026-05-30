import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

export default function AlunoFrequencia() {
  const { data: presencas = [], isLoading } = useQuery({
    queryKey: ['aluno-frequencia'],
    queryFn: () => api.get('/aluno/frequencia').then((r) => r.data),
  })

  // Group by disciplina
  const grouped = (presencas as { disciplina: string; data: string; presente: boolean }[]).reduce<Record<string, { data: string; presente: boolean }[]>>((acc, p) => {
    if (!acc[p.disciplina]) acc[p.disciplina] = []
    acc[p.disciplina].push(p)
    return acc
  }, {})

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Frequência</h1>
      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={`skel-${i}`} className="h-24 w-full" />)}</div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">Nenhum registro de frequência.</div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([disciplina, aulas]) => {
            const presentes = aulas.filter((a) => a.presente).length
            const pct = Math.round((presentes / aulas.length) * 100)
            return (
              <Card key={disciplina}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{disciplina}</h3>
                    <span className={`text-sm font-bold ${pct >= 75 ? 'text-green-600' : 'text-red-500'}`}>{pct}% de presença</span>
                  </div>
                  <Progress value={pct} className={`mb-2 ${pct >= 75 ? '[&>div]:bg-green-500' : '[&>div]:bg-red-400'}`} />
                  <p className="text-xs text-muted-foreground mb-3">
                    {presentes}/{aulas.length} aulas — {pct < 75 ? 'Atenção: abaixo do mínimo de 75%' : 'Dentro do mínimo exigido'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {aulas.map((a, i) => (
                      <div key={`${disciplina}-${i}`} title={new Date(a.data).toLocaleDateString('pt-BR')}
                        className={`w-7 h-7 rounded-md flex items-center justify-center ${a.presente ? 'bg-green-100' : 'bg-red-100'}`}>
                        {a.presente
                          ? <CheckCircle size={14} className="text-green-600" />
                          : <XCircle size={14} className="text-red-500" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
