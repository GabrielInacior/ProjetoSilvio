import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '@/lib/api'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { GraduationCap } from 'lucide-react'

const schema = z.object({
  senha: z.string().min(8, 'Mínimo 8 caracteres'),
  confirmar: z.string(),
}).refine((d) => d.senha === d.confirmar, { message: 'As senhas não coincidem', path: ['confirmar'] })
type FormData = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    if (!token) { toast.error('Token inválido ou expirado.'); return }
    try {
      await api.post('/auth/reset-password', { token, novaSenha: data.senha })
      toast.success('Senha redefinida com sucesso!')
      navigate('/login')
    } catch {
      toast.error('Token inválido ou expirado. Solicite um novo link.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-blue-700 font-bold text-xl">
              <GraduationCap size={28} /> Inovatech
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">Redefinir senha</h1>
            <p className="text-gray-500 text-sm mt-1">Digite sua nova senha</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nova senha</label>
              <input type="password" {...register('senha')} placeholder="Mínimo 8 caracteres"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              {errors.senha && <p className="text-red-500 text-xs mt-1">{errors.senha.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar nova senha</label>
              <input type="password" {...register('confirmar')} placeholder="Repita a senha"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              {errors.confirmar && <p className="text-red-500 text-xs mt-1">{errors.confirmar.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting}
              className="w-full bg-blue-700 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-800 disabled:opacity-60 transition-colors">
              {isSubmitting ? 'Salvando...' : 'Redefinir senha'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-gray-500 hover:text-blue-700 transition-colors">← Voltar ao login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
