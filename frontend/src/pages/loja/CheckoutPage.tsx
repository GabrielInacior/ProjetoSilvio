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
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

const schema = z.object({
  enderecoEntrega: z.string().min(5, 'Informe o endereço completo'),
  observacoes: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function CheckoutPage() {
  const { items, total, clear } = useCartStore()
  const { usuario } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={48} className="mx-auto text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-bold mb-2">Carrinho vazio</h2>
        <Button variant="link" asChild><Link to="/loja">Voltar à loja</Link></Button>
      </div>
    )
  }

  const onSubmit = async (d: FormData) => {
    setSubmitting(true)
    try {
      const res = await api.post('/pedidos/checkout', {
        itens: items.map(i => ({ produtoId: i.produtoId, quantidade: i.quantidade })),
        enderecoEntrega: d.enderecoEntrega,
        observacoes: d.observacoes ?? '',
      })
      clear()
      // invalida cache para que a tela de pedidos recarregue imediatamente
      await queryClient.invalidateQueries({ queryKey: ['aluno-pedidos'] })
      await queryClient.invalidateQueries({ queryKey: ['prof-pedidos'] })
      const pedidoId = (res.data as { id?: number })?.id
      const label = pedidoId ? `Pedido #${pedidoId} realizado!` : 'Pedido realizado!'
      toast.success(label, {
        description: 'Um e-mail de confirmação foi enviado para você.',
        duration: 6000,
      })
      navigate(usuario?.tipo === 'PROFESSOR' ? '/prof/pedidos' : '/app/pedidos')
    } catch {
      toast.error('Erro ao finalizar pedido. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold mb-8">Finalizar pedido</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-5">
          {usuario && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-primary">
              Pedido para: <strong>{usuario.email}</strong>
            </div>
          )}
          <div className="space-y-1">
            <Label htmlFor="enderecoEntrega">Endereço de entrega</Label>
            <Input id="enderecoEntrega" {...register('enderecoEntrega')} placeholder="Rua, número, bairro, cidade, CEP" />
            {errors.enderecoEntrega && <p className="text-destructive text-xs">{errors.enderecoEntrega.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <textarea
              id="observacoes"
              {...register('observacoes')}
              rows={3}
              placeholder="Ex: não retirar da embalagem, deixar com porteiro..."
              className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Processando...' : 'Confirmar pedido'}
          </Button>
          <Button variant="ghost" className="w-full text-muted-foreground" asChild>
            <Link to="/carrinho">Voltar ao carrinho</Link>
          </Button>
        </form>

        <Card className="h-fit"><CardContent className="p-5">
          <h3 className="font-semibold mb-4">Resumo</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            {items.map(item => (
              <div key={item.produtoId} className="flex justify-between">
                <span className="truncate mr-2">{item.nome} × {item.quantidade}</span>
                <span className="shrink-0">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-3 pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span>R$ {total().toFixed(2)}</span>
          </div>
        </CardContent></Card>
      </div>
    </div>
  )
}
