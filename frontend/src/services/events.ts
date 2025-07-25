const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Busca todos os eventos na API do backend.
 */
export async function getEvents() {
  const res = await fetch(`${API_URL}/events`);
  if (!res.ok) throw new Error("Erro ao buscar eventos");
  return res.json();
}

/**
 * Busca detalhes de um evento pelo ID.
 */
export async function getEventById(id: string) {
  const res = await fetch(`${API_URL}/events/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar evento");
  return res.json();
}
