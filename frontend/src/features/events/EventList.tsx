"use client";

import { getEvents } from "@/services/events";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Lista de eventos disponíveis para reserva.
 * Exibe todos os eventos em cards clicáveis que levam aos detalhes.
 */
export default function EventList() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-8">Carregando eventos...</div>;
  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;
  if (!events.length) return <div className="text-center mt-8">Nenhum evento encontrado.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-8 grid gap-6">
      {events.map(event => (
        <Link key={event.id} href={`/events/${event.id}`} className="block">
          <div className="bg-white rounded shadow p-6 flex flex-col gap-2 hover:bg-blue-50 transition">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">{event.name}</h3>
              <span className="text-sm text-gray-500">{new Date(event.eventDate).toLocaleString()}</span>
            </div>
            {event.description && <p className="text-gray-700">{event.description}</p>}
            <div className="flex gap-4 text-sm text-gray-600">
              {event.location && <span>Local: {event.location}</span>}
              {event.onlineLink && <span>Online: <a href={event.onlineLink} className="underline" target="_blank">Acessar</a></span>}
            </div>
            <div className="flex gap-4 text-sm mt-2">
              <span>Capacidade: {event.maxCapacity}</span>
              <span>Reservas: {event.reservations?.length ?? 0}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
