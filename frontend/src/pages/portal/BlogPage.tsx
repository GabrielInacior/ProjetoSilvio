import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'
import { useState } from 'react'

export default function BlogPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useQuery({
    queryKey: ['posts', page],
    queryFn: () => api.get(`/posts?page=${page}&size=9`).then((r) => r.data),
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog</h1>
      <p className="text-gray-500 mb-10">Notícias, artigos e novidades da Inovatech.</p>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-gray-100 animate-pulse h-72" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.content?.map((p: { slug: string; imagemCapa?: string; titulo: string; resumo?: string; publicadoEm: string; autor?: string; tags?: string[] }) => (
              <Link key={p.slug} to={`/blog/${p.slug}`}
                className="bg-white rounded-xl overflow-hidden border hover:shadow-lg transition-shadow group">
                <img src={p.imagemCapa ?? 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=70'}
                  alt={p.titulo} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-blue-600 font-medium">
                      {new Date(p.publicadoEm).toLocaleDateString('pt-BR')}
                    </span>
                    {p.tags?.[0] && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{p.tags[0]}</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{p.titulo}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{p.resumo}</p>
                  <p className="text-xs text-gray-400 mt-2">por {p.autor}</p>
                </div>
              </Link>
            ))}
          </div>
          {data && !data.last && (
            <div className="text-center mt-10">
              <button onClick={() => setPage((p) => p + 1)}
                className="bg-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors">
                Carregar mais
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
