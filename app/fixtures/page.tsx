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

  const fetchFixtures = async () => {
    const res = await fetch('/api/fixtures');
    const data = await res.json();
    setFixtures(data);
  };

  const generateFinals = async () => {
    await fetch('/api/fixtures', { method: 'PUT' });
    fetchFixtures();
  };

  const deleteFixture = async (id: string) => {
    await fetch(`/api/fixtures?id=${id}`, { method: 'DELETE' });
    setFixtures((prev) => prev.filter((f) => f._id !== id));
  };

  useEffect(() => {
    fetchFixtures();
  }, []);

  const getStageName = (fixture: Fixture, index: number) => {
  if (fixture.round === 4) {
    return index === 0 ? 'Final' : 'Third Place Match';
  }
  return `Round ${fixture.round}`;
};


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <p className="text-sm tracking-widest text-gray-400 uppercase mb-2">
            Championship Knockout Stage
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Official Match Fixtures
          </h1>
        </header>

        {/* Action Button */}
        <div className="flex justify-center mb-12">
          <button
          hidden
            onClick={generateFinals}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600
            text-white font-semibold rounded-full shadow-lg
            hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            Generate Final & Third Place Match
          </button>
        </div>

        {/* Fixtures */}
        <div className="grid gap-8 md:grid-cols-2">
          {fixtures.map((f, index) => (
            <div
              key={f._id}
              className="relative bg-white/5 backdrop-blur
              border border-white/10 rounded-2xl p-6 md:p-8
              shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Stage */}
              <div className="absolute -top-3 left-6 bg-black px-4 py-1 rounded-full
              text-xs uppercase tracking-wider text-gray-300 border border-white/10">
                {getStageName(f, index)}
              </div>

              {/* Teams */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex-1 text-center">
                  <p className="text-lg md:text-2xl font-bold text-white">
                    {f.home}
                  </p>
                </div>

                <div className="mx-4 flex flex-col items-center">
                  <span className="text-gray-400 text-sm mb-1">VS</span>
                  <div className="w-10 h-px bg-gray-500" />
                </div>

                <div className="flex-1 text-center">
                  <p className="text-lg md:text-2xl font-bold text-white">
                    {f.away}
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className="text-center mt-6 text-sm text-gray-400">
                {f.date
                  ? new Date(f.date).toLocaleString()
                  : '19th Dec 2025'}
              </div>

              {/* Admin Action */}
              <div className="flex justify-center mt-6">
                <button
                hidden
                  onClick={() => f._id && deleteFixture(f._id)}
                  className="text-xs uppercase tracking-wide
                  px-4 py-2 rounded-full
                  bg-red-600/20 text-red-400
                  hover:bg-red-600 hover:text-white transition"
                >
                  Remove Fixture
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {fixtures.length === 0 && (
          <p className="text-center text-gray-400 mt-20">
            No fixtures available yet.
          </p>
        )}
      </div>
    </div>
  );
}
