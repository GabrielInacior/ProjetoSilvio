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
  const produtos = Array.isArray(data) ? data : (data?.content ?? [])
  const totalElements = Array.isArray(data) ? data.length : data?.totalElements
  const isLast = Array.isArray(data) ? true : (data?.last ?? true)

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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Button onClick={() => setShowForm(true)} className="bg-blue-700 hover:bg-blue-800"><Plus size={16} className="mr-1" /> Novo produto</Button>
      </div>

      {showForm && (
        <Card><CardContent className="p-5">
          <form onSubmit={handleSubmit((d) => criar.mutate(d))} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[['nome', 'Nome'], ['categoria', 'Categoria'], ['imagemUrl', 'URL da imagem']].map(([f, l]) => (
              <div key={f} className="space-y-1">
                <Label>{l}</Label>
                <Input {...register(f as keyof FormData)} />
              </div>
            ))}
            <div className="space-y-1">
              <Label>Preço (R$)</Label>
              <Input type="number" step="0.01" {...register('preco')} />
            </div>
            <div className="space-y-1">
              <Label>Estoque</Label>
              <Input type="number" {...register('estoque')} />
            </div>
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
          <div className="p-4 space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={`skel-${i}`} className="h-10 w-full" />)}</div>
        ) : (
          <Table>
            <TableHeader><TableRow>{['Nome', 'Categoria', 'Preço', 'Estoque', ''].map(h => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>
              {produtos.map((p: { id: number; nome: string; categoria?: string; preco: number; estoque: number }) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.nome}</TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">{p.categoria ?? '—'}</TableCell>
                  <TableCell className="font-medium">R$ {p.preco?.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-medium ${
                      (() => {
                        if (p.estoque > 10) return 'text-green-600'
                        if (p.estoque > 0) return 'text-yellow-600'
                        return 'text-red-500'
                      })()
                    }`}>{p.estoque} un.</span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"
                      onClick={() => { if (confirm('Remover produto?')) deletar.mutate(p.id) }}>
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
          <span>{totalElements} produtos</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Anterior</Button>
            <Button variant="outline" size="sm" disabled={isLast} onClick={() => setPage(p => p + 1)}>Próxima</Button>
          </div>
        </div>
      )}
    </div>
  )
}
