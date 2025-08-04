'use client';
import { cancelReservation, getMyReservations } from '@/services/reservations';
import { useEffect, useState } from 'react';

export default function MyReservations() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const loadReservations = () => {
    setLoading(true);
    getMyReservations()
      .then(setReservations)
      .catch(err => {
        if (
          err.message &&
          (err.message.includes('403') ||
            err.message.toLowerCase().includes('forbidden'))
        ) {
          setError(
            'Acesso negado: apenas usuários comuns podem acessar suas próprias reservas.'
          );
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleCancel = async (reservationId: string) => {
    if (!confirm('Tem certeza que deseja cancelar esta reserva?')) return;

    setCancelingId(reservationId);
    setError(''); // Limpar erro anterior
    try {
      await cancelReservation(reservationId);
      loadReservations(); // Recarrega a lista
    } catch (err: any) {
      setError(err.message || 'Erro ao cancelar reserva');
    } finally {
      setCancelingId(null);
    }
  };

  if (loading) return <div>Carregando reservas...</div>;
  if (error)
    return <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>;
  if (!reservations.length) return <div>Você não possui reservas.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Minhas Reservas</h2>
      <ul className="space-y-4">
        {reservations.map(r => (
          <li key={r.id} className="bg-white p-4 rounded shadow">
            <div>
              <b>Evento:</b> {r.event?.name || r.eventId}
            </div>
            <div>
              <b>Status:</b>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs ${
                  r.status === 'CONFIRMED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {r.status === 'CONFIRMED' ? 'Confirmada' : 'Cancelada'}
              </span>
            </div>
            <div>
              <b>Data:</b> {new Date(r.reservationDate).toLocaleString()}
            </div>
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
