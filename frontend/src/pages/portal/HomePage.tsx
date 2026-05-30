import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ArrowRight, BookOpen, Users, Award, MapPin } from 'lucide-react'

const HERO_IMG = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400&q=80'
const ABOUT_IMG = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80'

const stats = [
  { label: 'Alunos matriculados', value: '2.400+', Icon: Users },
  { label: 'Cursos oferecidos', value: '12', Icon: BookOpen },
  { label: 'Anos de excelência', value: '15', Icon: Award },
  { label: 'Cidades atendidas', value: '8', Icon: MapPin },
]

export default function HomePage() {
  const { data: posts } = useQuery({
    queryKey: ['posts'],
    queryFn: () => api.get('/posts?size=3').then((r) => r.data.content),
  })

  const { data: cursos } = useQuery({
    queryKey: ['cursos'],
    queryFn: () => api.get('/cursos').then((r) => r.data),
  })

  const { data: eventos } = useQuery({
    queryKey: ['eventos'],
    queryFn: () => api.get('/eventos').then((r) => r.data),
  })

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[580px] flex items-center">
        <img src={HERO_IMG} alt="Campus" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-blue-900/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Formando o futuro<br />da tecnologia
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-xl">
            Cursos de graduação tecnológica com foco em inovação, prática e mercado de trabalho.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/cursos"
              className="bg-white text-blue-800 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Conheça os cursos
            </Link>
            <Link to="/sobre"
              className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Saiba mais
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-blue-700 py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center">
          {stats.map(({ label, value, Icon }) => (
            <div key={label}>
              <Icon size={28} className="mx-auto mb-2 opacity-80" />
              <div className="text-3xl font-bold">{value}</div>
              <div className="text-blue-200 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Courses section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Nossos Cursos</h2>
            <Link to="/cursos" className="text-blue-700 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Ver todos <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(cursos ?? []).slice(0, 3).map((c: { slug: string; imagemUrl?: string; nome: string; descricao?: string }) => (
              <Link key={c.slug} to={`/cursos/${c.slug}`}
                className="rounded-xl overflow-hidden border hover:shadow-lg transition-shadow group">
                <img src={c.imagemUrl ?? 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=70'}
                  alt={c.nome} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{c.nome}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{c.descricao}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Blog section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Últimas Notícias</h2>
            <Link to="/blog" className="text-blue-700 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Ver blog <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(posts ?? []).map((p: { slug: string; imagemCapa?: string; titulo: string; resumo?: string; publicadoEm: string; autor?: string }) => (
              <Link key={p.slug} to={`/blog/${p.slug}`}
                className="bg-white rounded-xl overflow-hidden border hover:shadow-lg transition-shadow group">
                <img src={p.imagemCapa ?? 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&q=70'}
                  alt={p.titulo} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="p-5">
                  <p className="text-xs text-blue-600 font-medium mb-1">{new Date(p.publicadoEm).toLocaleDateString('pt-BR')}</p>
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{p.titulo}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{p.resumo}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Events section */}
      {eventos && eventos.length > 0 && (
        <section className="py-16 bg-blue-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">Próximos Eventos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventos.slice(0, 3).map((e: { id: number; titulo: string; dataInicio: string; local?: string; descricao?: string }) => (
                <div key={e.id} className="bg-blue-800 rounded-xl p-5 border border-blue-700">
                  <p className="text-blue-300 text-xs font-medium mb-1">
                    {new Date(e.dataInicio).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                  <h3 className="font-semibold text-white">{e.titulo}</h3>
                  {e.local && <p className="text-blue-300 text-sm mt-1 flex items-center gap-1"><MapPin size={13} />{e.local}</p>}
                  <p className="text-blue-200 text-sm mt-2 line-clamp-2">{e.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Pronto para começar?</h2>
          <p className="text-gray-600 mb-8">Faça parte de uma das melhores faculdades de tecnologia da região.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/cursos" className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
              Inscreva-se
            </Link>
            <Link to="/sobre" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 transition-colors">
              Saiba mais
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
