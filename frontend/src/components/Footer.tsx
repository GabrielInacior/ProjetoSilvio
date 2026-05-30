import { Link } from 'react-router-dom'
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-gray-700">
          <div>
            <div className="flex items-center gap-2 font-bold text-white text-lg mb-3">
              <GraduationCap size={22} /> Inovatech
            </div>
            <p className="text-sm leading-relaxed">
              Formando profissionais de excelência para o mercado de tecnologia.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Navegação</h4>
            <ul className="space-y-2 text-sm">
              {[['/', 'Início'], ['/cursos', 'Cursos'], ['/blog', 'Blog'], ['/eventos', 'Eventos'], ['/sobre', 'Sobre']].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Portal</h4>
            <ul className="space-y-2 text-sm">
              {[['/login', 'Login'], ['/app/dashboard', 'Área do Aluno'], ['/prof/dashboard', 'Área do Professor'], ['/loja', 'Loja']].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><MapPin size={14} /> Jales, SP — Brasil</li>
              <li className="flex items-center gap-2"><Phone size={14} /> (17) 3000-0000</li>
              <li className="flex items-center gap-2"><Mail size={14} /> contato@inovatech.edu.br</li>
            </ul>
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-6">
          © 2026 Faculdade Inovatech. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
