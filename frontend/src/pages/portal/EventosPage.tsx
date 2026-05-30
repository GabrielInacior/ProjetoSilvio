import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Calendar, MapPin, Clock } from 'lucide-react'

export default function EventosPage() {
  const { data: eventos = [], isLoading } = useQuery({
    queryKey: ['eventos'],
    queryFn: () => api.get('/eventos').then((r) => r.data),
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Eventos</h1>
      <p className="text-gray-500 mb-10">Fique por dentro dos eventos e atividades da Inovatech.</p>
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : eventos.length === 0 ? (
        <div className="text-center py-20 text-gray-400">Nenhum evento encontrado.</div>
      ) : (
        <div className="space-y-4">
          {eventos.map((e: { id: number; titulo: string; descricao?: string; dataInicio: string; dataFim?: string; local?: string; tipo?: string }) => (
            <div key={e.id} className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow flex gap-6">
              <div className="shrink-0 text-center bg-blue-700 text-white rounded-xl px-4 py-3 w-20">
                <div className="text-2xl font-bold">{new Date(e.dataInicio).getDate()}</div>
                <div className="text-xs uppercase">
                  {new Date(e.dataInicio).toLocaleString('pt-BR', { month: 'short' })}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-gray-900 text-lg">{e.titulo}</h3>
                  {e.tipo && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full shrink-0">{e.tipo}</span>}
                </div>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{e.descricao}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Clock size={12} />
                    {new Date(e.dataInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    {e.dataFim && ` – ${new Date(e.dataFim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
                  </span>
                  {e.local && <span className="flex items-center gap-1"><MapPin size={12} />{e.local}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
