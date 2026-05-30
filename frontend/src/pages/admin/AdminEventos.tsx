import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Eventos</h1>
        <Button onClick={() => setShowForm(true)} className="bg-blue-700 hover:bg-blue-800"><Plus size={16} className="mr-1" /> Novo evento</Button>
      </div>

      {showForm && (
        <Card><CardContent className="p-5">
          <form onSubmit={handleSubmit((d) => criar.mutate(d))} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-full space-y-1">
              <Label>Título</Label>
              <Input {...register('titulo')} />
            </div>
            {[['dataInicio', 'Data/Hora início', 'datetime-local'], ['dataFim', 'Data/Hora fim', 'datetime-local']].map(([f, l, t]) => (
              <div key={f} className="space-y-1">
                <Label>{l}</Label>
                <Input type={t} {...register(f as keyof FormData)} />
              </div>
            ))}
            {[['local', 'Local'], ['tipo', 'Tipo']].map(([f, l]) => (
              <div key={f} className="space-y-1">
                <Label>{l}</Label>
                <Input {...register(f as keyof FormData)} />
              </div>
            ))}
            <div className="col-span-full space-y-1">
              <Label>Descrição</Label>
              <textarea {...register('descricao')} rows={2} className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="col-span-full flex gap-2 justify-end">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button type="submit" disabled={criar.isPending} className="bg-blue-700 hover:bg-blue-800">{criar.isPending ? 'Criando...' : 'Criar'}</Button>
            </div>
          </form>
        </CardContent></Card>
      )}

      <Card><CardContent className="p-0">
        {isLoading ? (
          <div className="p-4 space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={`skel-${i}`} className="h-10 w-full" />)}</div>
        ) : (
          <Table>
            <TableHeader><TableRow>{['Título', 'Tipo', 'Data início', 'Local', ''].map(h => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>
              {(eventos as { id: number; titulo: string; tipo?: string; dataInicio: string; local?: string }[]).map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.titulo}</TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">{e.tipo ?? '—'}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{new Date(e.dataInicio).toLocaleString('pt-BR')}</TableCell>
                  <TableCell className="text-muted-foreground hidden lg:table-cell">{e.local ?? '—'}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"
                      onClick={() => { if (confirm('Remover evento?')) deletar.mutate(e.id) }}>
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent></Card>
    </div>
  )
}
