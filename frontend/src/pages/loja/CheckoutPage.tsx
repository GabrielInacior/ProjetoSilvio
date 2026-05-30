import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/lib/api'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'

const schema = z.object({
  enderecoEntrega: z.string().min(5, 'Informe o endereço completo'),
  observacoes: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function CheckoutPage() {
  const { items, total, clear } = useCartStore()
  const { usuario } = useAuthStore()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Carrinho vazio</h2>
        <Link to="/loja" className="text-blue-700 hover:underline text-sm">Voltar à loja</Link>
      </div>
    )
  }

  const onSubmit = async (d: FormData) => {
    setSubmitting(true)
    try {
      await api.post('/pedidos/checkout', {
        itens: items.map(i => ({ produtoId: i.produtoId, quantidade: i.quantidade })),
        enderecoEntrega: d.enderecoEntrega,
        observacoes: d.observacoes ?? '',
      })
      clear()
      toast.success('Pedido realizado com sucesso!')
      navigate('/app/pedidos')
    } catch {
      toast.error('Erro ao finalizar pedido. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Finalizar pedido</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-5">
          {usuario && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
              Pedido para: <strong>{usuario.email}</strong>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Endereço de entrega</label>
            <input
              {...register('enderecoEntrega')}
              placeholder="Rua, número, bairro, cidade, CEP"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.enderecoEntrega && <p className="text-red-500 text-xs mt-1">{errors.enderecoEntrega.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações (opcional)</label>
            <textarea
              {...register('observacoes')}
              rows={3}
              placeholder="Ex: não retirar da embalagem, deixar com porteiro..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" disabled={submitting}
            className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 disabled:opacity-60 transition-colors">
            {submitting ? 'Processando...' : 'Confirmar pedido'}
          </button>
          <Link to="/carrinho" className="w-full flex justify-center text-sm text-gray-500 hover:text-blue-700 transition-colors">
            Voltar ao carrinho
          </Link>
        </form>

        <div className="bg-white border rounded-xl p-5 h-fit">
          <h3 className="font-semibold text-gray-900 mb-4">Resumo</h3>
          <div className="space-y-2 text-sm text-gray-600">
            {items.map(item => (
              <div key={item.produtoId} className="flex justify-between">
                <span className="truncate mr-2">{item.nome} × {item.quantidade}</span>
                <span className="shrink-0">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-3 pt-3 flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span>R$ {total().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
