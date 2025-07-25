"use client";
import { getEventReservations } from "@/services/reservations";
import { useEffect, useState } from "react";

export default function EventReservations({ eventId }: { eventId: string }) {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getEventReservations(eventId)
      .then(setReservations)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [eventId]);

  if (loading) return <div>Carregando reservas...</div>;
  if (error) return <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>;
  if (!reservations.length) return <div>Não há reservas para este evento.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Reservas do Evento</h2>
      <ul className="space-y-4">
        {reservations.map(r => (
          <li key={r.id} className="bg-white p-4 rounded shadow">
            <div><b>Usuário:</b> {r.user?.name || r.userId}</div>
            <div><b>Status:</b> {r.status}</div>
            <div><b>Data:</b> {new Date(r.reservationDate).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
} 