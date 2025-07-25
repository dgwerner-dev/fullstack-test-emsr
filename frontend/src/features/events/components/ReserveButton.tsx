"use client";

import { useAuth } from "@/contexts/AuthContext";
import { reserveEvent } from "@/services/reservations";
import { useState } from "react";

/**
 * Botão para reservar vaga em um evento.
 * Permite que usuários autenticados façam reservas em eventos disponíveis.
 */
export default function ReserveButton({ eventId, availableSpots }: { eventId: string; availableSpots: number }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  const handleReserve = async () => {
    if (!user) {
      setMessage("Você precisa estar logado para fazer uma reserva.");
      return;
    }

    if (availableSpots <= 0) {
      setMessage("Este evento está lotado.");
      return;
    }

    setLoading(true);
    setMessage("");

          try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token não encontrado");
        await reserveEvent(eventId, token);
        setMessage("Reserva realizada com sucesso!");
      } catch (err: any) {
      setMessage(err.message || "Erro ao fazer reserva");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleReserve}
        disabled={loading || !user || availableSpots <= 0}
        className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
          !user || availableSpots <= 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading
          ? "Processando..."
          : !user
          ? "Faça login para reservar"
          : availableSpots <= 0
          ? "Evento lotado"
          : `Reservar vaga (${availableSpots} disponíveis)`}
      </button>
      
      {message && (
        <div className={`text-center p-3 rounded ${
          message.includes("sucesso") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}
