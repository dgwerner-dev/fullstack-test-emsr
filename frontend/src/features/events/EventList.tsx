"use client";

import { getEvents } from "@/services/events";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Lista de eventos disponíveis para reserva.
 * Design moderno com cards atrativos e melhor UX.
 */
export default function EventList() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    getEvents({ name: filterName, date: filterDate })
      .then(setEvents)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [filterName, filterDate]);

  return (
    <div>
      <div className="flex gap-4 mb-4 items-center">
        <input type="text" placeholder="Filtrar por nome" value={filterName} onChange={e => setFilterName(e.target.value)} className="border px-2 py-1 rounded" />
        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="border px-2 py-1 rounded" />
        <button
          type="button"
          onClick={() => { setFilterName(""); setFilterDate(""); }}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          disabled={!filterName && !filterDate}
        >
          Limpar filtros
        </button>
      </div>
      {loading ? (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">Carregando eventos...</p>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md mx-auto">
                <p className="text-lg font-medium">Erro ao carregar eventos</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">Nenhum evento encontrado para o filtro selecionado.</div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map(event => (
            <Link key={event.id} href={`/events/${event.id}`} className="group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
                {/* Event Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                      {event.maxCapacity - (event.reservations?.length ?? 0)} vagas
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="text-white">
                      <p className="text-sm opacity-90">
                        {new Date(event.eventDate).toLocaleDateString('pt-BR', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-xs opacity-75">
                        {new Date(event.eventDate).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {event.name}
                  </h3>
                  
                  {event.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  <div className="space-y-2">
                    {event.location && (
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </div>
                    )}
                    
                    {event.onlineLink && (
                      <div className="flex items-center text-sm text-blue-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                        </svg>
                        Evento Online
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {event.reservations?.length ?? 0} reservas
                      </span>
                      <span className="text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                        Ver detalhes →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
