import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { GraduationCap } from 'lucide-react'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Mínimo 6 caracteres'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post('/auth/login', data)
      login(res.data.accessToken, res.data.refreshToken, res.data.usuario)
      const tipo = res.data.usuario.tipo
      if (tipo === 'ALUNO') navigate('/app/dashboard')
      else if (tipo === 'PROFESSOR') navigate('/prof/dashboard')
      else navigate('/admin/dashboard')
    } catch {
      toast.error('Credenciais inválidas. Verifique seu e-mail e senha.')
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
            <h1 className="text-2xl font-bold text-gray-900 mt-4">Acesse sua conta</h1>
            <p className="text-gray-500 text-sm mt-1">Portal acadêmico Inovatech</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail institucional</label>
              <input
                type="email"
                {...register('email')}
                placeholder="seu@email.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Senha</label>
                <Link to="/esqueci-senha" className="text-xs text-blue-700 hover:underline">Esqueci minha senha</Link>
              </div>
              <input
                type="password"
                {...register('senha')}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.senha && <p className="text-red-500 text-xs mt-1">{errors.senha.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-700 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-blue-700 transition-colors">
              ← Voltar ao site
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
