import { Link } from 'react-router-dom'
import { GraduationCap, Target, Eye, Award } from 'lucide-react'

export default function SobrePage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-blue-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <GraduationCap size={48} className="mx-auto mb-4 opacity-90" />
          <h1 className="text-4xl font-bold mb-4">Sobre a Inovatech</h1>
          <p className="text-blue-100 text-xl">
            15 anos formando profissionais de excelência em tecnologia e inovação.
          </p>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              Icon: Target, title: 'Missão',
              text: 'Oferecer educação tecnológica de qualidade, acessível e alinhada às demandas do mercado de trabalho, contribuindo para o desenvolvimento social e econômico da região.',
            },
            {
              Icon: Eye, title: 'Visão',
              text: 'Ser referência nacional em educação tecnológica até 2030, reconhecida pela excelência acadêmica, inovação e impacto positivo na sociedade.',
            },
            {
              Icon: Award, title: 'Valores',
              text: 'Excelência, inovação, inclusão, responsabilidade social e ética pautam todas as nossas ações e decisões institucionais.',
            },
          ].map(({ Icon, title, text }) => (
            <div key={title} className="text-center p-6">
              <Icon size={36} className="mx-auto text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* History */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Nossa História</h2>
          <div className="prose max-w-none text-gray-600 leading-relaxed space-y-4">
            <p>
              Fundada em 2011, a Faculdade Inovatech nasceu da visão de um grupo de educadores e empresários que
              identificaram a necessidade de uma instituição focada exclusivamente em tecnologia no interior do estado.
            </p>
            <p>
              Ao longo de 15 anos, expandimos nossa oferta de cursos, modernizamos nossas instalações e firmamos
              parcerias estratégicas com empresas de tecnologia de todo o Brasil, garantindo que nossos alunos
              tenham acesso às melhores oportunidades de carreira.
            </p>
            <p>
              Hoje somos orgulhosamente reconhecidos pelo MEC com conceito máximo em todos os nossos cursos,
              e nossa taxa de empregabilidade dos formandos supera 95% dentro de 6 meses após a conclusão.
            </p>
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Nossa Infraestrutura</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              ['8', 'Laboratórios de informática'],
              ['500+', 'Computadores disponíveis'],
              ['2', 'Auditórios'],
              ['Wi-Fi', 'Em todo o campus'],
            ].map(([val, label]) => (
              <div key={label} className="p-6 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-700 mb-1">{val}</div>
                <div className="text-sm text-gray-600">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 py-16 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Faça parte da nossa história</h2>
          <p className="text-blue-100 mb-8">Conheça nossos cursos e dê o próximo passo na sua carreira.</p>
          <Link to="/cursos" className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Ver cursos
          </Link>
        </div>
      </section>
    </div>
  )
}
