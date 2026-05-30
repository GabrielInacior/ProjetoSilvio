import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, Calendar, User } from 'lucide-react'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => api.get(`/posts/${slug}`).then((r) => r.data),
  })

  if (isLoading) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-400">Carregando...</div>
  if (isError || !post) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-red-500">Post não encontrado.</div>

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link to="/blog" className="flex items-center gap-1 text-blue-700 text-sm font-medium mb-6 hover:gap-2 transition-all">
        <ArrowLeft size={16} /> Voltar ao blog
      </Link>
      {post.imagemCapa && (
        <img src={post.imagemCapa} alt={post.titulo} className="w-full h-64 object-cover rounded-xl mb-8" />
      )}
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.publicadoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
        {post.autor && <span className="flex items-center gap-1"><User size={14} /> {post.autor}</span>}
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.titulo}</h1>
      <p className="text-lg text-gray-600 mb-8 border-l-4 border-blue-600 pl-4">{post.resumo}</p>
      <div className="prose prose-blue max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.conteudoMd}</ReactMarkdown>
      </div>
      {post.tags?.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-8 pt-6 border-t">
          {post.tags.map((t: string) => (
            <span key={t} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{t}</span>
          ))}
        </div>
      )}
    </article>
  )
}
