import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function AdminProfessores() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useQuery({
    queryKey: ['admin-professores', page],
    queryFn: () => api.get(`/professores?page=${page}&size=15`).then(r => r.data),
  })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Professores</h1>
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
                  {['SIAPE', 'Nome', 'E-mail', 'Titulação', 'CPF'].map(h => <TableHead key={h}>{h}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.content ?? []).map((p: { id: number; siape: string; nome: string; email: string; titulacao: string; cpf: string }) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.siape}</TableCell>
                    <TableCell className="font-medium">{p.nome}</TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">{p.email}</TableCell>
                    <TableCell className="text-muted-foreground hidden lg:table-cell">{p.titulacao}</TableCell>
                    <TableCell className="text-muted-foreground text-xs hidden xl:table-cell">{p.cpf}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {data && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>{data.totalElements} professores</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Anterior</Button>
            <Button variant="outline" size="sm" disabled={data.last} onClick={() => setPage(p => p + 1)}>Próxima</Button>
          </div>
        </div>
      )}
    </div>
  )
}
