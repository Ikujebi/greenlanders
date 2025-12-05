'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Team } from '@/types/Team';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/teams');

      if (!res.ok) {
        // Try to parse JSON error
        let errorMessage = `HTTP ${res.status} - ${res.statusText}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || JSON.stringify(errorData);
        } catch {
          const text = await res.text();
          if (text) errorMessage = text;
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      setTeams(data);
    } catch (err: any) {
      console.error('Error fetching teams:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/teams?id=${id}`, { method: 'DELETE' });

      if (!res.ok) {
        let errorMessage = `Failed to delete team`;
        try {
          const errData = await res.json();
          errorMessage = errData.error || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      setTeams((prev) => prev.filter((team) => team.id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Teams</h1>
          <Link
            href="/teams/new"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition"
          >
            Add New Team
          </Link>
        </div>

        {loading ? (
          <p>Loading teams...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : teams.length === 0 ? (
          <p className="text-gray-500">No teams found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition relative"
              >
                <h2 className="text-xl font-semibold mb-4">{team.name}</h2>

                <button
                  onClick={() => handleDelete(team.id, team.name)}
                  disabled={deletingId === team.id}
                  className={`absolute top-4 right-4 text-red-500 font-bold hover:text-red-700 transition ${
                    deletingId === team.id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {deletingId === team.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
