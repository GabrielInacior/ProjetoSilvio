import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { GraduationCap, User, BookOpen, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'

// ── Schemas ──────────────────────────────────────────────────────────────────

const alunoSchema = z.object({
  tipo:      z.literal('ALUNO'),
  nome:      z.string().min(3, 'Nome completo obrigatório'),
  email:     z.string().email('E-mail inválido'),
  senha:     z.string().min(8, 'Mínimo 8 caracteres'),
  confirmar: z.string(),
  cpf:       z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido (000.000.000-00)'),
  telefone:  z.string().min(10, 'Telefone inválido'),
  cursoId:   z.coerce.number({ error: 'Selecione um curso' }).positive('Selecione um curso'),
}).refine(d => d.senha === d.confirmar, { message: 'Senhas não coincidem', path: ['confirmar'] })

const profSchema = z.object({
  tipo:      z.literal('PROFESSOR'),
  nome:      z.string().min(3, 'Nome completo obrigatório'),
  email:     z.string().email('E-mail inválido'),
  senha:     z.string().min(8, 'Mínimo 8 caracteres'),
  confirmar: z.string(),
  cpf:       z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido (000.000.000-00)'),
  telefone:  z.string().min(10, 'Telefone inválido'),
  siape:     z.string().min(4, 'SIAPE obrigatório'),
  titulacao: z.enum(['GRADUACAO','ESPECIALIZACAO','MESTRADO','DOUTORADO','POS_DOUTORADO'] as const, { error: 'Selecione a titulação' }),
}).refine(d => d.senha === d.confirmar, { message: 'Senhas não coincidem', path: ['confirmar'] })

type AlunoForm   = z.infer<typeof alunoSchema>
type ProfForm    = z.infer<typeof profSchema>

// ── Helpers ───────────────────────────────────────────────────────────────────

function maskCPF(v: string) {
  return v.replace(/\D/g,'').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,'$1.$2.$3-$4').slice(0,14)
}
function maskPhone(v: string) {
  return v.replace(/\D/g,'').replace(/(\d{2})(\d{5})(\d{4})/,'($1) $2-$3').slice(0,15)
}

// ── Step 1: Tipo ──────────────────────────────────────────────────────────────

function StepTipo({ onSelect }: { onSelect: (t: 'ALUNO' | 'PROFESSOR') => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">Como deseja se cadastrar?</h2>
      <button onClick={() => onSelect('ALUNO')}
        className="w-full flex items-center gap-4 border-2 border-gray-200 rounded-xl p-5 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 group-hover:bg-blue-200 flex-shrink-0">
          <User size={24} />
        </div>
        <div>
          <p className="font-semibold text-gray-900">Sou Aluno</p>
          <p className="text-sm text-gray-500 mt-0.5">Acesse o portal acadêmico, notas, frequência e muito mais.</p>
        </div>
        <ChevronRight size={20} className="ml-auto text-gray-400 group-hover:text-blue-600" />
      </button>

      <button onClick={() => onSelect('PROFESSOR')}
        className="w-full flex items-center gap-4 border-2 border-gray-200 rounded-xl p-5 hover:border-indigo-500 hover:bg-indigo-50 transition-all group text-left">
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 group-hover:bg-indigo-200 flex-shrink-0">
          <BookOpen size={24} />
        </div>
        <div>
          <p className="font-semibold text-gray-900">Sou Professor</p>
          <p className="text-sm text-gray-500 mt-0.5">Gerencie suas turmas, aulas, chamadas e lançamentos de notas.</p>
        </div>
        <ChevronRight size={20} className="ml-auto text-gray-400 group-hover:text-indigo-600" />
      </button>
    </div>
  )
}

// ── Shared field components ───────────────────────────────────────────────────

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'

// ── Step 2A: Aluno ────────────────────────────────────────────────────────────

