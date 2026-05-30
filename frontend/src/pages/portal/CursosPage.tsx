import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'
import { Clock, ChevronRight } from 'lucide-react'

export default function CursosPage() {
  const { data: cursos = [], isLoading } = useQuery({
    queryKey: ['cursos'],
    queryFn: () => api.get('/cursos').then((r) => r.data),
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Cursos</h1>
      <p className="text-gray-500 mb-10">Escolha o curso ideal para o seu futuro profissional.</p>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursos.map((c: { slug: string; imagemUrl?: string; nome: string; descricao?: string; cargaHoraria?: number; modalidade?: string }) => (
            <div key={c.slug} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow group">
              <img src={c.imagemUrl ?? 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=70'}
                alt={c.nome} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="p-5">
                {c.modalidade && (
                  <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{c.modalidade}</span>
                )}
                <h3 className="text-lg font-semibold text-gray-900 mt-2">{c.nome}</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{c.descricao}</p>
                {c.cargaHoraria && (
                  <p className="flex items-center gap-1 text-gray-400 text-xs mt-3"><Clock size={13} /> {c.cargaHoraria}h</p>
                )}
                <Link to={`/cursos/${c.slug}`}
                  className="mt-4 flex items-center gap-1 text-blue-700 text-sm font-medium hover:gap-2 transition-all">
                  Saiba mais <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
