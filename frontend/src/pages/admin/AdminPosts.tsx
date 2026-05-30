import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  titulo: z.string().min(2),
  slug: z.string().min(2),
  resumo: z.string().optional(),
  conteudoMd: z.string().optional(),
  autor: z.string().optional(),
  imagemCapa: z.string().optional(),
  tags: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function AdminPosts() {
  const qc = useQueryClient()
  const [page, setPage] = useState(0)
  const [showForm, setShowForm] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-posts', page],
    queryFn: () => api.get(`/posts?page=${page}&size=10`).then(r => r.data),
  })

  const { register, handleSubmit, reset } = useForm<FormData>({ resolver: zodResolver(schema) })

  const criar = useMutation({
    mutationFn: (d: FormData) => api.post('/posts', { ...d, tags: d.tags?.split(',').map(t => t.trim()).filter(Boolean) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-posts'] }); toast.success('Post criado!'); setShowForm(false); reset() },
    onError: () => toast.error('Erro ao criar post.'),
  })

  const deletar = useMutation({
    mutationFn: (id: number) => api.delete(`/posts/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-posts'] }); toast.success('Post removido.') },
    onError: () => toast.error('Erro ao remover post.'),
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1 bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800">
          <Plus size={16} /> Novo post
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit((d) => criar.mutate(d))} className="bg-white border rounded-xl p-5 mb-6 grid grid-cols-2 gap-4">
          {[['titulo', 'Título'], ['slug', 'Slug'], ['autor', 'Autor'], ['imagemCapa', 'URL da imagem'], ['tags', 'Tags (separadas por vírgula)']].map(([f, l]) => (
            <div key={f} className={f === 'tags' ? 'col-span-2' : ''}>
              <label className="block text-xs font-medium text-gray-700 mb-1">{l}</label>
              <input {...register(f as keyof FormData)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Resumo</label>
            <textarea {...register('resumo')} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Conteúdo (Markdown)</label>
            <textarea {...register('conteudoMd')} rows={6} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="col-span-2 flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 px-4 py-2">Cancelar</button>
            <button type="submit" disabled={criar.isPending} className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60">
              {criar.isPending ? 'Criando...' : 'Publicar'}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}</div>
      ) : (
        <>
          <div className="bg-white border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>{['Título', 'Autor', 'Publicado em', 'Tags', ''].map(h => <th key={h} className="px-4 py-3 text-left font-semibold text-gray-700">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {(data?.content ?? []).map((p: { id: number; titulo: string; autor?: string; publicadoEm: string; tags?: string[] }) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{p.titulo}</td>
                    <td className="px-4 py-3 text-gray-600">{p.autor ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{new Date(p.publicadoEm).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3">{p.tags?.slice(0,2).map(t => <span key={t} className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded mr-1">{t}</span>)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => { if (confirm('Remover post?')) deletar.mutate(p.id) }} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data && (
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <span>{data.totalElements} posts</span>
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
