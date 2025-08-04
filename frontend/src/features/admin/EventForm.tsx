'use client';
import { createEvent, getEventById, updateEvent } from '@/services/events';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EventForm({
  mode,
  eventId,
}: {
  mode: 'create' | 'edit';
  eventId?: string;
}) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    eventDate: '',
    location: '',
    onlineLink: '',
    maxCapacity: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (mode === 'edit' && eventId) {
      getEventById(eventId)
        .then(e =>
          setForm({ ...e, eventDate: e.eventDate?.slice(0, 16) || '' })
        )
        .catch(() => setError('Erro ao carregar evento'));
    }
  }, [mode, eventId]);

  const handleChange = (e: any) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'create') await createEvent(form);
      else if (mode === 'edit' && eventId) await updateEvent(eventId, form);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto mt-8 bg-white p-6 rounded shadow space-y-4"
    >
      <h2 className="text-2xl font-bold mb-4">
        {mode === 'create' ? 'Criar Evento' : 'Editar Evento'}
      </h2>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Nome"
        required
        className="border px-2 py-1 rounded w-full"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Descrição"
        className="border px-2 py-1 rounded w-full"
      />
      <input
        name="eventDate"
        value={form.eventDate}
        onChange={handleChange}
        type="datetime-local"
        required
        className="border px-2 py-1 rounded w-full"
      />
      <input
        name="location"
        value={form.location}
        onChange={handleChange}
        placeholder="Local (opcional)"
        className="border px-2 py-1 rounded w-full"
      />
      <input
        name="onlineLink"
        value={form.onlineLink}
        onChange={handleChange}
        placeholder="Link online (opcional)"
        className="border px-2 py-1 rounded w-full"
      />
      <input
        name="maxCapacity"
        value={form.maxCapacity}
        onChange={handleChange}
        type="number"
        min={1}
        required
        className="border px-2 py-1 rounded w-full"
      />
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
}
