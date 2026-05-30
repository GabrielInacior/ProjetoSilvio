import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Package, MapPin, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

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

const statusColor: Record<string, string> = {
  CONFIRMADO: 'bg-green-100 text-green-700',
  PENDENTE:   'bg-yellow-100 text-yellow-700',
  CANCELADO:  'bg-red-100 text-red-500',
  ENTREGUE:   'bg-blue-100 text-blue-700',
}

function PedidoCard({ p }: { readonly p: Pedido }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <Package size={20} className="text-emerald-600 shrink-0" />
          <div>
            <p className="font-semibold text-gray-900">Pedido #{p.id}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {new Date(p.criadoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              {' · '}{p.quantidadeItens} {p.quantidadeItens === 1 ? 'item' : 'itens'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-bold text-gray-900">R$ {p.valorTotal?.toFixed(2)}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[p.status] ?? 'bg-gray-100 text-gray-600'}`}>
              {p.status}
            </span>
          </div>
          {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="border-t px-5 pb-5 pt-4 space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Itens</p>
            <div className="space-y-2">
              {p.itens.map((item, i) => (
                <div key={`${item.nome}-${String(i)}`} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{item.nome} <span className="text-gray-400">× {item.quantidade}</span></span>
                  <span className="font-medium text-gray-900">R$ {item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm font-bold border-t pt-2 mt-2 text-gray-900">
              <span>Total</span>
              <span className="text-emerald-700">R$ {p.valorTotal?.toFixed(2)}</span>
            </div>
          </div>
          {p.enderecoEntrega && (
            <div className="flex gap-2 text-sm text-gray-600">
              <MapPin size={15} className="shrink-0 mt-0.5 text-gray-400" />
              <span>{p.enderecoEntrega}</span>
            </div>
          )}
          {p.observacoes && (
            <div className="flex gap-2 text-sm text-gray-600">
              <MessageSquare size={15} className="shrink-0 mt-0.5 text-gray-400" />
              <span>{p.observacoes}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ProfPedidos() {
  const { data, isLoading } = useQuery({
    queryKey: ['prof-pedidos'],
    queryFn: () => api.get('/pedidos?size=20').then((r) => r.data),
  })

  const pedidos: Pedido[] = data?.content ?? []

  function renderContent() {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={`skel-${String(i)}`} className="h-20 bg-gray-100 rounded-lg animate-pulse" />)}
        </div>
      )
    }
    if (pedidos.length === 0) {
      return (
        <div className="text-center py-20 text-gray-400">
          <Package size={40} className="mx-auto mb-3 opacity-50" />
          <p>Nenhum pedido encontrado.</p>
          <Link to="/loja" className="text-sm text-emerald-700 hover:underline mt-2 inline-block">
            Visitar a loja
          </Link>
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meus Pedidos</h1>
        <Link to="/loja"
          className="text-sm bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors">
          Ir à loja
        </Link>
      </div>
      {renderContent()}
    </div>
  )
}
