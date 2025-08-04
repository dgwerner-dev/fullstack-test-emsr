const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getProfile() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Erro ao buscar perfil');
  return res.json();
}

export async function updateProfile(data: any) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/users/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao atualizar perfil');
  return res.json();
}

export async function deleteProfile() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/users/me`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Erro ao deletar perfil');
  return true;
}
