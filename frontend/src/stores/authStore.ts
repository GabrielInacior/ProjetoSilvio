import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Usuario {
  id: number
  nome: string
  email: string
  tipo: 'ALUNO' | 'PROFESSOR' | 'ADMIN'
  avatarUrl?: string
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  usuario: Usuario | null
  setTokens: (access: string, refresh: string) => void
  setUsuario: (u: Usuario) => void
  login: (access: string, refresh: string, usuario: Usuario) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      usuario: null,
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      setUsuario: (usuario) => set({ usuario }),
      login: (accessToken, refreshToken, usuario) =>
        set({ accessToken, refreshToken, usuario }),
      logout: () => set({ accessToken: null, refreshToken: null, usuario: null }),
    }),
    { name: 'inovatech-auth', partialize: (s) => ({ accessToken: s.accessToken, refreshToken: s.refreshToken, usuario: s.usuario }) }
  )
)
