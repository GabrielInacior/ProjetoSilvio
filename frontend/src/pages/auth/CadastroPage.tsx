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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

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
      <h2 className="text-xl font-semibold text-center mb-6">Como deseja se cadastrar?</h2>
      <button onClick={() => onSelect('ALUNO')}
        className="w-full flex items-center gap-4 border-2 border-border rounded-xl p-5 hover:border-primary hover:bg-primary/5 transition-all group text-left">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 flex-shrink-0">
          <User size={24} />
        </div>
        <div>
          <p className="font-semibold">Sou Aluno</p>
          <p className="text-sm text-muted-foreground mt-0.5">Acesse o portal acadêmico, notas, frequência e muito mais.</p>
        </div>
        <ChevronRight size={20} className="ml-auto text-muted-foreground group-hover:text-primary" />
      </button>

      <button onClick={() => onSelect('PROFESSOR')}
        className="w-full flex items-center gap-4 border-2 border-border rounded-xl p-5 hover:border-indigo-500 hover:bg-indigo-50 transition-all group text-left">
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 group-hover:bg-indigo-200 flex-shrink-0">
          <BookOpen size={24} />
        </div>
        <div>
          <p className="font-semibold">Sou Professor</p>
          <p className="text-sm text-muted-foreground mt-0.5">Gerencie suas turmas, aulas, chamadas e lançamentos de notas.</p>
        </div>
        <ChevronRight size={20} className="ml-auto text-muted-foreground group-hover:text-indigo-600" />
      </button>
    </div>
  )
}

// ── Shared field components ───────────────────────────────────────────────────

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  )
}

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
        <Button type="button" variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft size={20} />
        </Button>
        <h2 className="text-lg font-semibold">Cadastro de Aluno</h2>
      </div>

      <input type="hidden" {...register('tipo')} value="ALUNO" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Field label="Nome completo" error={errors.nome?.message}>
            <Input {...register('nome')} placeholder="Seu nome completo" />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="E-mail" error={errors.email?.message}>
            <Input type="email" {...register('email')} placeholder="seu@email.com" />
          </Field>
        </div>
        <Field label="Senha" error={errors.senha?.message}>
          <Input type="password" {...register('senha')} placeholder="Mín. 8 caracteres" />
        </Field>
        <Field label="Confirmar senha" error={errors.confirmar?.message}>
          <Input type="password" {...register('confirmar')} placeholder="Repita a senha" />
        </Field>
        <Field label="CPF" error={errors.cpf?.message}>
          <Input {...register('cpf')} placeholder="000.000.000-00"
            onChange={e => setValue('cpf', maskCPF(e.target.value))} maxLength={14} />
        </Field>
        <Field label="Telefone" error={errors.telefone?.message}>
          <Input {...register('telefone')} placeholder="(00) 00000-0000"
            onChange={e => setValue('telefone', maskPhone(e.target.value))} maxLength={15} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Curso pretendido" error={errors.cursoId?.message}>
            <select {...register('cursoId')} className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">Selecione um curso...</option>
              {cursos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </Field>
        </div>
      </div>

      <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
        {isSubmitting ? 'Criando conta...' : 'Criar minha conta'}
      </Button>
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
        <Button type="button" variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft size={20} />
        </Button>
        <h2 className="text-lg font-semibold">Cadastro de Professor</h2>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-sm text-indigo-700">
        Professores passam por validação da coordenação antes de terem acesso completo ao sistema.
      </div>

      <input type="hidden" {...register('tipo')} value="PROFESSOR" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Field label="Nome completo" error={errors.nome?.message}>
            <Input {...register('nome')} placeholder="Seu nome completo" />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="E-mail institucional" error={errors.email?.message}>
            <Input type="email" {...register('email')} placeholder="prof@inovatech.edu" />
          </Field>
        </div>
        <Field label="Senha" error={errors.senha?.message}>
          <Input type="password" {...register('senha')} placeholder="Mín. 8 caracteres" />
        </Field>
        <Field label="Confirmar senha" error={errors.confirmar?.message}>
          <Input type="password" {...register('confirmar')} placeholder="Repita a senha" />
        </Field>
        <Field label="CPF" error={errors.cpf?.message}>
          <Input {...register('cpf')} placeholder="000.000.000-00"
            onChange={e => setValue('cpf', maskCPF(e.target.value))} maxLength={14} />
        </Field>
        <Field label="Telefone" error={errors.telefone?.message}>
          <Input {...register('telefone')} placeholder="(00) 00000-0000"
            onChange={e => setValue('telefone', maskPhone(e.target.value))} maxLength={15} />
        </Field>
        <Field label="SIAPE" error={errors.siape?.message}>
          <Input {...register('siape')} placeholder="Nº funcional SIAPE" />
        </Field>
        <Field label="Titulação" error={errors.titulacao?.message}>
          <select {...register('titulacao')} className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="">Selecione...</option>
            {titulacoes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </Field>
      </div>

      <Button type="submit" className="w-full mt-2 bg-indigo-700 hover:bg-indigo-800" disabled={isSubmitting}>
        {isSubmitting ? 'Criando conta...' : 'Solicitar cadastro'}
      </Button>
    </form>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CadastroPage() {
  const [step, setStep]         = useState<'tipo' | 'ALUNO' | 'PROFESSOR'>('tipo')
  const [done, setDone]         = useState(false)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold text-xl">
            <GraduationCap size={28} /> Inovatech
          </Link>
        </div>

        <Card>
          <CardContent className="p-8">
            {!done && (
              <div className="flex items-center gap-2 mb-8">
                {['Tipo', 'Dados', 'Pronto'].map((label, i) => {
                  const stepIdx = step === 'tipo' ? 0 : 1
                  const active  = i === (done ? 2 : stepIdx)
                  const passed  = i < (done ? 3 : stepIdx)
                  let dotCls = 'bg-muted text-muted-foreground'
                  if (passed) dotCls = 'bg-green-500 text-white'
                  else if (active) dotCls = 'bg-primary text-primary-foreground'
                  let lblCls = 'text-muted-foreground'
                  if (active) lblCls = 'text-primary'
                  else if (passed) lblCls = 'text-green-600'
                  return (
                    <div key={label} className="flex items-center flex-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${dotCls}`}>
                        {passed ? <Check size={14} /> : i + 1}
                      </div>
                      <span className={`ml-1.5 text-xs font-medium hidden sm:block ${lblCls}`}>
                        {label}
                      </span>
                      {i < 2 && <div className="flex-1 h-px bg-border mx-2" />}
                    </div>
                  )
                })}
              </div>
            )}

            {step === 'tipo' && <StepTipo onSelect={t => setStep(t)} />}
            {step === 'ALUNO'     && <StepAluno     onBack={() => setStep('tipo')} onSuccess={() => setDone(true)} />}
            {step === 'PROFESSOR' && <StepProfessor onBack={() => setStep('tipo')} onSuccess={() => setDone(true)} />}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Já tem conta?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
