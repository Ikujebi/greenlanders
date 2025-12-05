'use client';

import { useEffect, useState } from 'react';
import { Result } from '@/types/result';

// ✅ Team type from your backend
type Team = {
  id: string;
  name: string;
  logo?: string;
};

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [homeGoals, setHomeGoals] = useState<number>(0);
  const [awayGoals, setAwayGoals] = useState<number>(0);

  // ✅ FETCH TEAMS
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch('/api/teams');
        const data: Team[] = await res.json();
        setTeams(data);
      } catch (err) {
        console.error('Error fetching teams', err);
      }
    };

    fetchTeams();
  }, []);

  // ✅ FETCH RESULTS
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch('/api/results');
        const data: Result[] = await res.json();
        setResults(data);
      } catch (err) {
        console.error('Error fetching results', err);
      }
    };

    fetchResults();
  }, []);

  // ✅ ADD RESULT
  const addResult = async (e: React.FormEvent) => {
    e.preventDefault();

    if (homeTeam === awayTeam) {
      alert('Home and Away teams cannot be the same');
      return;
    }

    const newResult = {
      homeTeam,
      awayTeam,
      homeGoals,
      awayGoals,
      date: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResult),
      });

      if (!res.ok) throw new Error('Failed to add result');

      const createdResult: Result = await res.json();
      setResults((prev) => [...prev, createdResult]);

      // ✅ RESET FORM
      setHomeTeam('');
      setAwayTeam('');
      setHomeGoals(0);
      setAwayGoals(0);
    } catch (err) {
      console.error('Error adding result', err);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Match Results</h1>

      {/* ✅ ADD RESULT FORM */}
      <form
        onSubmit={addResult}
        className="mb-8 p-6 bg-white rounded shadow space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:gap-4">
          {/* ✅ HOME TEAM SELECT */}
          <select
            value={homeTeam}
            onChange={(e) => setHomeTeam(e.target.value)}
            className="flex-1 p-2 border rounded"
            required
          >
            <option value="">Select Home Team</option>
            {teams.map((team) => (
              <option
                key={team.id}
                value={team.name}
                disabled={team.name === awayTeam}
              >
                {team.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Home Goals"
            value={homeGoals}
            onChange={(e) => setHomeGoals(Number(e.target.value))}
            className="w-24 p-2 border rounded"
            min={0}
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:gap-4">
          {/* ✅ AWAY TEAM SELECT */}
          <select
            value={awayTeam}
            onChange={(e) => setAwayTeam(e.target.value)}
            className="flex-1 p-2 border rounded"
            required
          >
            <option value="">Select Away Team</option>
            {teams.map((team) => (
              <option
                key={team.id}
                value={team.name}
                disabled={team.name === homeTeam}
              >
                {team.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Away Goals"
            value={awayGoals}
            onChange={(e) => setAwayGoals(Number(e.target.value))}
            className="w-24 p-2 border rounded"
            min={0}
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
        >
          Add Result
        </button>
      </form>

      {/* ✅ DISPLAY RESULTS */}
      <ul className="space-y-3">
        {results.map((r) => (
          <li
            key={r.id}
            className="p-4 bg-white rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-lg">
                {r.homeTeam} {r.homeGoals} - {r.awayGoals} {r.awayTeam}
              </p>
              <p className="text-sm text-gray-500">
                Played on: {new Date(r.date).toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
