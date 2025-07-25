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

export async function getMyReservations() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/reservations/my-reservations`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Erro ao buscar reservas");
  return res.json();
}

export async function getEventReservations(eventId: string) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/reservations/events/${eventId}/reservations`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Erro ao buscar reservas do evento");
  return res.json();
}
