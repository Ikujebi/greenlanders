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
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Teams
          </h1>
          <Link
            href="/teams/new"
            hidden
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition"
          >
            Add New Team
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500 text-lg">Loading teams...</p>
        ) : error ? (
          <p className="text-red-500 text-lg">Error: {error}</p>
        ) : teams.length === 0 ? (
          <p className="text-gray-500 text-lg">No teams found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden relative"
              >
                {team.logo && (
                  <div className="h-40 w-full overflow-hidden">
                    <img
                      src={team.logo}
                      alt={`${team.name} logo`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-2">{team.name}</h2>
                  <button
                    onClick={() => handleDelete(team.id, team.name)}
                    disabled={deletingId === team.id}
                    className={`mt-4 w-full py-2 text-white font-semibold rounded-lg transition ${
                      deletingId === team.id
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    {deletingId === team.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
