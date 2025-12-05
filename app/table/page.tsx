'use client';

import { useEffect, useState } from 'react';
import { TableRow } from '@/types/Table';

export default function TablePage() {
  const [table, setTable] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTable() {
      try {
        const res = await fetch('/api/table');
        const data: TableRow[] = await res.json();
        setTable(data);
      } catch (error) {
        console.error('Error fetching table', error);
      } finally {
        setLoading(false);
      }
    }

    loadTable();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">League Table</h1>

      <div className="overflow-x-auto rounded-xl shadow-2xl bg-gray-900">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-800 sticky top-0 z-10">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Team</th>
              <th className="p-3 text-center">P</th>
              <th className="p-3 text-center">W</th>
              <th className="p-3 text-center">D</th>
              <th className="p-3 text-center">L</th>
              <th className="p-3 text-center">GF</th>
              <th className="p-3 text-center">GA</th>
              <th className="p-3 text-center">GD</th>
              <th className="p-3 text-center text-yellow-400 font-bold">
                Pts
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="p-6 text-center text-gray-400">
                  Loading table...
                </td>
              </tr>
            ) : (
              table.map((t, index) => {
                const isTopFour = index < 4;
                const isRelegation = index >= table.length - 3;

                return (
                  <tr
                    key={t.team}
                    className={`
                      ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}
                      ${isTopFour ? 'border-l-4 border-green-500' : ''}
                      ${isRelegation ? 'border-l-4 border-red-500' : ''}
                      hover:bg-gray-700 transition
                    `}
                  >
                    {/* POSITION */}
                    <td className="p-3 text-gray-400 font-semibold">
                      {index + 1}
                    </td>

                    {/* TEAM */}
                    <td className="p-3 font-semibold">{t.team}</td>

                    {/* STATS */}
                    <td className="p-3 text-center">{t.played}</td>
                    <td className="p-3 text-center">{t.wins}</td>
                    <td className="p-3 text-center">{t.draws}</td>
                    <td className="p-3 text-center">{t.losses}</td>
                    <td className="p-3 text-center">{t.goalsFor}</td>
                    <td className="p-3 text-center">{t.goalsAgainst}</td>

                    {/* GOAL DIFFERENCE */}
                    <td
                      className={`p-3 text-center font-semibold ${
                        t.goalDifference > 0
                          ? 'text-green-400'
                          : t.goalDifference < 0
                          ? 'text-red-400'
                          : 'text-gray-300'
                      }`}
                    >
                      {t.goalDifference > 0 && '+'}
                      {t.goalDifference}
                    </td>

                    {/* POINTS */}
                    <td className="p-3 text-center font-bold text-yellow-400">
                      {t.points}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* LEGEND */}
      <div className="mt-6 flex gap-6 text-sm justify-center">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 block"></span>
          Champions League
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 block"></span>
          Relegation
        </div>
      </div>
    </div>
  );
}
