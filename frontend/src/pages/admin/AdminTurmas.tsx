import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useState } from 'react'

export default function AdminTurmas() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useQuery({
    queryKey: ['admin-turmas', page],
    queryFn: () => api.get(`/turmas?page=${page}&size=15`).then(r => r.data),
  })
  const turmas = Array.isArray(data) ? data : data?.content ?? []
  const totalElements = data?.totalElements
  const isLast = Array.isArray(data) ? true : data?.last

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Turmas</h1>
      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}</div>
      ) : (
        <>
          <div className="bg-white border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>{['Disciplina', 'Professor', 'Ano/Sem', 'Sala', 'Dia/Hora', 'Vagas', 'Status'].map(h => <th key={h} className="px-4 py-3 text-left font-semibold text-gray-700">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {turmas.map((t: { id: number; disciplina: string; professor: string; ano: number; semestre: number; sala: string; diaSemana: string; horaInicio: string; horaFim: string; vagas: number; status: string }) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{t.disciplina}</td>
                    <td className="px-4 py-3 text-gray-600">{t.professor}</td>
                    <td className="px-4 py-3 text-gray-600">{t.ano}/{t.semestre}º</td>
                    <td className="px-4 py-3 text-gray-600">{t.sala}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{t.diaSemana} {t.horaInicio}–{t.horaFim}</td>
                    <td className="px-4 py-3 text-gray-600">{t.vagas}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.status === 'ATIVA' ? 'bg-green-100 text-green-700' : t.status === 'CANCELADA' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            {totalElements && <span>{totalElements} turmas</span>}
            <div className="flex gap-2">
              <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 border rounded-md disabled:opacity-40 hover:bg-gray-50">Anterior</button>
              <button disabled={isLast} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border rounded-md disabled:opacity-40 hover:bg-gray-50">Próxima</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
