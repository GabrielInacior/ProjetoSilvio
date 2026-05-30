import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, Trash2 } from 'lucide-react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type FormData = {
  nome: string
  codigo: string
  cargaHoraria: number
  ementa?: string
  semestreSugerido?: number
}
const schema: z.ZodType<FormData> = z.object({
  nome: z.string().min(2),
  codigo: z.string().min(2),
  cargaHoraria: z.coerce.number().min(1),
  ementa: z.string().optional(),
  semestreSugerido: z.coerce.number().optional(),
})

export default function AdminDisciplinas() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const { data, isLoading } = useQuery({
    queryKey: ['admin-disciplinas'],
    queryFn: () => api.get('/disciplinas').then(r => r.data),
  })
  const disciplinas = Array.isArray(data) ? data : data?.content ?? []

  const { register, handleSubmit, reset } = useForm<FormData>({ resolver: zodResolver(schema as any) as Resolver<FormData> })

  const criar = useMutation({
    mutationFn: (d: FormData) => api.post('/disciplinas', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-disciplinas'] }); toast.success('Disciplina criada!'); setShowForm(false); reset() },
    onError: () => toast.error('Erro ao criar disciplina.'),
  })

  const deletar = useMutation({
    mutationFn: (id: number) => api.delete(`/disciplinas/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-disciplinas'] }); toast.success('Disciplina removida.') },
    onError: () => toast.error('Erro ao remover.'),
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Disciplinas</h1>
        <Button onClick={() => setShowForm(true)} className="bg-blue-700 hover:bg-blue-800"><Plus size={16} className="mr-1" /> Nova disciplina</Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-5">
            <form onSubmit={handleSubmit((d) => criar.mutate(d))} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[['nome', 'Nome'], ['codigo', 'Codigo']].map(([f, l]) => (
                <div key={f} className="space-y-1">
                  <Label>{l}</Label>
                  <Input {...register(f as keyof FormData)} />
                </div>
              ))}
              <div className="space-y-1">
                <Label>Carga horaria (h)</Label>
                <Input type="number" {...register('cargaHoraria')} />
              </div>
              <div className="space-y-1">
                <Label>Semestre sugerido</Label>
                <Input type="number" {...register('semestreSugerido')} />
              </div>
              <div className="col-span-full space-y-1">
                <Label>Ementa</Label>
                <textarea {...register('ementa')} rows={2} className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="col-span-full flex gap-2 justify-end">
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
                <Button type="submit" disabled={criar.isPending} className="bg-blue-700 hover:bg-blue-800">{criar.isPending ? 'Criando...' : 'Criar'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={`skel-${i}`} className="h-10 w-full" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>{['Codigo', 'Nome', 'Carga horaria', 'Semestre sugerido', ''].map(h => <TableHead key={h}>{h}</TableHead>)}</TableRow>
              </TableHeader>
              <TableBody>
                {disciplinas.map((d: { id: number; codigo: string; nome: string; cargaHoraria: number; semestreSugerido?: number }) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-mono text-xs">{d.codigo}</TableCell>
                    <TableCell className="font-medium">{d.nome}</TableCell>
                    <TableCell className="text-muted-foreground">{d.cargaHoraria}h</TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">{d.semestreSugerido ? d.semestreSugerido + 'o' : '-'}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"
                        onClick={() => { if (confirm('Remover disciplina?')) deletar.mutate(d.id) }}>
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
