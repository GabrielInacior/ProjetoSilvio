import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useCartStore } from '@/stores/cartStore'
import { ShoppingCart, ArrowLeft, Package } from 'lucide-react'
import { toast } from 'sonner'

export default function ProdutoDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { add } = useCartStore()

  const { data: produto, isLoading, isError } = useQuery({
    queryKey: ['produto', slug],
    queryFn: () => api.get(`/produtos/${slug}`).then(r => r.data),
  })

  if (isLoading) return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-400">Carregando...</div>
  if (isError || !produto) return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-red-500">Produto não encontrado.</div>

  const addToCart = () => {
    add({ produtoId: produto.id, nome: produto.nome, preco: produto.preco, imagemUrl: produto.imagemUrl })
    toast.success('Produto adicionado ao carrinho!')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link to="/loja" className="flex items-center gap-1 text-blue-700 text-sm font-medium mb-6 hover:gap-2 transition-all">
        <ArrowLeft size={16} /> Voltar à loja
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <img
          src={produto.imagemUrl ?? 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80'}
          alt={produto.nome}
          className="w-full h-96 object-cover rounded-xl"
        />
        <div>
          {produto.categoria && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{produto.categoria}</span>
          )}
          <h1 className="text-2xl font-bold text-gray-900 mt-3">{produto.nome}</h1>
          <p className="text-3xl font-bold text-blue-700 mt-2">R$ {produto.preco?.toFixed(2)}</p>
          <p className="text-gray-600 mt-4 leading-relaxed">{produto.descricao}</p>
          <div className="flex items-center gap-2 mt-4">
            <Package size={16} className={produto.estoque > 0 ? 'text-green-600' : 'text-red-500'} />
            <span className={`text-sm font-medium ${produto.estoque > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {produto.estoque > 0 ? `${produto.estoque} em estoque` : 'Esgotado'}
            </span>
          </div>
          <button
            onClick={addToCart}
            disabled={produto.estoque === 0}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ShoppingCart size={18} /> Adicionar ao carrinho
          </button>
          <Link to="/carrinho"
            className="mt-3 w-full flex items-center justify-center border border-blue-700 text-blue-700 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
            Ver carrinho
          </Link>
        </div>
      </div>
    </div>
  )
}
