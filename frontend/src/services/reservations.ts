const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Faz uma reserva para o evento especificado.
 */
export async function reserveEvent(eventId: string, token: string) {
  const res = await fetch(`${API_URL}/reservations/events/${eventId}/reserve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Erro ao reservar evento");
  }
  return res.json();
}
