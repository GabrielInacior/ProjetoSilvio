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

  const { register, handleSubmit, reset } = useForm<FormData>({ resolver: zodResolver(schema as any) as Resolver<FormData> })

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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Cursos</h1>
        <Button onClick={() => setShowForm(true)} className="bg-blue-700 hover:bg-blue-800"><Plus size={16} className="mr-1" /> Novo curso</Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-5">
            <form onSubmit={handleSubmit((d) => criar.mutate(d))} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[['nome', 'Nome'], ['slug', 'Slug'], ['area', 'Área'], ['modalidade', 'Modalidade'], ['duracao', 'Duração'], ['imagemUrl', 'URL da imagem']].map(([field, label]) => (
                <div key={field} className="space-y-1">
                  <Label>{label}</Label>
                  <Input {...register(field as keyof FormData)} />
                </div>
              ))}
              {[['cargaHoraria', 'Carga horária (h)'], ['vagas', 'Vagas']].map(([field, label]) => (
                <div key={field} className="space-y-1">
                  <Label>{label}</Label>
                  <Input type="number" {...register(field as keyof FormData)} />
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
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={`skel-${i}`} className="h-10 w-full" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>{['Nome', 'Slug', 'Área', 'Carga horária', 'Vagas', ''].map(h => <TableHead key={h}>{h}</TableHead>)}</TableRow>
              </TableHeader>
              <TableBody>
                {cursos.map((c: { id: number; nome: string; slug: string; area?: string; cargaHoraria?: number; vagas?: number }) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.nome}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{c.slug}</TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">{c.area ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground hidden lg:table-cell">{c.cargaHoraria ? `${c.cargaHoraria}h` : '—'}</TableCell>
                    <TableCell className="text-muted-foreground hidden xl:table-cell">{c.vagas ?? '—'}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"
                        onClick={() => { if (confirm('Remover curso?')) deletar.mutate(c.id) }}>
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
