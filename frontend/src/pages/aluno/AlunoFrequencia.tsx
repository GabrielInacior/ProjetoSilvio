import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { CheckCircle, XCircle } from 'lucide-react'

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
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Frequência</h1>
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />)}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-20 text-gray-400">Nenhum registro de frequência.</div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([disciplina, aulas]) => {
            const presentes = aulas.filter((a) => a.presente).length
            const pct = Math.round((presentes / aulas.length) * 100)
            return (
              <div key={disciplina} className="bg-white border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{disciplina}</h3>
                  <span className={`text-sm font-bold ${pct >= 75 ? 'text-green-600' : 'text-red-500'}`}>
                    {pct}% de presença
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                  <div className={`h-2 rounded-full ${pct >= 75 ? 'bg-green-500' : 'bg-red-400'}`}
                    style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  {presentes}/{aulas.length} aulas — {pct < 75 ? `Atenção: abaixo do mínimo de 75%` : 'Dentro do mínimo exigido'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {aulas.map((a, i) => (
                    <div key={i} title={new Date(a.data).toLocaleDateString('pt-BR')}
                      className={`w-7 h-7 rounded-md flex items-center justify-center ${a.presente ? 'bg-green-100' : 'bg-red-100'}`}>
                      {a.presente
                        ? <CheckCircle size={14} className="text-green-600" />
                        : <XCircle size={14} className="text-red-500" />}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
