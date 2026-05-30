import { api } from '@/lib/api'
import { FileText, Download } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'

const docs = [
  {
    id: 'declaracao',
    titulo: 'Declaração de Matrícula',
    descricao: 'Documento oficial que comprova seu vínculo ativo com a instituição.',
    endpoint: '/aluno/documentos/declaracao-matricula',
    filename: 'declaracao-matricula.pdf',
  },
  {
    id: 'historico',
    titulo: 'Histórico Escolar',
    descricao: 'Histórico completo com todas as disciplinas cursadas e médias obtidas.',
    endpoint: '/aluno/documentos/historico',
    filename: 'historico-escolar.pdf',
  },
]

export default function AlunoDocumentos() {
  const [loading, setLoading] = useState<string | null>(null)

  const download = async (doc: typeof docs[0]) => {
    setLoading(doc.id)
    try {
      const res = await api.get(doc.endpoint, { responseType: 'blob' })
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url
      a.download = doc.filename
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Documento baixado com sucesso!')
    } catch {
      toast.error('Não foi possível gerar o documento. Tente novamente.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Documentos</h1>
      <p className="text-gray-500 mb-8">Gere e baixe seus documentos acadêmicos em PDF.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {docs.map((doc) => (
          <div key={doc.id} className="bg-white border rounded-xl p-6 flex items-start gap-4">
            <div className="bg-blue-100 text-blue-700 p-3 rounded-xl">
              <FileText size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{doc.titulo}</h3>
              <p className="text-gray-500 text-sm mt-1">{doc.descricao}</p>
              <button
                onClick={() => download(doc)}
                disabled={loading === doc.id}
                className="mt-4 flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 disabled:opacity-60 transition-colors"
              >
                <Download size={15} />
                {loading === doc.id ? 'Gerando...' : 'Baixar PDF'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
