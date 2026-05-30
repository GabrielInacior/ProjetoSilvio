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
  descricao: z.string().optional(),
  dataInicio: z.string().min(1),
  dataFim: z.string().optional(),
  local: z.string().optional(),
  tipo: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function AdminEventos() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const { data: eventos = [], isLoading } = useQuery({
    queryKey: ['admin-eventos'],
    queryFn: () => api.get('/eventos').then(r => r.data),
  })

  const { register, handleSubmit, reset } = useForm<FormData>({ resolver: zodResolver(schema) })

  const criar = useMutation({
    mutationFn: (d: FormData) => api.post('/eventos', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-eventos'] }); toast.success('Evento criado!'); setShowForm(false); reset() },
    onError: () => toast.error('Erro ao criar evento.'),
  })

  const deletar = useMutation({
    mutationFn: (id: number) => api.delete(`/eventos/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-eventos'] }); toast.success('Evento removido.') },
    onError: () => toast.error('Erro ao remover evento.'),
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1 bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800">
          <Plus size={16} /> Novo evento
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit((d) => criar.mutate(d))} className="bg-white border rounded-xl p-5 mb-6 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Título</label>
            <input {...register('titulo')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          {[['dataInicio', 'Data/Hora início', 'datetime-local'], ['dataFim', 'Data/Hora fim', 'datetime-local']].map(([f, l, t]) => (
            <div key={f}>
              <label className="block text-xs font-medium text-gray-700 mb-1">{l}</label>
              <input type={t} {...register(f as keyof FormData)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
          {[['local', 'Local'], ['tipo', 'Tipo']].map(([f, l]) => (
            <div key={f}>
              <label className="block text-xs font-medium text-gray-700 mb-1">{l}</label>
              <input {...register(f as keyof FormData)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}</div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>{['Título', 'Tipo', 'Data início', 'Local', ''].map(h => <th key={h} className="px-4 py-3 text-left font-semibold text-gray-700">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y">
              {(eventos as { id: number; titulo: string; tipo?: string; dataInicio: string; local?: string }[]).map((e) => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{e.titulo}</td>
                  <td className="px-4 py-3 text-gray-600">{e.tipo ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{new Date(e.dataInicio).toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3 text-gray-600">{e.local ?? '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => { if (confirm('Remover evento?')) deletar.mutate(e.id) }} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16} /></button>
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
