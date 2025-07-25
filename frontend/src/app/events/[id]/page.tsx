import EventDetail from "@/features/events/EventDetail";

/**
 * Página dinâmica para exibir detalhes de um evento específico.
 * O parâmetro [id] é capturado automaticamente pelo Next.js App Router.
 */
export default function EventPage({ params }: { params: { id: string } }) {
  return <EventDetail eventId={params.id} />;
}
