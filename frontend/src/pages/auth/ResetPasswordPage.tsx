import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '@/lib/api'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

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
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold text-xl">
                <GraduationCap size={28} /> Inovatech
              </Link>
              <h1 className="text-2xl font-bold mt-4">Redefinir senha</h1>
              <p className="text-muted-foreground text-sm mt-1">Digite sua nova senha</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="space-y-1">
                <Label htmlFor="senha">Nova senha</Label>
                <Input id="senha" type="password" {...register('senha')} placeholder="Mínimo 8 caracteres" />
                {errors.senha && <p className="text-destructive text-xs">{errors.senha.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirmar">Confirmar nova senha</Label>
                <Input id="confirmar" type="password" {...register('confirmar')} placeholder="Repita a senha" />
                {errors.confirmar && <p className="text-destructive text-xs">{errors.confirmar.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Redefinir senha'}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">← Voltar ao login</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
