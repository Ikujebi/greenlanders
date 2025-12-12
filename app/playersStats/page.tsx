"use client";

import { useEffect, useState } from "react";
import { Player } from "@/types/stats";
import AddPlayerForm from "@/app/components/AddPlayerForm";
import PlayerImageModal from "@/app/components/PlayerImageModal";
import LeaderboardColumns from "../components/Leaderboard";

type TeamOption = {
  id: string;
  name: string;
};

export default function PlayerStatsBoardPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<TeamOption[]>([]);
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [message, setMessage] = useState("");

  const [primaryStat, setPrimaryStat] =
    useState<"goals" | "assists" | "yellow" | "red">("goals");
  const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(null);

  const [modalPlayer, setModalPlayer] = useState<Player | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Load Teams
  async function loadTeams() {
    try {
      const res = await fetch("/api/teams");
      const data = await res.json();

      setTeams(
        data.map((t: any) => ({
          id: t._id || t.id,
          name: t.name
        }))
      );
    } catch (err) {
      console.error("Failed to load teams:", err);
    }
  }

  // Load Players
  async function loadPlayers() {
    try {
      const res = await fetch("/api/players");
      let data = await res.json();

      data = data.map((p: any) => ({
        id: p._id,
        name: p.name,
        goals: p.goals || 0,
        assists: p.assists || 0,
        yellowCards: p.yellowCards || 0,
        redCards: p.redCards || 0,
        teamId: {
          id: p.teamId?._id || p.teamId,
          name: p.teamId?.name || "Unknown Team"
        },
        picture: p.picture || "/images/player-placeholder.png"
      }));

      setPlayers(data);
    } catch (err) {
      console.error("Failed to load players:", err);
    }
  }

  useEffect(() => {
    loadTeams();
    loadPlayers();
  }, []);

  // Expand player card
  const toggleExpand = (id: string) => {
    setExpandedPlayerId(prev => (prev === id ? null : id));
  };

  // Open modal
  const openImageModal = (player: Player) => {
    setModalPlayer(player);
    setShowModal(true);
  };

  const closeImageModal = () => setShowModal(false);

  // Update player picture
  const handleUpdatePicture = async (playerId: string, file: File): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/player-picture/${playerId}`, {
        method: "PATCH",
        body: formData
      });

      const updatedPlayer = await res.json();
      if (!res.ok) throw new Error(updatedPlayer.error || "Failed to update");

      setPlayers(prev =>
        prev.map(p => (p.id === playerId ? { ...p, picture: updatedPlayer.picture } : p))
      );

      setMessage("Player picture updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error updating picture:", err);
      setMessage("Failed to update player picture.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Update stats
  async function updateStat(id: string, stat: string) {
    try {
      const res = await fetch(`/api/playerstats/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stat })
      });

      const updated = await res.json();

      if (!res.ok) {
        setMessage("Failed to update stat");
        setTimeout(() => setMessage(""), 3000);
        return;
      }

      setPlayers(prev => prev.map(p => (p.id === id ? updated : p)));
    } catch (err) {
      console.error("Error updating stat:", err);
      setMessage("Failed to update stat");
      setTimeout(() => setMessage(""), 3000);
    }
  }

  // Filtering
  const filtered = players.filter(p => {
    const matchName = p.name.toLowerCase().includes(search.toLowerCase());
    const matchTeam = teamFilter ? p.teamId.id === teamFilter : true;
    return matchName && matchTeam;
  });

  // Sorting
  const topByGoals = [...filtered].sort((a, b) => b.goals - a.goals);
  const topByAssists = [...filtered].sort((a, b) => b.assists - a.assists);
  const topByYellow = [...filtered].sort((a, b) => b.yellowCards - a.yellowCards);
  const topByRed = [...filtered].sort((a, b) => b.redCards - a.redCards);

  // Add player
  const handlePlayerAdded = (player: Player) => {
    setPlayers(prev => [...prev, player]);
    setMessage("Player added");
    setTimeout(() => setMessage(""), 2500);
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-900 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-white text-center">
        Player Stats Board
      </h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-center">
        <input
          type="text"
          placeholder="Search player..."
          className="bg-gray-300 p-2 sm:p-3 rounded-xl flex-1 text-gray-700"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          value={teamFilter}
          onChange={e => setTeamFilter(e.target.value)}
          className="bg-gray-300 p-2 sm:p-3 rounded-xl w-full sm:w-60 text-gray-700"
        >
          <option value="">All Teams</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      {/* Hidden Add Player Form */}
      <div className="hidden">
        <AddPlayerForm teams={teams} onPlayerAdded={handlePlayerAdded} />
      </div>

      {/* TABS */}
      <div className="mb-6">

        {/* MOBILE SELECT */}
        <div className="sm:hidden mb-6">
          <select
            value={primaryStat}
            onChange={(e) => setPrimaryStat(e.target.value as any)}
            className="w-full p-3 rounded-xl bg-gray-800 text-white"
          >
            <option value="goals">Goals</option>
            <option value="assists">Assists</option>
            <option value="yellow">Yellow Cards</option>
            <option value="red">Red Cards</option>
          </select>
        </div>

        {/* DESKTOP TABS */}
        <div className="hidden sm:flex items-center justify-center gap-3">
          <button
            className={`px-4 py-2 rounded-xl font-semibold ${
              primaryStat === "goals" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-800"
            }`}
            onClick={() => setPrimaryStat("goals")}
          >
            Goals
          </button>

          <button
            className={`px-4 py-2 rounded-xl font-semibold ${
              primaryStat === "assists" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-800"
            }`}
            onClick={() => setPrimaryStat("assists")}
          >
            Assists
          </button>

          <button
            className={`px-4 py-2 rounded-xl font-semibold ${
              primaryStat === "yellow" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-800"
            }`}
            onClick={() => setPrimaryStat("yellow")}
          >
            Yellow Cards
          </button>

          <button
            className={`px-4 py-2 rounded-xl font-semibold ${
              primaryStat === "red" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-800"
            }`}
            onClick={() => setPrimaryStat("red")}
          >
            Red Cards
          </button>
        </div>

      </div>

      {/* Message */}
      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-xl text-center">
          {message}
        </div>
      )}

      {/* Leaderboard */}
      <LeaderboardColumns
        expandedPlayerId={expandedPlayerId}
        toggleExpand={toggleExpand}
        updateStat={updateStat}
        openImageModal={openImageModal}
        setExpandedPlayerId={setExpandedPlayerId}
        topByGoals={topByGoals}
        topByAssists={topByAssists}
        topByYellow={topByYellow}
        topByRed={topByRed}
        primaryStat={primaryStat}
      />

      {/* Player Image Modal */}
      {modalPlayer && (
        <PlayerImageModal
          player={modalPlayer}
          show={showModal}
          onClose={closeImageModal}
          onUpdatePicture={handleUpdatePicture}
          onZoom={player => alert(`Zooming ${player.name}`)}
        />
      )}
    </div>
  );
}
