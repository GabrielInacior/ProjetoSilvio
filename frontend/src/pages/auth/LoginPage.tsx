import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { GraduationCap, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Mínimo 6 caracteres'),
})
type FormData = z.infer<typeof schema>

const QUICK_PROFILES = [
  { label: 'Admin',     email: 'admin@inovatech.com',         senha: 'Admin@123',  className: 'bg-purple-600 hover:bg-purple-700 text-white' },
  { label: 'Professor', email: 'carlos.mendes@inovatech.com', senha: 'Senha@123',  className: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
  { label: 'Aluno',     email: 'joao.silva@aluno.com',        senha: 'Senha@123',  className: 'bg-blue-600 hover:bg-blue-700 text-white' },
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
  const quickLogin = (email: string, senha: string) => { setValue('email', email); setValue('senha', senha); doLogin(email, senha) }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="shadow-md">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2 text-blue-700 font-bold text-xl">
                <GraduationCap size={28} /> Inovatech
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mt-4">Acesse sua conta</h1>
              <p className="text-muted-foreground text-sm mt-1">Portal acadêmico Inovatech</p>
            </div>

            {/* Acesso rápido */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={14} className="text-amber-500" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Acesso rápido (demo)</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {QUICK_PROFILES.map(p => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => quickLogin(p.email, p.senha)}
                    className={`${p.className} text-xs font-semibold py-2 rounded-lg transition-colors`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 text-center">Admin@123 (admin) · Senha@123 (demais)</p>
            </div>

            <div className="relative mb-5">
              <Separator />
              <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                ou entre com seus dados
              </span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="email">E-mail institucional</Label>
                <Input id="email" type="email" {...register('email')} placeholder="seu@email.com" />
                {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="senha">Senha</Label>
                  <Link to="/esqueci-senha" className="text-xs text-blue-700 hover:underline">Esqueci minha senha</Link>
                </div>
                <Input id="senha" type="password" {...register('senha')} placeholder="••••••••" />
                {errors.senha && <p className="text-destructive text-xs">{errors.senha.message}</p>}
              </div>
              <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800" disabled={isSubmitting} size="lg">
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Não tem conta?{' '}
                <Link to="/cadastro" className="text-blue-700 font-medium hover:underline">Cadastre-se</Link>
              </p>
              <Link to="/" className="block text-sm text-muted-foreground hover:text-blue-700 transition-colors">
                ← Voltar ao site
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

