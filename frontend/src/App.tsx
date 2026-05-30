import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

// Layouts
import PublicLayout from '@/layouts/PublicLayout'
import AppLayout from '@/layouts/AppLayout'
import ProfLayout from '@/layouts/ProfLayout'
import AdminLayout from '@/layouts/AdminLayout'
import AuthGuard from '@/components/AuthGuard'

// Public portal
import HomePage from '@/pages/portal/HomePage'
import BlogPage from '@/pages/portal/BlogPage'
import BlogPostPage from '@/pages/portal/BlogPostPage'
import CursosPage from '@/pages/portal/CursosPage'
import CursoDetailPage from '@/pages/portal/CursoDetailPage'
import EventosPage from '@/pages/portal/EventosPage'
import SobrePage from '@/pages/portal/SobrePage'

// Auth
import LoginPage from '@/pages/auth/LoginPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage'

// Student
import AlunoDashboard from '@/pages/aluno/AlunoDashboard'
import AlunoMatriculas from '@/pages/aluno/AlunoMatriculas'
import AlunoNotas from '@/pages/aluno/AlunoNotas'
import AlunoFrequencia from '@/pages/aluno/AlunoFrequencia'
import AlunoCalendario from '@/pages/aluno/AlunoCalendario'
import AlunoDocumentos from '@/pages/aluno/AlunoDocumentos'
import AlunoPedidos from '@/pages/aluno/AlunoPedidos'
import AlunoPerfil from '@/pages/aluno/AlunoPerfil'

// Professor
import ProfDashboard from '@/pages/professor/ProfDashboard'
import ProfTurmas from '@/pages/professor/ProfTurmas'
import ProfTurmaDetail from '@/pages/professor/ProfTurmaDetail'
import ProfChamada from '@/pages/professor/ProfChamada'

// Admin
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminAlunos from '@/pages/admin/AdminAlunos'
import AdminProfessores from '@/pages/admin/AdminProfessores'
import AdminCursos from '@/pages/admin/AdminCursos'
import AdminDisciplinas from '@/pages/admin/AdminDisciplinas'
import AdminTurmas from '@/pages/admin/AdminTurmas'
import AdminPosts from '@/pages/admin/AdminPosts'
import AdminProdutos from '@/pages/admin/AdminProdutos'
import AdminEventos from '@/pages/admin/AdminEventos'

// Loja
import LojaPage from '@/pages/loja/LojaPage'
import ProdutoDetailPage from '@/pages/loja/ProdutoDetailPage'
import CarrinhoPage from '@/pages/loja/CarrinhoPage'
import CheckoutPage from '@/pages/loja/CheckoutPage'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60, retry: 1 } },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public portal */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/cursos" element={<CursosPage />} />
            <Route path="/cursos/:slug" element={<CursoDetailPage />} />
            <Route path="/eventos" element={<EventosPage />} />
            <Route path="/sobre" element={<SobrePage />} />
            <Route path="/loja" element={<LojaPage />} />
            <Route path="/loja/:slug" element={<ProdutoDetailPage />} />
            <Route path="/carrinho" element={<CarrinhoPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
          <Route path="/redefinir-senha" element={<ResetPasswordPage />} />

          {/* Student area */}
          <Route element={<AuthGuard roles={['ALUNO']} />}>
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<AlunoDashboard />} />
              <Route path="matriculas" element={<AlunoMatriculas />} />
              <Route path="notas" element={<AlunoNotas />} />
              <Route path="frequencia" element={<AlunoFrequencia />} />
              <Route path="calendario" element={<AlunoCalendario />} />
              <Route path="documentos" element={<AlunoDocumentos />} />
              <Route path="pedidos" element={<AlunoPedidos />} />
              <Route path="perfil" element={<AlunoPerfil />} />
            </Route>
          </Route>

          {/* Professor area */}
          <Route element={<AuthGuard roles={['PROFESSOR']} />}>
            <Route path="/prof" element={<ProfLayout />}>
              <Route index element={<Navigate to="/prof/dashboard" replace />} />
              <Route path="dashboard" element={<ProfDashboard />} />
              <Route path="turmas" element={<ProfTurmas />} />
              <Route path="turmas/:id" element={<ProfTurmaDetail />} />
              <Route path="turmas/:id/chamada/:aulaId" element={<ProfChamada />} />
            </Route>
          </Route>

          {/* Admin area */}
          <Route element={<AuthGuard roles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="alunos" element={<AdminAlunos />} />
              <Route path="professores" element={<AdminProfessores />} />
              <Route path="cursos" element={<AdminCursos />} />
              <Route path="disciplinas" element={<AdminDisciplinas />} />
              <Route path="turmas" element={<AdminTurmas />} />
              <Route path="posts" element={<AdminPosts />} />
              <Route path="produtos" element={<AdminProdutos />} />
              <Route path="eventos" element={<AdminEventos />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  )
}


