import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export default function AlunoMatriculas() {
  const { data: matriculas = [], isLoading } = useQuery({
    queryKey: ['aluno-matriculas'],
    queryFn: () => api.get('/aluno/matriculas').then((r) => r.data),
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Minhas Matrículas</h1>
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}
        </div>
      ) : matriculas.length === 0 ? (
        <div className="text-center py-20 text-gray-400">Nenhuma matrícula encontrada.</div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Disciplina', 'Professor', 'Sala', 'Dia/Hora', 'Semestre', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gray-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {matriculas.map((m: { id: number; disciplina: string; professor: string; sala: string; diaSemana: string; horaInicio: string; horaFim: string; ano: number; semestre: number; status: string }) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{m.disciplina}</td>
                  <td className="px-4 py-3 text-gray-600">{m.professor}</td>
                  <td className="px-4 py-3 text-gray-600">{m.sala}</td>
                  <td className="px-4 py-3 text-gray-600">{m.diaSemana} {m.horaInicio}–{m.horaFim}</td>
                  <td className="px-4 py-3 text-gray-600">{m.ano}/{m.semestre}º</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      m.status === 'ATIVA' ? 'bg-green-100 text-green-700' :
                      m.status === 'TRANCADA' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>{m.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
