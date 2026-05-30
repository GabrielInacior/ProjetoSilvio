import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useCartStore } from '@/stores/cartStore'
import { ShoppingCart, Search, X } from 'lucide-react'
import { toast } from 'sonner'
import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useDebouncedCallback } from 'use-debounce'

type Produto = {
  id: number
  nome: string
  descricao?: string
  preco: number
  estoque: number
  imagemUrl?: string
  slug?: string
  categoria?: string
}

const CATEGORIAS = [
  { value: '', label: 'Todas' },
  { value: 'VESTUARIO', label: 'Vestuário' },
  { value: 'ACESSORIOS', label: 'Acessórios' },
  { value: 'MATERIAL', label: 'Material' },
  { value: 'LIVROS', label: 'Livros' },
  { value: 'OUTROS', label: 'Outros' },
]

const SORTS = [
  { value: 'nome:asc',    label: 'Nome (A→Z)' },
  { value: 'nome:desc',   label: 'Nome (Z→A)' },
  { value: 'preco:asc',  label: 'Menor preço' },
  { value: 'preco:desc', label: 'Maior preço' },
]

export default function LojaPage() {
  const [page, setPage] = useState(0)
  const [categoria, setCategoria] = useState('')
  const [sort, setSort] = useState('nome:asc')
  const [busca, setBusca] = useState('')
  const [buscaApi, setBuscaApi] = useState('')
  const { add } = useCartStore()

  const debounceBusca = useDebouncedCallback((val: string) => {
    setBuscaApi(val)
    setPage(0)
  }, 400)

  const handleBusca = useCallback((val: string) => {
    setBusca(val)
    debounceBusca(val)
  }, [debounceBusca])

  const [sortField, sortDir] = sort.split(':')

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['produtos', page, categoria, buscaApi, sort],
    queryFn: () => {
      const params = new URLSearchParams({
        page: String(page),
        size: '12',
        sort: sortField,
        dir: sortDir,
      })
      if (categoria) params.set('categoria', categoria)
      if (buscaApi) params.set('busca', buscaApi)
      return api.get(`/produtos?${params.toString()}`).then(r => r.data)
    },
  })

  const produtos: Produto[] = data?.content ?? []
  const totalElements: number = data?.totalElements ?? 0

  const addToCart = (p: Produto) => {
    add({ produtoId: p.id, nome: p.nome, preco: p.preco, imagemUrl: p.imagemUrl })
    toast.success(`${p.nome} adicionado ao carrinho!`)
  }

  const handleCategoria = (cat: string) => {
    setCategoria(cat)
    setPage(0)
  }

  const handleSort = (s: string) => {
    setSort(s)
    setPage(0)
  }

  function renderGrid() {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`skel-${String(i)}`} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )
    }
    if (produtos.length === 0) {
      return (
        <div className="text-center py-20 text-gray-400">
          <Search size={36} className="mx-auto mb-3 opacity-40" />
          <p>Nenhum produto encontrado.</p>
          {(buscaApi || categoria) && (
            <button
              onClick={() => { handleBusca(''); handleCategoria('') }}
              className="text-sm text-blue-600 hover:underline mt-2"
            >
              Limpar filtros
            </button>
          )}
        </div>
      )
    }
    return (
      <>
        <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 transition-opacity ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
          {produtos.map((p) => (
            <div key={p.id} className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
              <Link to={`/loja/${p.slug ?? p.id}`}>
                <img
                  src={p.imagemUrl ?? 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&q=70'}
                  alt={p.nome}
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="p-4">
                {p.categoria && (
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-600 mb-1 block">
                    {CATEGORIAS.find(c => c.value === p.categoria)?.label ?? p.categoria}
                  </span>
                )}
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{p.nome}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-blue-700 font-bold">R$ {p.preco?.toFixed(2)}</span>
                  <span className={`text-xs ${p.estoque > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {p.estoque > 0 ? `${p.estoque} un.` : 'Esgotado'}
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
        <div className="flex justify-center items-center gap-4 mt-10">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors">
            ← Anterior
          </button>
          <span className="text-sm text-gray-500">Página {page + 1}</span>
          <button disabled={data?.last} onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors">
            Próxima →
          </button>
        </div>
      </>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Loja Inovatech</h1>
        <p className="text-gray-500 mt-1">Materiais didáticos, uniformes e mais.</p>
      </div>

      {/* Barra de busca e filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={busca}
            onChange={e => handleBusca(e.target.value)}
            placeholder="Buscar produto..."
            className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {busca && (
            <button onClick={() => handleBusca('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={15} />
            </button>
          )}
        </div>
        <select
          value={sort}
          onChange={e => handleSort(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIAS.map(c => (
          <button
            key={c.value}
            onClick={() => handleCategoria(c.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              categoria === c.value
                ? 'bg-blue-700 text-white border-blue-700'
                : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-700'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {!isLoading && (
        <p className="text-xs text-gray-400 mb-4">
          {totalElements} {totalElements === 1 ? 'produto encontrado' : 'produtos encontrados'}
          {buscaApi && <span> para &quot;<strong>{buscaApi}</strong>&quot;</span>}
        </p>
      )}

      {renderGrid()}
    </div>
  )
}