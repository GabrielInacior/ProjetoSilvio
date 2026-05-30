import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { User, Mail, Hash, GraduationCap, Phone, ExternalLink } from 'lucide-react'

export default function ProfPerfil() {
  const { usuario } = useAuthStore()
  const { data: perfil, isLoading } = useQuery({
    queryKey: ['prof-perfil'],
    queryFn: () => api.get('/professor/perfil').then((r) => r.data),
  })

  if (isLoading) return <div className="text-center py-16 text-gray-400">Carregando...</div>

  const fields = [
    { Icon: User,          label: 'Nome completo',  value: usuario?.nome },
    { Icon: Mail,          label: 'E-mail',          value: usuario?.email },
    { Icon: Hash,          label: 'SIAPE',           value: perfil?.siape },
    { Icon: Hash,          label: 'CPF',             value: perfil?.cpf },
    { Icon: GraduationCap, label: 'Titulação',       value: perfil?.titulacao },
    { Icon: Phone,         label: 'Telefone',        value: perfil?.telefone ?? '—' },
    { Icon: ExternalLink,  label: 'Currículo Lattes', value: perfil?.lattes ?? '—' },
  ]

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Meu Perfil</h1>
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="bg-emerald-700 h-24" />
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 flex items-end gap-4">
            <div className="w-20 h-20 rounded-xl bg-emerald-100 border-4 border-white flex items-center justify-center text-emerald-700 text-2xl font-bold shadow">
              {usuario?.nome?.[0]?.toUpperCase() ?? 'P'}
            </div>
            <div className="pb-1">
              <h2 className="text-xl font-bold text-gray-900">{usuario?.nome}</h2>
              <p className="text-gray-500 text-sm">Professor — {perfil?.titulacao}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(({ Icon, label, value }) => (
              <div key={label} className="border rounded-lg p-3">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                  <Icon size={13} /> {label}
                </div>
                {label === 'Currículo Lattes' && value && value !== '—' ? (
                  <a href={value} target="_blank" rel="noopener noreferrer"
                     className="font-medium text-blue-700 text-sm hover:underline truncate block">
                    {value}
                  </a>
                ) : (
                  <p className="font-medium text-gray-900 text-sm">{value ?? '—'}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
