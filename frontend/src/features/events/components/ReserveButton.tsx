"use client";

import { useAuth } from "@/contexts/AuthContext";
import { reserveEvent } from "@/services/reservations";
import { useState } from "react";

/**
 * Botão para reservar vaga em um evento.
 * Design moderno com feedback visual aprimorado.
 */
export default function ReserveButton({ eventId, availableSpots }: { eventId: string; availableSpots: number }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const { user } = useAuth();

  const handleReserve = async () => {
    if (!user) {
      setMessage("Você precisa estar logado para fazer uma reserva.");
      setMessageType("error");
      return;
    }

    if (availableSpots <= 0) {
      setMessage("Este evento está lotado.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");
      await reserveEvent(eventId, token);
      setMessage("Reserva realizada com sucesso! 🎉");
      setMessageType("success");
    } catch (err: any) {
      setMessage(err.message || "Erro ao fazer reserva");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const isFull = availableSpots <= 0;
  const needsLogin = !user;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {isFull ? "Evento Lotado" : "Reservar sua vaga"}
        </h3>
        <p className="text-gray-600">
          {isFull 
            ? "Todas as vagas foram preenchidas. Tente outro evento!"
            : needsLogin
            ? "Faça login para reservar sua vaga neste evento incrível"
            : `Garanta sua participação! Restam apenas ${availableSpots} vagas.`
          }
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleReserve}
          disabled={loading || needsLogin || isFull}
          className={`px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed ${
            needsLogin
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : isFull
              ? "bg-red-400 text-white cursor-not-allowed"
              : loading
              ? "bg-blue-400 text-white cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
          }`}
        >
          {loading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            </div>
          ) : needsLogin ? (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Faça login para reservar
            </div>
          ) : isFull ? (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Evento lotado
            </div>
          ) : (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Reservar vaga
            </div>
          )}
        </button>
      </div>
      
      {message && (
        <div className={`text-center p-4 rounded-xl border-2 transition-all duration-300 ${
          messageType === "success" 
            ? "bg-green-50 border-green-200 text-green-700" 
            : "bg-red-50 border-red-200 text-red-700"
        }`}>
          <div className="flex items-center justify-center">
            {messageType === "success" ? (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            )}
            <span className="font-medium">{message}</span>
          </div>
        </div>
      )}

      {needsLogin && (
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">Não tem uma conta?</p>
          <a 
            href="/register" 
            className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Criar conta gratuita
          </a>
        </div>
      )}
    </div>
  );
}
