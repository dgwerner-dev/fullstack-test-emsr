const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Faz uma reserva para o evento especificado.
 */
export async function reserveEvent(eventId: string, token: string) {
  const res = await fetch(`${API_URL}/reservations/events/${eventId}/reserve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Erro ao reservar evento');
  }
  return res.json();
}

export async function getMyReservations() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/reservations/my-reservations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    let msg = 'Erro ao buscar reservas';
    if (res.status === 403)
      msg =
        'Acesso negado: apenas usuários comuns podem acessar suas próprias reservas.';
    throw new Error(msg);
  }
  return res.json();
}

export async function getEventReservations(eventId: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(
    `${API_URL}/reservations/events/${eventId}/reservations`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error('Erro ao buscar reservas do evento');
  return res.json();
}

export async function cancelReservation(reservationId: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/reservations/${reservationId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    let errorMessage = 'Erro ao cancelar reserva';
    try {
      const data = await res.json();
      errorMessage = data.error || errorMessage;
    } catch {
      // Se não conseguir fazer parse do JSON, usar status code
      if (res.status === 404) {
        errorMessage = 'Reserva não encontrada';
      } else if (res.status === 403) {
        errorMessage = 'Acesso negado';
      } else if (res.status === 401) {
        errorMessage = 'Token inválido ou expirado';
      }
    }
    throw new Error(errorMessage);
  }

  // Para resposta 204 (No Content), não tentar fazer .json()
  if (res.status === 204) {
    return null;
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}
