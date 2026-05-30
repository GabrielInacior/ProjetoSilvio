import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export default function AlunoNotas() {
  const { data: notas = [], isLoading } = useQuery({
    queryKey: ['aluno-notas'],
    queryFn: () => api.get('/aluno/notas').then((r) => r.data),
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Minhas Notas</h1>
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}
        </div>
      ) : notas.length === 0 ? (
        <div className="text-center py-20 text-gray-400">Nenhuma nota registrada.</div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Disciplina', 'Tipo', 'Valor', 'Peso', 'Data', 'Descrição'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gray-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {notas.map((n: { id: number; disciplina: string; tipo: string; valor: number; peso: number; dataAvaliacao: string; descricao?: string }) => (
                <tr key={n.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{n.disciplina}</td>
                  <td className="px-4 py-3 text-gray-600">{n.tipo}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${n.valor >= 6 ? 'text-green-600' : 'text-red-500'}`}>
                      {n.valor?.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{n.peso}x</td>
                  <td className="px-4 py-3 text-gray-600">
                    {n.dataAvaliacao ? new Date(n.dataAvaliacao).toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{n.descricao ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
