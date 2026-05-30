import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function AlunoNotas() {
  const { data: notas = [], isLoading } = useQuery({
    queryKey: ['aluno-notas'],
    queryFn: () => api.get('/aluno/notas').then((r) => r.data),
  })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Minhas Notas</h1>
      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={`skel-${i}`} className="h-12 w-full" />)}</div>
      ) : notas.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">Nenhuma nota registrada.</div>
      ) : (
        <Card><CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>{['Disciplina', 'Tipo', 'Valor', 'Peso', 'Data', 'Descrição'].map(h => <TableHead key={h}>{h}</TableHead>)}</TableRow>
            </TableHeader>
            <TableBody>
              {(notas as { id: number; disciplina: string; tipo: string; valor: number; peso: number; dataAvaliacao: string; descricao?: string }[]).map((n) => (
                <TableRow key={n.id}>
                  <TableCell className="font-medium">{n.disciplina}</TableCell>
                  <TableCell className="text-muted-foreground">{n.tipo}</TableCell>
                  <TableCell>
                    <span className={`font-bold ${n.valor >= 6 ? 'text-green-600' : 'text-red-500'}`}>{n.valor?.toFixed(1)}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{n.peso}x</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {n.dataAvaliacao ? new Date(n.dataAvaliacao).toLocaleDateString('pt-BR') : '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs hidden lg:table-cell">{n.descricao ?? '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
    </div>
  )
}