function StepAluno({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const { login } = useAuthStore()
  const navigate  = useNavigate()

  const { data: cursos = [] } = useQuery({
    queryKey: ['cursos-lista'],
    queryFn: () => api.get('/cursos').then(r => r.data as { id: number; nome: string }[]),
  })

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<AlunoForm>({
    resolver: zodResolver(alunoSchema) as Resolver<AlunoForm>,
    defaultValues: { tipo: 'ALUNO' },
  })

  const onSubmit = async (data: AlunoForm) => {
    try {
      const res = await api.post('/auth/register', { ...data, tipo: 'ALUNO' })
      login(res.data.accessToken, res.data.refreshToken, res.data.usuario)
      toast.success('Cadastro realizado! Bem-vindo(a) à Inovatech!')
      onSuccess()
      navigate('/app/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg ?? 'Erro ao criar conta. Tente novamente.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="flex items-center gap-2 mb-4">
        <button type="button" onClick={onBack} className="p-1 text-gray-400 hover:text-gray-600">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">Cadastro de Aluno</h2>
      </div>

      <input type="hidden" {...register('tipo')} value="ALUNO" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Field label="Nome completo" error={errors.nome?.message}>
            <input {...register('nome')} placeholder="Seu nome completo" className={inputCls} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="E-mail" error={errors.email?.message}>
            <input type="email" {...register('email')} placeholder="seu@email.com" className={inputCls} />
          </Field>
        </div>
        <Field label="Senha" error={errors.senha?.message}>
          <input type="password" {...register('senha')} placeholder="Mín. 8 caracteres" className={inputCls} />
        </Field>
        <Field label="Confirmar senha" error={errors.confirmar?.message}>
          <input type="password" {...register('confirmar')} placeholder="Repita a senha" className={inputCls} />
        </Field>
        <Field label="CPF" error={errors.cpf?.message}>
          <input {...register('cpf')} placeholder="000.000.000-00" className={inputCls}
            onChange={e => setValue('cpf', maskCPF(e.target.value))} maxLength={14} />
        </Field>
        <Field label="Telefone" error={errors.telefone?.message}>
          <input {...register('telefone')} placeholder="(00) 00000-0000" className={inputCls}
            onChange={e => setValue('telefone', maskPhone(e.target.value))} maxLength={15} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Curso pretendido" error={errors.cursoId?.message}>
            <select {...register('cursoId')} className={inputCls}>
              <option value="">Selecione um curso...</option>
              {cursos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </Field>
        </div>
      </div>

      <button type="submit" disabled={isSubmitting}
        className="w-full bg-blue-700 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-800 disabled:opacity-60 transition-colors mt-2">
        {isSubmitting ? 'Criando conta...' : 'Criar minha conta'}
      </button>
    </form>
  )
}

// ── Step 2B: Professor ────────────────────────────────────────────────────────

function StepProfessor({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const { login } = useAuthStore()
  const navigate  = useNavigate()

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<ProfForm>({
    resolver: zodResolver(profSchema) as Resolver<ProfForm>,
    defaultValues: { tipo: 'PROFESSOR' },
  })

  const onSubmit = async (data: ProfForm) => {
    try {
      const res = await api.post('/auth/register', { ...data, tipo: 'PROFESSOR' })
      login(res.data.accessToken, res.data.refreshToken, res.data.usuario)
      toast.success('Cadastro realizado! Bem-vindo(a) à Inovatech!')
      onSuccess()
      navigate('/prof/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg ?? 'Erro ao criar conta. Tente novamente.')
    }
  }

  const titulacoes = [
    { value: 'GRADUACAO',      label: 'Graduação' },
    { value: 'ESPECIALIZACAO', label: 'Especialização' },
    { value: 'MESTRADO',       label: 'Mestrado' },
    { value: 'DOUTORADO',      label: 'Doutorado' },
    { value: 'POS_DOUTORADO',  label: 'Pós-Doutorado' },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="flex items-center gap-2 mb-4">
        <button type="button" onClick={onBack} className="p-1 text-gray-400 hover:text-gray-600">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">Cadastro de Professor</h2>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-sm text-indigo-700">
        Professores passam por validação da coordenação antes de terem acesso completo ao sistema.
      </div>

      <input type="hidden" {...register('tipo')} value="PROFESSOR" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Field label="Nome completo" error={errors.nome?.message}>
            <input {...register('nome')} placeholder="Seu nome completo" className={inputCls} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="E-mail institucional" error={errors.email?.message}>
            <input type="email" {...register('email')} placeholder="prof@inovatech.edu" className={inputCls} />
          </Field>
        </div>
        <Field label="Senha" error={errors.senha?.message}>
          <input type="password" {...register('senha')} placeholder="Mín. 8 caracteres" className={inputCls} />
        </Field>
        <Field label="Confirmar senha" error={errors.confirmar?.message}>
          <input type="password" {...register('confirmar')} placeholder="Repita a senha" className={inputCls} />
        </Field>
        <Field label="CPF" error={errors.cpf?.message}>
          <input {...register('cpf')} placeholder="000.000.000-00" className={inputCls}
            onChange={e => setValue('cpf', maskCPF(e.target.value))} maxLength={14} />
        </Field>
        <Field label="Telefone" error={errors.telefone?.message}>
          <input {...register('telefone')} placeholder="(00) 00000-0000" className={inputCls}
            onChange={e => setValue('telefone', maskPhone(e.target.value))} maxLength={15} />
        </Field>
        <Field label="SIAPE" error={errors.siape?.message}>
          <input {...register('siape')} placeholder="Nº funcional SIAPE" className={inputCls} />
        </Field>
        <Field label="Titulação" error={errors.titulacao?.message}>
          <select {...register('titulacao')} className={inputCls}>
            <option value="">Selecione...</option>
            {titulacoes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </Field>
      </div>

      <button type="submit" disabled={isSubmitting}
        className="w-full bg-indigo-700 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-indigo-800 disabled:opacity-60 transition-colors mt-2">
        {isSubmitting ? 'Criando conta...' : 'Solicitar cadastro'}
      </button>
    </form>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CadastroPage() {
  const [step, setStep]         = useState<'tipo' | 'ALUNO' | 'PROFESSOR'>('tipo')
  const [done, setDone]         = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-700 font-bold text-xl">
            <GraduationCap size={28} /> Inovatech
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          {/* Stepper */}
          {!done && (
            <div className="flex items-center gap-2 mb-8">
              {['Tipo', 'Dados', 'Pronto'].map((label, i) => {
                const stepIdx = step === 'tipo' ? 0 : 1
                const active  = i === (done ? 2 : stepIdx)
                const passed  = i < (done ? 3 : stepIdx)
                return (
                  <div key={label} className="flex items-center flex-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0
                      ${passed ? 'bg-green-500 text-white' : active ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {passed ? <Check size={14} /> : i + 1}
                    </div>
                    <span className={`ml-1.5 text-xs font-medium hidden sm:block
                      ${active ? 'text-blue-700' : passed ? 'text-green-600' : 'text-gray-400'}`}>
                      {label}
                    </span>
                    {i < 2 && <div className="flex-1 h-px bg-gray-200 mx-2" />}
                  </div>
                )
              })}
            </div>
          )}

          {step === 'tipo' && <StepTipo onSelect={t => setStep(t)} />}
          {step === 'ALUNO'     && <StepAluno     onBack={() => setStep('tipo')} onSuccess={() => setDone(true)} />}
          {step === 'PROFESSOR' && <StepProfessor onBack={() => setStep('tipo')} onSuccess={() => setDone(true)} />}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Já tem conta?{' '}
          <Link to="/login" className="text-blue-700 font-medium hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
