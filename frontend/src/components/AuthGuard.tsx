import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

interface Props { roles: string[] }

export default function AuthGuard({ roles }: Props) {
  const { accessToken, usuario } = useAuthStore()
  if (!accessToken || !usuario) return <Navigate to="/login" replace />
  if (!roles.includes(usuario.tipo)) return <Navigate to="/" replace />
  return <Outlet />
}
