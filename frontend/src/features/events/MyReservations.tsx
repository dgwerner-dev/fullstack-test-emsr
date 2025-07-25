"use client";
import { getMyReservations } from "@/services/reservations";
import { useEffect, useState } from "react";

export default function MyReservations() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyReservations()
      .then(setReservations)
      .catch(err => {
        if (err.message && (err.message.includes('403') || err.message.toLowerCase().includes('forbidden'))) {
          setError('Acesso negado: apenas usuários comuns podem acessar suas próprias reservas.');
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Carregando reservas...</div>;
  if (error) return <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>;
  if (!reservations.length) return <div>Você não possui reservas.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Minhas Reservas</h2>
      <ul className="space-y-4">
        {reservations.map(r => (
          <li key={r.id} className="bg-white p-4 rounded shadow">
            <div><b>Evento:</b> {r.event?.name || r.eventId}</div>
            <div><b>Status:</b> {r.status}</div>
            <div><b>Data:</b> {new Date(r.reservationDate).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
} 