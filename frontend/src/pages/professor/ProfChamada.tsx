import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useState } from 'react'
import { toast } from 'sonner'
import { CheckCircle, XCircle } from 'lucide-react'

export default function ProfChamada() {
  const { id, aulaId } = useParams<{ id: string; aulaId: string }>()
  const navigate = useNavigate()

  const { data: alunos = [], isLoading } = useQuery({
    queryKey: ['turma-alunos', id],
    queryFn: () => api.get(`/professor/turmas/${id}/alunos`).then((r) => r.data),
  })

  const [presencas, setPresencas] = useState<Record<number, boolean>>({})

  const togglePresenca = (alunoId: number) =>
    setPresencas((prev) => ({ ...prev, [alunoId]: !prev[alunoId] }))

  const salvar = useMutation({
    mutationFn: () => {
      const chamada = (alunos as { id: number }[]).map((a) => ({
        alunoId: a.id,
        presente: presencas[a.id] ?? false,
      }))
      return api.post(`/professor/aulas/${aulaId}/chamada`, chamada)
    },
    onSuccess: () => {
      toast.success('Chamada registrada com sucesso!')
      navigate(`/prof/turmas/${id}`)
    },
    onError: () => toast.error('Erro ao salvar chamada.'),
  })

  const totalPresentes = (alunos as { id: number }[]).filter((a) => presencas[a.id]).length

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Chamada</h1>
      <p className="text-gray-500 mb-6">Aula #{aulaId} — Turma #{id}</p>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}
        </div>
      ) : (
        <>
          <div className="bg-white border rounded-xl overflow-hidden mb-6">
            <div className="bg-gray-50 border-b px-4 py-2 flex items-center justify-between text-xs text-gray-600">
              <span>{(alunos as { id: number }[]).length} alunos</span>
              <span className="font-medium">{totalPresentes} presentes</span>
            </div>
            {(alunos as { id: number; nome: string; ra: string }[]).map((a) => {
              const presente = presencas[a.id] ?? false
              return (
                <div key={a.id}
                  onClick={() => togglePresenca(a.id)}
                  className={`flex items-center justify-between px-4 py-3 border-b last:border-0 cursor-pointer transition-colors ${presente ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{a.nome}</p>
                    <p className="text-xs text-gray-500">RA: {a.ra}</p>
                  </div>
                  {presente
                    ? <CheckCircle size={22} className="text-green-600" />
                    : <XCircle size={22} className="text-gray-300" />
                  }
                </div>
              )
            })}
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate(`/prof/turmas/${id}`)}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button onClick={() => salvar.mutate()} disabled={salvar.isPending}
              className="flex-1 bg-emerald-700 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-800 disabled:opacity-60 transition-colors">
              {salvar.isPending ? 'Salvando...' : 'Confirmar chamada'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
