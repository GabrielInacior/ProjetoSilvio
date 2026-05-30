import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useCartStore } from '@/stores/cartStore'
import { ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function LojaPage() {
  const [page, setPage] = useState(0)
  const [categoria, setCategoria] = useState('')
  const { add } = useCartStore()

  const { data, isLoading } = useQuery({
    queryKey: ['produtos', page, categoria],
    queryFn: () => api.get(`/produtos?page=${page}&size=12${categoria ? `&categoria=${categoria}` : ''}`).then(r => r.data),
  })

  const produtos = data?.content ?? []

  const addToCart = (p: { id: number; nome: string; preco: number; imagemUrl?: string }) => {
    add({ produtoId: p.id, nome: p.nome, preco: p.preco, imagemUrl: p.imagemUrl })
    toast.success(`${p.nome} adicionado ao carrinho!`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Loja Inovatech</h1>
      <p className="text-gray-500 mb-8">Materiais didáticos, uniformes e mais.</p>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : produtos.length === 0 ? (
        <div className="text-center py-20 text-gray-400">Nenhum produto disponível.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {produtos.map((p: { id: number; nome: string; descricao?: string; preco: number; estoque: number; imagemUrl?: string; slug?: string }) => (
              <div key={p.id} className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
                <Link to={`/loja/${p.slug ?? p.id}`}>
                  <img
                    src={p.imagemUrl ?? 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&q=70'}
                    alt={p.nome}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{p.nome}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-blue-700 font-bold">R$ {p.preco?.toFixed(2)}</span>
                    <span className={`text-xs ${p.estoque > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {p.estoque > 0 ? `${p.estoque} em estoque` : 'Esgotado'}
                    </span>
                  </div>
                  <button
                    onClick={() => addToCart(p)}
                    disabled={p.estoque === 0}
                    className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-700 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ShoppingCart size={15} /> Adicionar
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-10">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">Anterior</button>
            <button disabled={data?.last} onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">Próxima</button>
          </div>
        </>
      )}
    </div>
  )
}
