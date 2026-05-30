import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useState } from 'react'
import { Search } from 'lucide-react'

export default function AdminAlunos() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['admin-alunos', page, search],
    queryFn: () => api.get(`/alunos?page=${page}&size=15${search ? `&search=${search}` : ''}`).then(r => r.data),
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Alunos</h1>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" placeholder="Buscar aluno..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}</div>
      ) : (
        <>
          <div className="bg-white border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>{['RA', 'Nome', 'E-mail', 'Curso', 'Status'].map(h => <th key={h} className="px-4 py-3 text-left font-semibold text-gray-700">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {(data?.content ?? []).map((a: { id: number; ra: string; nome: string; email: string; curso: string; status: string }) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-gray-700 text-xs">{a.ra}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{a.nome}</td>
                    <td className="px-4 py-3 text-gray-600">{a.email}</td>
                    <td className="px-4 py-3 text-gray-600">{a.curso}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.status === 'ATIVO' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data && (
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <span>{data.totalElements} alunos no total</span>
              <div className="flex gap-2">
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 border rounded-md disabled:opacity-40 hover:bg-gray-50">Anterior</button>
                <button disabled={data.last} onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 border rounded-md disabled:opacity-40 hover:bg-gray-50">Próxima</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
