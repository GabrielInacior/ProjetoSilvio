import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function AdminAlunos() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['admin-alunos', page, search],
    queryFn: () => api.get(`/alunos?page=${page}&size=15${search ? `&search=${search}` : ''}`).then(r => r.data),
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Alunos</h1>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text" placeholder="Buscar aluno..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            className="pl-9"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {['RA', 'Nome', 'E-mail', 'Curso', 'Status'].map(h => <TableHead key={h}>{h}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.content ?? []).map((a: { id: number; ra: string; nome: string; email: string; curso: string; status: string }) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-xs">{a.ra}</TableCell>
                    <TableCell className="font-medium">{a.nome}</TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">{a.email}</TableCell>
                    <TableCell className="text-muted-foreground hidden lg:table-cell">{a.curso}</TableCell>
                    <TableCell>
                      <Badge variant={a.status === 'ATIVO' ? 'success' : 'secondary'}>{a.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {data && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>{data.totalElements} alunos no total</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Anterior</Button>
            <Button variant="outline" size="sm" disabled={data.last} onClick={() => setPage(p => p + 1)}>Próxima</Button>
          </div>
        </div>
      )}
    </div>
  )
}
