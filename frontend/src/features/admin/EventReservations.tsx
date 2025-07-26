"use client";
import { cancelReservation, getEventReservations } from "@/services/reservations";
import { useEffect, useState } from "react";

export default function EventReservations({ eventId }: { eventId: string }) {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const loadReservations = () => {
    setLoading(true);
    getEventReservations(eventId)
      .then(setReservations)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReservations();
  }, [eventId]);

  const handleCancel = async (reservationId: string) => {
    if (!confirm("Tem certeza que deseja cancelar esta reserva?")) return;
    
    setCancelingId(reservationId);
    setError(""); // Limpar erro anterior
    try {
      await cancelReservation(reservationId);
      loadReservations(); // Recarrega a lista
    } catch (err: any) {
      setError(err.message || "Erro ao cancelar reserva");
    } finally {
      setCancelingId(null);
    }
  };

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
            <div><b>Status:</b> 
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                r.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {r.status === 'CONFIRMED' ? 'Confirmada' : 'Cancelada'}
              </span>
            </div>
            <div><b>Data:</b> {new Date(r.reservationDate).toLocaleString()}</div>
            {r.status === 'CONFIRMED' && (
              <button
                onClick={() => handleCancel(r.id)}
                disabled={cancelingId === r.id}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
              >
                {cancelingId === r.id ? 'Cancelando...' : 'Cancelar Reserva'}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
} 