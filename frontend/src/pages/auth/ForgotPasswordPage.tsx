import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '@/lib/api'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { GraduationCap, ArrowLeft } from 'lucide-react'
import { useState } from 'react'

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-blue-700 font-bold text-xl">
              <GraduationCap size={28} /> Inovatech
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">Recuperar senha</h1>
            <p className="text-gray-500 text-sm mt-1">Enviaremos um link para redefinir sua senha</p>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">E-mail enviado!</h3>
              <p className="text-gray-500 text-sm">Verifique sua caixa de entrada e siga as instruções para redefinir sua senha. O link expira em 1 hora.</p>
              <Link to="/login" className="mt-6 inline-block text-blue-700 text-sm font-medium hover:underline">
                Voltar ao login
              </Link>
            </div>
          ) : (
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
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-700 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-800 disabled:opacity-60 transition-colors"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar link de recuperação'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-gray-500 hover:text-blue-700 transition-colors flex items-center justify-center gap-1">
              <ArrowLeft size={14} /> Voltar ao login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
