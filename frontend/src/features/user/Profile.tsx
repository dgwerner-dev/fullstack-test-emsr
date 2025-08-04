'use client';
import { deleteProfile, getProfile, updateProfile } from '@/services/user';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    getProfile()
      .then(data => {
        setProfile(data);
        setForm({ name: data.name, email: data.email, password: '' });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: any) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await updateProfile(form);
      setSuccess('Perfil atualizado com sucesso!');
      setProfile({ ...profile, name: form.name, email: form.email });
      setForm(f => ({ ...f, password: '' }));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        'Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.'
      )
    )
      return;
    try {
      await deleteProfile();
      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div>Carregando perfil...</div>;
  if (error)
    return <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>;

  return (
    <div className="max-w-lg mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Meu Perfil</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nova senha</label>
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        {success && (
          <div className="bg-green-100 text-green-700 p-2 rounded">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Salvar
        </button>
      </form>
      <button
        onClick={handleDelete}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded w-full"
      >
        Deletar minha conta
      </button>
    </div>
  );
}
