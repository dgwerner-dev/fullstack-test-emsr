"use client";

import { getEventById } from "@/services/events";
import { useEffect, useState } from "react";
import ReserveButton from "./components/ReserveButton";

/**
 * Componente para exibir detalhes de um evento específico.
 * Mostra todas as informações do evento e permite fazer reservas.
 */
export default function EventDetail({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getEventById(eventId)
      .then(setEvent)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [eventId]);

  if (loading) return <div className="text-center mt-8">Carregando evento...</div>;
  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;
  if (!event) return <div className="text-center mt-8">Evento não encontrado.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
        
        {event.description && (
          <p className="text-gray-700 mb-6">{event.description}</p>
        )}
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Informações do Evento</h3>
            <div className="space-y-2">
              <p><strong>Data:</strong> {new Date(event.eventDate).toLocaleString()}</p>
              {event.location && <p><strong>Local:</strong> {event.location}</p>}
              {event.onlineLink && (
                <p>
                  <strong>Link Online:</strong>{" "}
                  <a href={event.onlineLink} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    Acessar evento
                  </a>
                </p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Capacidade</h3>
            <div className="space-y-2">
              <p><strong>Máximo de participantes:</strong> {event.maxCapacity}</p>
              <p><strong>Reservas atuais:</strong> {event.reservations?.length ?? 0}</p>
              <p><strong>Vagas disponíveis:</strong> {event.maxCapacity - (event.reservations?.length ?? 0)}</p>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-6">
          <ReserveButton eventId={event.id} availableSpots={event.maxCapacity - (event.reservations?.length ?? 0)} />
        </div>
      </div>
    </div>
  );
}
