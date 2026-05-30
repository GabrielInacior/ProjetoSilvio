import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { BookOpen, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ProfDashboard() {
  const { usuario } = useAuthStore()
  const { data: turmas = [] } = useQuery({
    queryKey: ['prof-turmas'],
    queryFn: () => api.get('/professor/turmas').then((r) => r.data),
  })
  const { data: perfil } = useQuery({
    queryKey: ['prof-perfil'],
    queryFn: () => api.get('/professor/perfil').then((r) => r.data),
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Olá, Prof. {usuario?.nome?.split(' ')[0]}!</h1>
        {perfil && <p className="text-gray-500 mt-1">SIAPE: {perfil.siape} — {perfil.titulacao}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <div className="bg-white rounded-xl border p-5 flex items-center gap-4">
          <div className="bg-emerald-600 text-white p-3 rounded-xl"><BookOpen size={22} /></div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{turmas.length}</div>
            <div className="text-xs text-gray-500">Turmas no semestre</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5 flex items-center gap-4">
          <div className="bg-blue-600 text-white p-3 rounded-xl"><Users size={22} /></div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {turmas.reduce((s: number, t: { vagas: number }) => s + t.vagas, 0)}
            </div>
            <div className="text-xs text-gray-500">Total de vagas</div>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Minhas Turmas</h2>
        <div className="space-y-3">
          {(turmas as { id: number; disciplina: string; ano: number; semestre: number; sala: string; diaSemana: string; horaInicio: string; status: string }[]).map((t) => (
            <Link key={t.id} to={`/prof/turmas/${t.id}`}
              className="flex items-center justify-between border rounded-lg px-4 py-3 hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-medium text-gray-900 text-sm">{t.disciplina}</p>
                <p className="text-xs text-gray-500">{t.ano}/{t.semestre}º — {t.sala} — {t.diaSemana} {t.horaInicio}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                t.status === 'ATIVA' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>{t.status}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
