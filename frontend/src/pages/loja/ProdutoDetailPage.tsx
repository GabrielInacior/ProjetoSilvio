import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useCartStore } from '@/stores/cartStore'
import { ShoppingCart, ArrowLeft, Package } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProdutoDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { add } = useCartStore()

  const { data: produto, isLoading, isError } = useQuery({
    queryKey: ['produto', slug],
    queryFn: () => api.get(`/produtos/${slug}`).then(r => r.data),
  })

  if (isLoading) return (
    <div className="max-w-4xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
      <Skeleton className="w-full h-96 rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  )
  if (isError || !produto) return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-destructive">Produto não encontrado.</div>

  const addToCart = () => {
    add({ produtoId: produto.id, nome: produto.nome, preco: produto.preco, imagemUrl: produto.imagemUrl })
    toast.success('Produto adicionado ao carrinho!')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Button variant="ghost" size="sm" className="gap-1 mb-6" asChild>
        <Link to="/loja"><ArrowLeft size={16} /> Voltar à loja</Link>
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <img
          src={produto.imagemUrl ?? 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80'}
          alt={produto.nome}
          className="w-full h-96 object-cover rounded-xl"
        />
        <div>
          {produto.categoria && (
            <Badge variant="secondary">{produto.categoria}</Badge>
          )}
          <h1 className="text-2xl font-bold mt-3">{produto.nome}</h1>
          <p className="text-3xl font-bold text-primary mt-2">R$ {produto.preco?.toFixed(2)}</p>
          <p className="text-muted-foreground mt-4 leading-relaxed">{produto.descricao}</p>
          <div className="flex items-center gap-2 mt-4">
            <Package size={16} className={produto.estoque > 0 ? 'text-green-600' : 'text-destructive'} />
            <span className={`text-sm font-medium ${produto.estoque > 0 ? 'text-green-600' : 'text-destructive'}`}>
              {produto.estoque > 0 ? `${produto.estoque} em estoque` : 'Esgotado'}
            </span>
          </div>
          <Button className="mt-6 w-full gap-2" onClick={addToCart} disabled={produto.estoque === 0}>
            <ShoppingCart size={18} /> Adicionar ao carrinho
          </Button>
          <Button variant="outline" className="mt-3 w-full" asChild>
            <Link to="/carrinho">Ver carrinho</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
