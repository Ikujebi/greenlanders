'use client';

import { useEffect, useState } from 'react';
import { Player } from '@/types/stats';

export default function PlayerStatsPage() {
const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    async function loadPlayers() {
      try {
        const res = await fetch('/api/playerstats');
        const data = await res.json();
        setPlayers(data);
      } catch (error) {
        console.error('Error fetching player stats', error);
      }
    }
    loadPlayers();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold mb-4">Player Stats</h1>
      <ul className="space-y-3">
  {players.map((p) => (
    <li key={p.id} className="p-4 border rounded">
      <p className="font-semibold">{p.name} – {p.team}</p>
      <p>Goals: {p.goals}</p>
      <p>Assists: {p.assists}</p>
    </li>
  ))}
</ul>
    </div>
  );
}
