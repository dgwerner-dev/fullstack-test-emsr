'use client';
import { getEvents } from '@/services/events';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminPanel() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Carregando eventos...</div>;
  if (error)
    return <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Painel Admin</h2>
      <Link
        href="/admin/create"
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Criar Evento
      </Link>
      <ul className="space-y-4 mt-4">
        {events.map(e => (
          <li
            key={e.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <div>
                <b>{e.name}</b>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(e.eventDate).toLocaleString()}
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/edit/${e.id}`} className="text-blue-600">
                Editar
              </Link>
              <Link
                href={`/admin/reservations/${e.id}`}
                className="text-purple-600"
              >
                Reservas
              </Link>
              <button className="text-red-600">Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
