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
  slug: string
  descricao?: string
  modalidade?: string
  cargaHoraria?: number
  duracao?: string
  vagas?: number
  area?: string
  imagemUrl?: string
}
const schema: z.ZodType<FormData> = z.object({
  nome: z.string().min(2),
  slug: z.string().min(2),
  descricao: z.string().optional(),
  modalidade: z.string().optional(),
  cargaHoraria: z.coerce.number().optional(),
  duracao: z.string().optional(),
  vagas: z.coerce.number().optional(),
  area: z.string().optional(),
  imagemUrl: z.string().optional(),
})

export default function AdminCursos() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const { data: cursos = [], isLoading } = useQuery({
    queryKey: ['cursos'],
    queryFn: () => api.get('/cursos').then(r => r.data),
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema as any) as Resolver<FormData> })

  const criar = useMutation({
    mutationFn: (d: FormData) => api.post('/cursos', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cursos'] }); toast.success('Curso criado!'); setShowForm(false); reset() },
    onError: () => toast.error('Erro ao criar curso.'),
  })

  const deletar = useMutation({
    mutationFn: (id: number) => api.delete(`/cursos/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cursos'] }); toast.success('Curso removido.') },
    onError: () => toast.error('Erro ao remover curso.'),
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cursos</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1 bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800">
          <Plus size={16} /> Novo curso
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit((d) => criar.mutate(d))} className="bg-white border rounded-xl p-5 mb-6 grid grid-cols-2 gap-4">
          {[['nome', 'Nome'], ['slug', 'Slug'], ['area', 'Área'], ['modalidade', 'Modalidade'], ['duracao', 'Duração'], ['imagemUrl', 'URL da imagem']].map(([field, label]) => (
            <div key={field}>
              <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
              <input {...register(field as keyof FormData)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
          {[['cargaHoraria', 'Carga horária (h)'], ['vagas', 'Vagas']].map(([field, label]) => (
            <div key={field}>
              <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
              <input type="number" {...register(field as keyof FormData)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
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
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />)}</div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>{['Nome', 'Slug', 'Área', 'Carga horária', 'Vagas', ''].map(h => <th key={h} className="px-4 py-3 text-left font-semibold text-gray-700">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y">
              {cursos.map((c: { id: number; nome: string; slug: string; area?: string; cargaHoraria?: number; vagas?: number }) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{c.nome}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{c.slug}</td>
                  <td className="px-4 py-3 text-gray-600">{c.area ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{c.cargaHoraria ? `${c.cargaHoraria}h` : '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{c.vagas ?? '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => { if (confirm('Remover curso?')) deletar.mutate(c.id) }}
                      className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16} /></button>
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
