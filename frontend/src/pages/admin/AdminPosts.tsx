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
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Button onClick={() => setShowForm(true)} className="bg-blue-700 hover:bg-blue-800"><Plus size={16} className="mr-1" /> Novo post</Button>
      </div>

      {showForm && (
        <Card><CardContent className="p-5">
          <form onSubmit={handleSubmit((d) => criar.mutate(d))} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[['titulo', 'Título'], ['slug', 'Slug'], ['autor', 'Autor'], ['imagemCapa', 'URL da imagem']].map(([f, l]) => (
              <div key={f} className="space-y-1">
                <Label>{l}</Label>
                <Input {...register(f as keyof FormData)} />
              </div>
            ))}
            <div className="col-span-full space-y-1">
              <Label>Tags (separadas por vírgula)</Label>
              <Input {...register('tags')} />
            </div>
            <div className="col-span-full space-y-1">
              <Label>Resumo</Label>
              <textarea {...register('resumo')} rows={2} className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="col-span-full space-y-1">
              <Label>Conteúdo (Markdown)</Label>
              <textarea {...register('conteudoMd')} rows={6} className="w-full border border-input rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="col-span-full flex gap-2 justify-end">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button type="submit" disabled={criar.isPending} className="bg-blue-700 hover:bg-blue-800">{criar.isPending ? 'Criando...' : 'Publicar'}</Button>
            </div>
          </form>
        </CardContent></Card>
      )}

      <Card><CardContent className="p-0">
        {isLoading ? (
          <div className="p-4 space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={`skel-${i}`} className="h-10 w-full" />)}</div>
        ) : (
          <Table>
            <TableHeader><TableRow>{['Título', 'Autor', 'Publicado em', 'Tags', ''].map(h => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>
              {(data?.content ?? []).map((p: { id: number; titulo: string; autor?: string; publicadoEm: string; tags?: string[] }) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.titulo}</TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">{p.autor ?? '—'}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{new Date(p.publicadoEm).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="hidden lg:table-cell">{p.tags?.slice(0,2).map(t => <Badge key={t} variant="secondary" className="mr-1 text-xs">{t}</Badge>)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"
                      onClick={() => { if (confirm('Remover post?')) deletar.mutate(p.id) }}>
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent></Card>

      {data && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>{data.totalElements} posts</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Anterior</Button>
            <Button variant="outline" size="sm" disabled={data.last} onClick={() => setPage(p => p + 1)}>Próxima</Button>
          </div>
        </div>
      )}
    </div>
  )
}
