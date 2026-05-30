import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useCartStore } from '@/stores/cartStore'
import { ShoppingCart, Search, X } from 'lucide-react'
import { toast } from 'sonner'
import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useDebouncedCallback } from 'use-debounce'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

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

  const produtos: Produto[] = Array.isArray(data) ? data : (data?.content ?? [])
  const totalElements: number = Array.isArray(data) ? data.length : (data?.totalElements ?? 0)

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
            <Skeleton key={`skel-${String(i)}`} className="h-64 w-full" />
          ))}
        </div>
      )
    }
    if (produtos.length === 0) {
      return (
        <div className="text-center py-20 text-muted-foreground">
          <Search size={36} className="mx-auto mb-3 opacity-40" />
          <p>Nenhum produto encontrado.</p>
          {(buscaApi || categoria) && (
            <Button variant="link" size="sm" onClick={() => { handleBusca(''); handleCategoria('') }}>
              Limpar filtros
            </Button>
          )}
        </div>
      )
    }
    return (
      <>
        <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 transition-opacity ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
          {produtos.map((p) => (
            <Card key={p.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <Link to={`/loja/${p.slug ?? p.id}`}>
                <img
                  src={p.imagemUrl ?? 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&q=70'}
                  alt={p.nome}
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <CardContent className="p-4">
                {p.categoria && (
                  <Badge variant="secondary" className="text-[10px] mb-1">
                    {CATEGORIAS.find(c => c.value === p.categoria)?.label ?? p.categoria}
                  </Badge>
                )}
                <h3 className="font-semibold text-sm line-clamp-2 mt-1">{p.nome}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-primary font-bold">R$ {p.preco?.toFixed(2)}</span>
                  <span className={`text-xs ${p.estoque > 0 ? 'text-green-600' : 'text-destructive'}`}>
                    {p.estoque > 0 ? `${p.estoque} un.` : 'Esgotado'}
                  </span>
                </div>
                <Button size="sm" className="mt-3 w-full gap-2" onClick={() => addToCart(p)} disabled={p.estoque === 0}>
                  <ShoppingCart size={15} /> Adicionar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-center items-center gap-4 mt-10">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
            ← Anterior
          </Button>
          <span className="text-sm text-muted-foreground">Página {page + 1}</span>
          <Button variant="outline" size="sm" disabled={Array.isArray(data) ? true : (data?.last ?? true)} onClick={() => setPage(p => p + 1)}>
            Próxima →
          </Button>
        </div>
      </>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Loja Inovatech</h1>
        <p className="text-muted-foreground mt-1">Materiais didáticos, uniformes e mais.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busca}
            onChange={e => handleBusca(e.target.value)}
            placeholder="Buscar produto..."
            className="pl-9 pr-9"
          />
          {busca && (
            <button onClick={() => handleBusca('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X size={15} />
            </button>
          )}
        </div>
        <select
          value={sort}
          onChange={e => handleSort(e.target.value)}
          className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
        >
          {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIAS.map(c => (
          <Button
            key={c.value}
            size="sm"
            variant={categoria === c.value ? 'default' : 'outline'}
            className="rounded-full"
            onClick={() => handleCategoria(c.value)}
          >
            {c.label}
          </Button>
        ))}
      </div>

      {!isLoading && (
        <p className="text-xs text-muted-foreground mb-4">
          {totalElements} {totalElements === 1 ? 'produto encontrado' : 'produtos encontrados'}
          {buscaApi && <span> para &quot;<strong>{buscaApi}</strong>&quot;</span>}
        </p>
      )}

      {renderGrid()}
    </div>
  )
}