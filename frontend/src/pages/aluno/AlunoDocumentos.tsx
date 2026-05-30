import { api } from '@/lib/api'
import { FileText, Download } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

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
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Documentos</h1>
        <p className="text-muted-foreground mt-1">Gere e baixe seus documentos acadêmicos em PDF.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map((doc) => (
          <Card key={doc.id}>
            <CardContent className="p-6 flex items-start gap-4">
              <div className="bg-blue-100 text-blue-700 p-3 rounded-xl flex-shrink-0">
                <FileText size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{doc.titulo}</h3>
                <p className="text-muted-foreground text-sm mt-1">{doc.descricao}</p>
                <Button className="mt-4" size="sm" onClick={() => download(doc)} disabled={loading === doc.id}>
                  <Download size={15} className="mr-2" />
                  {loading === doc.id ? 'Gerando...' : 'Baixar PDF'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
