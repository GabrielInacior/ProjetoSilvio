import { useCartStore } from '@/stores/cartStore'
import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function CarrinhoPage() {
  const { items, remove, updateQty, total } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={48} className="mx-auto text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-bold mb-2">Seu carrinho está vazio</h2>
        <p className="text-muted-foreground mb-6">Explore a loja e adicione produtos.</p>
        <Button asChild><Link to="/loja">Ir para a loja</Link></Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold mb-8">Carrinho</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.produtoId}><CardContent className="p-4 flex gap-4 items-center">
              <img
                src={item.imagemUrl ?? 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=100&q=70'}
                alt={item.nome}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.nome}</h3>
                <p className="text-primary font-bold mt-0.5">R$ {item.preco.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8"
                  onClick={() => updateQty(item.produtoId, item.quantidade - 1)}
                  disabled={item.quantidade <= 1}>
                  <Minus size={14} />
                </Button>
                <span className="w-8 text-center font-medium text-sm">{item.quantidade}</span>
                <Button variant="outline" size="icon" className="h-8 w-8"
                  onClick={() => updateQty(item.produtoId, item.quantidade + 1)}>
                  <Plus size={14} />
                </Button>
              </div>
              <div className="text-right min-w-[70px]">
                <p className="font-bold">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
              </div>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"
                onClick={() => remove(item.produtoId)}>
                <Trash2 size={18} />
              </Button>
            </CardContent></Card>
          ))}
        </div>

        <Card className="h-fit sticky top-20"><CardContent className="p-5">
          <h3 className="font-semibold mb-4">Resumo do pedido</h3>
          <div className="space-y-2 text-sm text-muted-foreground mb-4">
            {items.map((item) => (
              <div key={item.produtoId} className="flex justify-between">
                <span className="truncate mr-2">{item.nome} × {item.quantidade}</span>
                <span className="shrink-0">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>R$ {total().toFixed(2)}</span>
          </div>
          <Button className="mt-5 w-full" asChild>
            <Link to="/checkout">Finalizar pedido</Link>
          </Button>
          <Button variant="ghost" className="mt-2 w-full text-muted-foreground" asChild>
            <Link to="/loja">Continuar comprando</Link>
          </Button>
        </CardContent></Card>
      </div>
    </div>
  )
}
