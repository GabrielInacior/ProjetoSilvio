import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '@/lib/api'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { GraduationCap, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

const schema = z.object({ email: z.string().email('E-mail inválido') })
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/auth/forgot-password', data)
      setSent(true)
    } catch {
      toast.error('Não foi possível processar a solicitação. Tente novamente.')
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
              <h1 className="text-2xl font-bold mt-4">Recuperar senha</h1>
              <p className="text-muted-foreground text-sm mt-1">Enviaremos um link para redefinir sua senha</p>
            </div>

            {sent ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">E-mail enviado!</h3>
                <p className="text-muted-foreground text-sm">Verifique sua caixa de entrada e siga as instruções para redefinir sua senha. O link expira em 1 hora.</p>
                <Link to="/login" className="mt-6 inline-block text-primary text-sm font-medium hover:underline">
                  Voltar ao login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div className="space-y-1">
                  <Label htmlFor="email">E-mail institucional</Label>
                  <Input id="email" type="email" {...register('email')} placeholder="seu@email.com" />
                  {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Enviar link de recuperação'}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1">
                <ArrowLeft size={14} /> Voltar ao login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
