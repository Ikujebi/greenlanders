"use client";

import { useState, useRef } from "react";
import { Player } from "@/types/stats";

type TeamOption = {
  id: string;
  name: string;
};

export default function AddPlayerForm({
  teams,
  onPlayerAdded,
}: {
  teams: TeamOption[];
  onPlayerAdded: (player: Player) => void;
}) {
  const [name, setName] = useState("");
  const [teamId, setTeamId] = useState("");
  const [picture, setPicture] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  // Add ref for the file input so we can clear it
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleAddPlayer() {
    if (!name || !teamId) {
      setMessage("Please enter a name and select a team");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("teamId", teamId);
      if (picture) formData.append("picture", picture);

      const res = await fetch("/api/players", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add player");

      const newPlayer = {
        id: data._id,
        name: data.name,
        goals: data.goals || 0,
        assists: data.assists || 0,
        yellowCards: data.yellowCards || 0,
        redCards: data.redCards || 0,
        picture: data.picture || "/images/player-placeholder.png",
        teamId: {
          id: data.teamId,
          name: teams.find((t) => t.id === data.teamId)?.name || "Unknown Team",
        },
      };

      onPlayerAdded(newPlayer);

      // Clear all fields after success
      setName("");
      setTeamId("");
      setPicture(null);

      // Reset file input manually
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setMessage("Player added successfully");
      setTimeout(() => setMessage(""), 3000);

    } catch (err) {
      console.error(err);
      setMessage("Failed to add player");
      setTimeout(() => setMessage(""), 3000);
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-5 sm:p-7 rounded-3xl shadow-md mb-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
        Add Player
      </h2>

      {message && (
        <div className="mb-3 p-3 bg-green-100 text-green-800 rounded-xl text-center font-medium">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <input
          type="text"
          placeholder="Player Name"
          className="border p-3 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="border p-3 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
        >
          <option value="">Select Team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="border p-3 rounded-xl text-gray-700"
          onChange={(e) => setPicture(e.target.files?.[0] || null)}
        />
      </div>

      <button
        onClick={handleAddPlayer}
        className="mt-5 w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
      >
        Add Player
      </button>
    </div>
  );
}
