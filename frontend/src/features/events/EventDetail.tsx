'use client';

import { getEventById } from '@/services/events';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ReserveButton from './components/ReserveButton';

/**
 * Componente para exibir detalhes de um evento específico.
 * Design moderno com layout rico e melhor UX.
 */
export default function EventDetail({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getEventById(eventId)
      .then(setEvent)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Carregando evento...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md mx-auto">
              <p className="text-lg font-medium">Erro ao carregar evento</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <Link
              href="/"
              className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Voltar para eventos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Evento não encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                O evento que você está procurando não existe ou foi removido.
              </p>
              <Link
                href="/"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Voltar para eventos
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calcular vagas disponíveis considerando apenas reservas confirmadas
  const confirmedReservations =
    event.reservations?.filter((r: any) => r.status === 'CONFIRMED') || [];
  const availableSpots = event.maxCapacity - confirmedReservations.length;
  const isFull = availableSpots <= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Voltar para eventos
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Section */}
          <div className="h-64 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-2">{event.name}</h1>
                <p className="text-xl opacity-90">
                  {new Date(event.eventDate).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-lg opacity-75">
                  {new Date(event.eventDate).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="absolute top-6 right-6">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  isFull ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}
              >
                {isFull ? 'Lotado' : `${availableSpots} vagas disponíveis`}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {event.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Sobre o evento
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {event.description}
                </p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Event Details */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Informações do Evento
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Data e Hora</p>
                      <p className="font-medium text-gray-900">
                        {new Date(event.eventDate).toLocaleDateString('pt-BR')}{' '}
                        às{' '}
                        {new Date(event.eventDate).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {event.location && (
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Local</p>
                        <p className="font-medium text-gray-900">
                          {event.location}
                        </p>
                      </div>
                    </div>
                  )}

                  {event.onlineLink && (
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <svg
                          className="w-5 h-5 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Link Online</p>
                        <a
                          href={event.onlineLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-purple-600 hover:text-purple-700 transition-colors"
                        >
                          Acessar evento →
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Capacity Info */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Capacidade
                </h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Máximo de participantes:
                      </span>
                      <span className="font-semibold text-gray-900">
                        {event.maxCapacity}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Reservas confirmadas:
                      </span>
                      <span className="font-semibold text-gray-900">
                        {confirmedReservations.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Vagas disponíveis:</span>
                      <span
                        className={`font-semibold ${isFull ? 'text-red-600' : 'text-green-600'}`}
                      >
                        {availableSpots}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Ocupação</span>
                        <span>
                          {Math.round(
                            (confirmedReservations.length / event.maxCapacity) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            isFull ? 'bg-red-500' : 'bg-green-500'
                          }`}
                          style={{
                            width: `${Math.min((confirmedReservations.length / event.maxCapacity) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reservation Section */}
            <div className="border-t border-gray-200 pt-8">
              <ReserveButton
                eventId={event.id}
                availableSpots={availableSpots}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
