import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Package } from 'lucide-react'

export default function AlunoPedidos() {
  const { data, isLoading } = useQuery({
    queryKey: ['aluno-pedidos'],
    queryFn: () => api.get('/pedidos?size=20').then((r) => r.data),
  })

  const pedidos = data?.content ?? []

  const statusColor: Record<string, string> = {
    CONFIRMADO: 'bg-green-100 text-green-700',
    PENDENTE: 'bg-yellow-100 text-yellow-700',
    CANCELADO: 'bg-red-100 text-red-500',
    ENTREGUE: 'bg-blue-100 text-blue-700',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Meus Pedidos</h1>
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />)}
        </div>
      ) : pedidos.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Package size={40} className="mx-auto mb-3 opacity-50" />
          <p>Nenhum pedido encontrado.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((p: { id: number; status: string; total: number; criadoEm: string; itens?: { nome: string; quantidade: number; precoUnitario: number }[] }) => (
            <div key={p.id} className="bg-white border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-xs text-gray-500">Pedido #{p.id}</span>
                  <p className="font-semibold text-gray-900">R$ {p.total?.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[p.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {p.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(p.criadoEm).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              {p.itens && p.itens.length > 0 && (
                <div className="border-t pt-3 space-y-1">
                  {p.itens.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm text-gray-600">
                      <span>{item.nome} × {item.quantidade}</span>
                      <span>R$ {(item.precoUnitario * item.quantidade).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
