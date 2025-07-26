"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export default function NotificationBanner() {
  const [message, setMessage] = useState("");
  const { socket } = useAuth();
  
  useEffect(() => {
    if (!socket) return;
    
    function onSoldOut(data: any) {
      setMessage(`🎫 Evento "${data.eventName}" esgotado! Não há mais vagas disponíveis.`);
      setTimeout(() => setMessage(""), 5000);
    }
    function onConfirmed(data: any) {
      setMessage(`✅ Reserva confirmada para "${data.eventName}"!`);
      setTimeout(() => setMessage(""), 5000);
    }
    function onCancelled(data: any) {
      setMessage(`❌ Reserva cancelada para "${data.eventName}"!`);
      setTimeout(() => setMessage(""), 5000);
    }
    
    socket.on("event_sold_out", onSoldOut);
    socket.on("reservation_confirmed", onConfirmed);
    socket.on("reservation_cancelled", onCancelled);
    
    return () => {
      socket.off("event_sold_out", onSoldOut);
      socket.off("reservation_confirmed", onConfirmed);
      socket.off("reservation_cancelled", onCancelled);
    };
  }, [socket]);
  if (!message) return null;
  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-xl z-[99999] max-w-md text-center animate-in slide-in-from-top-2 duration-300 flex items-center space-x-3">
      <span>{message}</span>
      <button 
        onClick={() => setMessage("")}
        className="ml-2 text-white hover:text-gray-200 transition-colors"
      >
        ✕
      </button>
    </div>
  );
} 