import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Package, MapPin, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

type ItemPedido = {
  nome: string
  quantidade: number
  precoUnitario: number
  subtotal: number
}

type Pedido = {
  id: number
  status: string
  valorTotal: number
  quantidadeItens: number
  enderecoEntrega?: string
  observacoes?: string
  criadoEm: string
  itens: ItemPedido[]
}

const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'default'> = {
  CONFIRMADO: 'success',
  PENDENTE: 'warning',
  CANCELADO: 'destructive',
  ENTREGUE: 'default',
}

function PedidoCard({ p }: { readonly p: Pedido }) {
  const [open, setOpen] = useState(false)

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <Package size={20} className="text-blue-600 shrink-0" />
          <div>
            <p className="font-semibold">Pedido #{p.id}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date(p.criadoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              {' · '}{p.quantidadeItens} {p.quantidadeItens === 1 ? 'item' : 'itens'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-bold">R$ {p.valorTotal?.toFixed(2)}</p>
            <Badge variant={statusVariant[p.status] ?? 'secondary'}>{p.status}</Badge>
          </div>
          {open ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
        </div>
      </button>

      {open && (
        <div className="border-t px-5 pb-5 pt-4 space-y-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Itens</p>
            <div className="space-y-2">
              {p.itens.map((item, i) => (
                <div key={`${item.nome}-${String(i)}`} className="flex items-center justify-between text-sm">
                  <span>{item.nome} <span className="text-muted-foreground">× {item.quantidade}</span></span>
                  <span className="font-medium">R$ {item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm font-bold border-t pt-2 mt-2">
              <span>Total</span>
              <span className="text-blue-700">R$ {p.valorTotal?.toFixed(2)}</span>
            </div>
          </div>
          {p.enderecoEntrega && (
            <div className="flex gap-2 text-sm text-muted-foreground">
              <MapPin size={15} className="shrink-0 mt-0.5" />
              <span>{p.enderecoEntrega}</span>
            </div>
          )}
          {p.observacoes && (
            <div className="flex gap-2 text-sm text-muted-foreground">
              <MessageSquare size={15} className="shrink-0 mt-0.5" />
              <span>{p.observacoes}</span>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

export default function AlunoPedidos() {
  const { data, isLoading } = useQuery({
    queryKey: ['aluno-pedidos'],
    queryFn: () => api.get('/pedidos?size=20').then((r) => r.data),
  })

  const pedidos: Pedido[] = data?.content ?? []

  function renderContent() {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={`skel-${String(i)}`} className="h-20 w-full" />)}
        </div>
      )
    }
    if (pedidos.length === 0) {
      return (
        <div className="text-center py-20 text-muted-foreground">
          <Package size={40} className="mx-auto mb-3 opacity-50" />
          <p>Nenhum pedido encontrado.</p>
          <p className="text-sm mt-1">Visite a loja e faça seu primeiro pedido!</p>
        </div>
      )
    }
    return (
      <div className="space-y-4">
        {pedidos.map((p) => <PedidoCard key={p.id} p={p} />)}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Meus Pedidos</h1>
      {renderContent()}
    </div>
  )
}
