import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { User, Mail, BookOpen, Hash } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function AlunoPerfil() {
  const { usuario } = useAuthStore()
  const { data: aluno, isLoading } = useQuery({
    queryKey: ['aluno-perfil'],
    queryFn: () => api.get('/aluno/perfil').then((r) => r.data),
  })

  if (isLoading) return (
    <div className="max-w-2xl space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  )

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Meu Perfil</h1>
      <Card className="overflow-hidden">
        <div className="bg-blue-700 h-24" />
        <CardContent className="px-6 pb-6">
          <div className="-mt-10 mb-4 flex items-end gap-4">
            <div className="w-20 h-20 rounded-xl bg-blue-100 border-4 border-white flex items-center justify-center text-blue-700 text-2xl font-bold shadow">
              {usuario?.nome?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className="pb-1">
              <h2 className="text-xl font-bold">{usuario?.nome}</h2>
              <p className="text-muted-foreground text-sm">Aluno</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { Icon: User, label: 'Nome completo', value: usuario?.nome },
              { Icon: Mail, label: 'E-mail', value: usuario?.email },
              { Icon: Hash, label: 'RA', value: aluno?.ra },
              { Icon: BookOpen, label: 'Curso', value: aluno?.curso },
              { Icon: Hash, label: 'CPF', value: aluno?.cpf },
              { Icon: User, label: 'Semestre de ingresso', value: aluno?.semestreIngresso },
              { Icon: User, label: 'Status', value: aluno?.status },
              { Icon: User, label: 'Telefone', value: aluno?.telefone ?? '—' },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="border rounded-lg p-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Icon size={13} /> {label}
                </div>
                <p className="font-medium text-sm">{value ?? '—'}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
