import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'

export default function AlunoCalendario() {
  const { data: matriculas = [] } = useQuery({
    queryKey: ['aluno-matriculas'],
    queryFn: () => api.get('/aluno/matriculas').then((r) => r.data),
  })

  const dayMap: Record<string, number> = {
    SEGUNDA: 1, TERCA: 2, QUARTA: 3, QUINTA: 4, SEXTA: 5, SABADO: 6,
  }

  const events = useMemo(() =>
    (matriculas as { id: number; disciplina: string; diaSemana: string; horaInicio: string; horaFim: string }[]).map((m) => ({
      title: m.disciplina,
      daysOfWeek: [dayMap[m.diaSemana] ?? 1],
      startTime: m.horaInicio,
      endTime: m.horaFim,
      backgroundColor: '#2563eb',
      borderColor: '#1d4ed8',
    })), [matriculas])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Calendário</h1>
      <Card><CardContent className="p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale={ptBrLocale}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={events}
          height="auto"
          allDaySlot={false}
          slotMinTime="07:00:00"
          slotMaxTime="22:00:00"
        />
      </CardContent></Card>
    </div>
  )
}
