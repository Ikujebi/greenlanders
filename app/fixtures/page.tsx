'use client';
import { useEffect, useState } from 'react';

interface Fixture {
  _id?: string;
  round: number;
  home: string;
  away: string;
  date?: string;
}

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);

  const newFixtures: Fixture[] = [
    { round: 1, home: 'A', away: 'B' },
    { round: 1, home: 'C', away: 'D' },
    { round: 2, home: 'A', away: 'C' },
    { round: 2, home: 'B', away: 'D' },
    { round: 3, home: 'A', away: 'D' },
    { round: 3, home: 'B', away: 'C' },
  ];

  const addFixtures = async () => {
    try {
      const res = await fetch('/api/fixtures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFixtures),
      });

      const data = await res.json();
      console.log('POST /api/fixtures response:', data);

      if (!res.ok) throw new Error(data.error || 'Failed to add fixtures');

      fetchFixtures(); // Refresh list after adding
    } catch (err) {
      console.error('Error adding fixtures', err);
    }
  };

  const fetchFixtures = async () => {
    try {
      const res = await fetch('/api/fixtures');
      const data = await res.json();
      setFixtures(data);
    } catch (err) {
      console.error('Error fetching fixtures', err);
    }
  };

  const deleteFixture = async (id: string) => {
    try {
      await fetch(`/api/fixtures?id=${id}`, { method: 'DELETE' });
      setFixtures((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error('Error deleting fixture', err);
    }
  };

  useEffect(() => {
    fetchFixtures();
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Football Fixtures</h1>

      <div className="text-center mb-6">
        <button
        hidden
          onClick={addFixtures}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
        >
          Add Fixtures
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {fixtures.map((f) => (
          <div
            key={f._id}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Round {f.round}
              </h2>
              <p className="text-gray-600 text-lg">
                {f.home} <span className="font-bold">vs</span> {f.away}
              </p>
              <p className="text-gray-500 mt-2 text-sm">
                Date: {f.date ? new Date(f.date).toLocaleString() : 'TBD'}
              </p>
            </div>

            <button
              onClick={() => f._id && deleteFixture(f._id)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
