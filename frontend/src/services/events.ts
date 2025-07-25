const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Busca todos os eventos na API do backend.
 */
export async function getEvents(params?: { name?: string; date?: string }) {
  let url = `${API_URL}/events`;
  if (params) {
    const query = new URLSearchParams();
    if (params.name) query.append("name", params.name);
    if (params.date) query.append("date", params.date);
    if ([...query].length) url += `?${query.toString()}`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro ao buscar eventos");
  return res.json();
}

export async function createEvent(data: any) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Erro ao criar evento");
  return res.json();
}

export async function updateEvent(id: string, data: any) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Erro ao atualizar evento");
  return res.json();
}

/**
 * Busca detalhes de um evento pelo ID.
 */
export async function getEventById(id: string) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/events/${id}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Erro ao buscar evento");
  return res.json();
}
