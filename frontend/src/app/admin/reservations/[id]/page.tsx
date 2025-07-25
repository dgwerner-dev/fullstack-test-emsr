import EventReservations from "@/features/admin/EventReservations";

export default function EventReservationsPage({ params }: { params: { id: string } }) {
  return <EventReservations eventId={params.id} />;
} 