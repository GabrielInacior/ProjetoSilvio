import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useState } from 'react'

export default function AdminProfessores() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useQuery({
    queryKey: ['admin-professores', page],
    queryFn: () => api.get(`/professores?page=${page}&size=15`).then(r => r.data),
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Professores</h1>
      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}</div>
      ) : (
        <>
          <div className="bg-white border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>{['SIAPE', 'Nome', 'E-mail', 'Titulação', 'CPF'].map(h => <th key={h} className="px-4 py-3 text-left font-semibold text-gray-700">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {(data?.content ?? []).map((p: { id: number; siape: string; nome: string; email: string; titulacao: string; cpf: string }) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-gray-700 text-xs">{p.siape}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{p.nome}</td>
                    <td className="px-4 py-3 text-gray-600">{p.email}</td>
                    <td className="px-4 py-3 text-gray-600">{p.titulacao}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{p.cpf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data && (
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <span>{data.totalElements} professores</span>
              <div className="flex gap-2">
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 border rounded-md disabled:opacity-40 hover:bg-gray-50">Anterior</button>
                <button disabled={data.last} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border rounded-md disabled:opacity-40 hover:bg-gray-50">Próxima</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
