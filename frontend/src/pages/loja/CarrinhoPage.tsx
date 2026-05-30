import { useCartStore } from '@/stores/cartStore'
import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'

export default function CarrinhoPage() {
  const { items, remove, updateQty, total } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Seu carrinho está vazio</h2>
        <p className="text-gray-500 mb-6">Explore a loja e adicione produtos.</p>
        <Link to="/loja" className="bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
          Ir para a loja
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Carrinho</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.produtoId} className="bg-white border rounded-xl p-4 flex gap-4 items-center">
              <img
                src={item.imagemUrl ?? 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=100&q=70'}
                alt={item.nome}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.nome}</h3>
                <p className="text-blue-700 font-bold mt-0.5">R$ {item.preco.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQty(item.produtoId, item.quantidade - 1)}
                  disabled={item.quantidade <= 1}
                  className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-40">
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-medium text-sm">{item.quantidade}</span>
                <button onClick={() => updateQty(item.produtoId, item.quantidade + 1)}
                  className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-50">
                  <Plus size={14} />
                </button>
              </div>
              <div className="text-right min-w-[70px]">
                <p className="font-bold text-gray-900">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
              </div>
              <button onClick={() => remove(item.produtoId)} className="text-red-400 hover:text-red-600 p-1">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white border rounded-xl p-5 h-fit sticky top-20">
          <h3 className="font-semibold text-gray-900 mb-4">Resumo do pedido</h3>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            {items.map((item) => (
              <div key={item.produtoId} className="flex justify-between">
                <span className="truncate mr-2">{item.nome} × {item.quantidade}</span>
                <span className="shrink-0">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between font-bold text-gray-900 text-lg">
            <span>Total</span>
            <span>R$ {total().toFixed(2)}</span>
          </div>
          <Link to="/checkout"
            className="mt-5 w-full flex items-center justify-center bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors">
            Finalizar pedido
          </Link>
          <Link to="/loja" className="mt-2 w-full flex items-center justify-center text-gray-500 text-sm hover:text-blue-700 transition-colors">
            Continuar comprando
          </Link>
        </div>
      </div>
    </div>
  )
}
