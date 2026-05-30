import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Users, GraduationCap, BookOpen, Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminDashboard() {
  const { data: alunos } = useQuery({ queryKey: ['admin-alunos-count'], queryFn: () => api.get('/alunos?size=1').then(r => r.data.totalElements) })
  const { data: profs } = useQuery({ queryKey: ['admin-profs-count'], queryFn: () => api.get('/professores?size=1').then(r => r.data.totalElements) })
  const { data: cursos } = useQuery({ queryKey: ['cursos'], queryFn: () => api.get('/cursos').then(r => r.data) })
  const { data: produtos } = useQuery({ queryKey: ['produtos-count'], queryFn: () => api.get('/produtos?size=1').then(r => r.data.totalElements) })

  const cards = [
    { label: 'Alunos', value: alunos ?? '—', Icon: Users, to: '/admin/alunos', color: 'bg-blue-600' },
    { label: 'Professores', value: profs ?? '—', Icon: GraduationCap, to: '/admin/professores', color: 'bg-emerald-600' },
    { label: 'Cursos', value: cursos?.length ?? '—', Icon: BookOpen, to: '/admin/cursos', color: 'bg-violet-600' },
    { label: 'Produtos', value: produtos ?? '—', Icon: Package, to: '/admin/produtos', color: 'bg-orange-600' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Administrativo</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, Icon, to, color }) => (
          <Link key={to} to={to}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`${color} text-white p-3 rounded-xl flex-shrink-0`}><Icon size={22} /></div>
                <div>
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold mb-3">Acesso rápido</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ['/admin/alunos', 'Gerenciar Alunos'],
              ['/admin/professores', 'Gerenciar Professores'],
              ['/admin/turmas', 'Gerenciar Turmas'],
              ['/admin/posts', 'Blog Posts'],
            ].map(([to, label]) => (
              <Button key={to} variant="outline" size="sm" asChild>
                <Link to={to}>{label}</Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
