import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, Trash2 } from 'lucide-react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

type FormData = {
  nome: string
  descricao?: string
  preco: number
  estoque: number
  categoria?: string
  imagemUrl?: string
}
const schema: z.ZodType<FormData> = z.object({
  nome: z.string().min(2),
  descricao: z.string().optional(),
  preco: z.coerce.number().min(0),
  estoque: z.coerce.number().min(0),
  categoria: z.string().optional(),
  imagemUrl: z.string().optional(),
})

export default function AdminProdutos() {
  const qc = useQueryClient()
  const [page, setPage] = useState(0)
  const [showForm, setShowForm] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-produtos', page],
    queryFn: () => api.get(`/produtos?page=${page}&size=12`).then(r => r.data),
  })

  const { register, handleSubmit, reset } = useForm<FormData>({ resolver: zodResolver(schema as any) as Resolver<FormData> })

  const criar = useMutation({
    mutationFn: (d: FormData) => api.post('/produtos', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-produtos'] }); toast.success('Produto criado!'); setShowForm(false); reset() },
    onError: () => toast.error('Erro ao criar produto.'),
  })

  const deletar = useMutation({
    mutationFn: (id: number) => api.delete(`/produtos/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-produtos'] }); toast.success('Produto removido.') },
    onError: () => toast.error('Erro ao remover produto.'),
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1 bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800">
          <Plus size={16} /> Novo produto
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit((d) => criar.mutate(d))} className="bg-white border rounded-xl p-5 mb-6 grid grid-cols-2 gap-4">
          {[['nome', 'Nome'], ['categoria', 'Categoria'], ['imagemUrl', 'URL da imagem']].map(([f, l]) => (
            <div key={f}>
              <label className="block text-xs font-medium text-gray-700 mb-1">{l}</label>
              <input {...register(f as keyof FormData)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Preço (R$)</label>
            <input type="number" step="0.01" {...register('preco')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Estoque</label>
            <input type="number" {...register('estoque')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Descrição</label>
            <textarea {...register('descricao')} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="col-span-2 flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 px-4 py-2">Cancelar</button>
            <button type="submit" disabled={criar.isPending} className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60">
              {criar.isPending ? 'Criando...' : 'Criar'}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}</div>
      ) : (
        <>
          <div className="bg-white border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>{['Nome', 'Categoria', 'Preço', 'Estoque', ''].map(h => <th key={h} className="px-4 py-3 text-left font-semibold text-gray-700">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {(data?.content ?? []).map((p: { id: number; nome: string; categoria?: string; preco: number; estoque: number }) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{p.nome}</td>
                    <td className="px-4 py-3 text-gray-600">{p.categoria ?? '—'}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">R$ {p.preco?.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${p.estoque > 10 ? 'text-green-600' : p.estoque > 0 ? 'text-yellow-600' : 'text-red-500'}`}>
                        {p.estoque} un.
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => { if (confirm('Remover produto?')) deletar.mutate(p.id) }} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data && (
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <span>{data.totalElements} produtos</span>
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
