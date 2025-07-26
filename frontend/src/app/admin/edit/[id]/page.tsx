import EventForm from "@/features/admin/EventForm";
 
export default function EditEventPage({ params }: { params: { id: string } }) {
  return <EventForm mode="edit" eventId={params.id} />;
} 