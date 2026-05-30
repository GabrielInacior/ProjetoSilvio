import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { GraduationCap, Zap } from 'lucide-react'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Mínimo 6 caracteres'),
})
type FormData = z.infer<typeof schema>

const QUICK_PROFILES = [
  { label: 'Admin',     email: 'admin@inovatech.com',         senha: 'Admin@123',  color: 'bg-purple-600 hover:bg-purple-700' },
  { label: 'Professor', email: 'carlos.mendes@inovatech.com', senha: 'Senha@123',  color: 'bg-emerald-600 hover:bg-emerald-700' },
  { label: 'Aluno',     email: 'joao.silva@aluno.com',        senha: 'Senha@123',  color: 'bg-blue-600 hover:bg-blue-700' },
]

export default function LoginPage() {
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const doLogin = async (email: string, senha: string) => {
    try {
      const res = await api.post('/auth/login', { email, senha })
      login(res.data.accessToken, res.data.refreshToken, res.data.usuario)
      const tipo = res.data.usuario.tipo
      if (tipo === 'ALUNO') navigate('/app/dashboard')
      else if (tipo === 'PROFESSOR') navigate('/prof/dashboard')
      else navigate('/admin/dashboard')
    } catch {
      toast.error('Credenciais inválidas. Verifique seu e-mail e senha.')
    }
  }

  const onSubmit = (data: FormData) => doLogin(data.email, data.senha)

  const quickLogin = (email: string, senha: string) => {
    setValue('email', email)
    setValue('senha', senha)
    doLogin(email, senha)
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

          {/* Acesso rápido */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-amber-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Acesso rápido (demo)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_PROFILES.map(p => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => quickLogin(p.email, p.senha)}
                  className={`${p.color} text-white text-xs font-semibold py-2 rounded-lg transition-colors`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-2 text-center">Senha: Admin@123 (admin) · Senha@123 (demais)</p>
          </div>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">ou entre com seus dados</span></div>
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

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Não tem conta?{' '}
              <Link to="/cadastro" className="text-blue-700 font-medium hover:underline">
                Cadastre-se
              </Link>
            </p>
            <Link to="/" className="block text-sm text-gray-400 hover:text-blue-700 transition-colors">
              ← Voltar ao site
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

