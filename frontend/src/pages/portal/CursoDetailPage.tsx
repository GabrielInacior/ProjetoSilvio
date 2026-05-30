import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ArrowLeft, Clock, Users, BookOpen, ChevronRight } from 'lucide-react'

export default function CursoDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: curso, isLoading, isError } = useQuery({
    queryKey: ['curso', slug],
    queryFn: () => api.get(`/cursos/${slug}`).then((r) => r.data),
  })

  if (isLoading) return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-400">Carregando...</div>
  if (isError || !curso) return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-red-500">Curso não encontrado.</div>

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link to="/cursos" className="flex items-center gap-1 text-blue-700 text-sm font-medium mb-6 hover:gap-2 transition-all">
        <ArrowLeft size={16} /> Todos os cursos
      </Link>
      {curso.imagemUrl && (
        <img src={curso.imagemUrl} alt={curso.nome} className="w-full h-72 object-cover rounded-xl mb-8" />
      )}
      <div className="flex flex-wrap gap-3 mb-4">
        {curso.modalidade && <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{curso.modalidade}</span>}
        {curso.area && <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{curso.area}</span>}
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{curso.nome}</h1>
      <p className="text-gray-600 text-lg mb-6">{curso.descricao}</p>
      <div className="grid grid-cols-3 gap-4 bg-blue-50 rounded-xl p-6 mb-8">
        {curso.cargaHoraria && (
          <div className="text-center"><Clock size={22} className="mx-auto text-blue-600 mb-1" /><p className="font-bold text-gray-900">{curso.cargaHoraria}h</p><p className="text-xs text-gray-500">Carga horária</p></div>
        )}
        {curso.duracao && (
          <div className="text-center"><BookOpen size={22} className="mx-auto text-blue-600 mb-1" /><p className="font-bold text-gray-900">{curso.duracao}</p><p className="text-xs text-gray-500">Duração</p></div>
        )}
        {curso.vagas && (
          <div className="text-center"><Users size={22} className="mx-auto text-blue-600 mb-1" /><p className="font-bold text-gray-900">{curso.vagas}</p><p className="text-xs text-gray-500">Vagas</p></div>
        )}
      </div>
      {curso.grade && curso.grade.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Grade Curricular</h2>
          <div className="space-y-2">
            {curso.grade.map((d: { id: number; nome: string; cargaHoraria: number; semestreSugerido: number }) => (
              <div key={d.id} className="flex items-center justify-between bg-white border rounded-lg px-4 py-3">
                <span className="text-sm font-medium text-gray-900">{d.nome}</span>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{d.cargaHoraria}h</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full">{d.semestreSugerido}º sem</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-10 bg-blue-700 rounded-xl p-8 text-center text-white">
        <h3 className="text-xl font-bold mb-2">Interessado?</h3>
        <p className="text-blue-100 mb-4">Entre em contato ou acesse o portal para mais informações.</p>
        <Link to="/login" className="bg-white text-blue-700 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
          Acessar portal
        </Link>
      </div>
    </div>
  )
}
