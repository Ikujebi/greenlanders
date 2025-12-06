"use client";

import { useEffect, useState } from "react";
import { Player } from "@/types/stats";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PlayerImageModal from "@/app/components/PlayerImageModal"; // updated modal

type TeamOption = {
  id: string;
  name: string;
};

// Sortable player item component
function SortablePlayerItem({
  player,
  showDetails,
  showUpdate,
  toggleDetails,
  toggleUpdate,
  updateStat,
  onImageClick,
}: {
  player: Player;
  showDetails: string | null;
  showUpdate: string | null;
  toggleDetails: (id: string) => void;
  toggleUpdate: (id: string) => void;
  updateStat: (id: string, stat: string) => void;
  onImageClick: (player: Player) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: player.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex flex-col sm:flex-row items-center gap-3 p-3 sm:p-4 hover:bg-gray-50 transition relative bg-white rounded-xl shadow-sm"
    >
      {/* Picture */}
      <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
        <img
          src={player.picture || "/images/player-placeholder.png"}
          alt={player.name}
          className="w-full h-full object-cover rounded-full border border-gray-300 cursor-pointer"
          onClick={() => onImageClick(player)}
        />
      </div>

      {/* Player Info */}
      <div className="flex-1 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 sm:gap-4 w-full">
        <div>
          <p className="font-bold text-base sm:text-lg text-gray-800">{player.name}</p>
          <p className="text-gray-500 text-xs sm:text-sm">
            {player.teamId?.name || "Unknown Team"}
          </p>
        </div>

        <div className="flex gap-1 sm:gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => toggleDetails(player.id)}
            className="px-2 py-1 sm:px-3 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm"
          >
            {showDetails === player.id ? "Hide Stats" : "View Stats"}
          </button>
          <button
            onClick={() => toggleUpdate(player.id)}
            className="px-2 py-1 sm:px-3 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs sm:text-sm"
          >
            {showUpdate === player.id ? "Close Update" : "Update Stats"}
          </button>
        </div>
      </div>

      {/* Stats Panel */}
      {showDetails === player.id && (
        <div className="mt-2 w-full p-2 sm:p-3 bg-gray-50 rounded-xl border border-gray-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-gray-700 text-xs sm:text-sm">
            <p>
              <strong>Goals:</strong> {player.goals}
            </p>
            <p>
              <strong>Assists:</strong> {player.assists}
            </p>
            <p>
              <strong>Yellow Cards:</strong> {player.yellowCards}
            </p>
            <p>
              <strong>Red Cards:</strong> {player.redCards}
            </p>
          </div>
        </div>
      )}

      {/* Update Panel */}
      {showUpdate === player.id && (
        <div className="mt-2 w-full p-2 sm:p-3 bg-white border border-gray-300 rounded-xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2">
            <button
              onClick={() => updateStat(player.id, "goals")}
              className="px-1 sm:px-2 py-1 sm:py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs sm:text-sm"
            >
              + Goal
            </button>
            <button
              onClick={() => updateStat(player.id, "assists")}
              className="px-1 sm:px-2 py-1 sm:py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm"
            >
              + Assist
            </button>
            <button
              onClick={() => updateStat(player.id, "yellow")}
              className="px-1 sm:px-2 py-1 sm:py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-xs sm:text-sm"
            >
              + Yellow
            </button>
            <button
              onClick={() => updateStat(player.id, "red")}
              className="px-1 sm:px-2 py-1 sm:py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs sm:text-sm"
            >
              + Red
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlayerStatsPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<TeamOption[]>([]);
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerTeam, setNewPlayerTeam] = useState("");
  const [newPlayerPicture, setNewPlayerPicture] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [showUpdate, setShowUpdate] = useState<string | null>(null);

  // Modal state
  const [modalPlayer, setModalPlayer] = useState<Player | null>(null);
  const [showModal, setShowModal] = useState(false);

  const toggleDetails = (id: string) =>
    setShowDetails(prev => (prev === id ? null : id));
  const toggleUpdate = (id: string) =>
    setShowUpdate(prev => (prev === id ? null : id));

  const sensors = useSensors(useSensor(PointerSensor));

  const handleModal = (player: Player) => {
    setModalPlayer(player);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleUpdatePicture = async (playerId: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/player-picture/${playerId}`, {
        method: "PATCH",
        body: formData,
      });

      const updatedPlayer = await res.json();
      if (!res.ok) throw new Error(updatedPlayer.error || "Failed to update");

      setPlayers(prev =>
        prev.map(p => (p.id === playerId ? { ...p, picture: updatedPlayer.picture } : p))
      );
      setMessage(`Player picture updated successfully!`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error updating picture:", err);
      setMessage("Failed to update player picture.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Load Teams
  async function loadTeams() {
    try {
      const res = await fetch("/api/teams");
      const data = await res.json();
      setTeams(data.map((t: any) => ({ id: t._id || t.id, name: t.name })));
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
        teamId: { id: p.teamId?._id || p.teamId, name: p.teamId?.name || "Unknown Team" },
        picture: p.picture || "/images/player-placeholder.png",
      }));
      setPlayers(data);
    } catch (err) {
      console.error("Failed to load players:", err);
    }
  }

  useEffect(() => {
    async function init() {
      await loadTeams();
      await loadPlayers();
    }
    init();
  }, []);

  // Update Player Stat
  async function updateStat(id: string, stat: string) {
    try {
      const res = await fetch(`/api/playerstats/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stat }),
      });
      const updated = await res.json();
      if (!res.ok) return console.error("Failed to update:", updated);
      setPlayers(prev => prev.map(p => (p.id === id ? updated : p)));
    } catch (err) {
      console.error("Error updating stat:", err);
    }
  }

  // Add Player
  async function addPlayer(e: React.FormEvent) {
    e.preventDefault();
    if (!newPlayerName || !newPlayerTeam) return;

    try {
      const formData = new FormData();
      formData.append("name", newPlayerName);
      formData.append("teamId", newPlayerTeam);
      if (newPlayerPicture) formData.append("picture", newPlayerPicture);

      const res = await fetch("/api/players", {
        method: "POST",
        body: formData,
      });

      const created = await res.json();
      if (!res.ok) {
        setMessage(`Failed to add: ${created.error}`);
        setTimeout(() => setMessage(""), 3000);
        return;
      }

      const teamObj = teams.find(t => t.id === created.teamId);
      setPlayers(prev => [
        ...prev,
        {
          id: created._id,
          name: created.name,
          goals: created.goals || 0,
          assists: created.assists || 0,
          yellowCards: created.yellowCards || 0,
          redCards: created.redCards || 0,
          teamId: teamObj || { id: created.teamId, name: "Unknown Team" },
          picture: created.picture || "/images/player-placeholder.png",
        },
      ]);

      setNewPlayerName("");
      setNewPlayerTeam("");
      setNewPlayerPicture(null);
      setMessage(`Player "${created.name}" added successfully!`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error adding player:", err);
      setMessage("Network/server error.");
      setTimeout(() => setMessage(""), 3000);
    }
  }

  const filtered = players.filter(p => {
    const matchName = p.name.toLowerCase().includes(search.toLowerCase());
    const matchTeam = teamFilter ? p.teamId.id === teamFilter : true;
    return matchName && matchTeam;
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setPlayers(prev => {
        const oldIndex = prev.findIndex(p => p.id === active.id);
        const newIndex = prev.findIndex(p => p.id === over?.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-900 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-white text-center">
        Player Stats Dashboard
      </h1>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-center">
        <input
          type="text"
          placeholder="Search player..."
          className="border p-2 sm:p-3 rounded-xl flex-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          value={teamFilter}
          onChange={e => setTeamFilter(e.target.value)}
          className="border p-2 sm:p-3 rounded-xl w-full sm:w-60 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Teams</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      {message && (
        <div className="mb-4 p-2 sm:p-3 bg-green-100 text-green-800 rounded-xl text-center font-medium">
          {message}
        </div>
      )}

      {/* Add Player Form */}
      <form
        onSubmit={addPlayer}
        className="mb-6 p-4 sm:p-6 bg-white rounded-3xl shadow-md max-w-3xl mx-auto"
      >
        <h2 className="font-semibold text-xl sm:text-2xl mb-3 text-gray-800">
          Add New Player
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
          <input
            type="text"
            placeholder="Player Name"
            className="border p-2 sm:p-3 rounded-xl flex-1 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={newPlayerName}
            onChange={e => setNewPlayerName(e.target.value)}
            required
          />
          <select
            value={newPlayerTeam}
            onChange={e => setNewPlayerTeam(e.target.value)}
            className="border p-2 sm:p-3 rounded-xl w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Select Team</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={e => setNewPlayerPicture(e.target.files?.[0] || null)}
            className="border p-2 sm:p-3 rounded-xl w-full sm:w-32"
          />
          <button
            type="submit"
            disabled={!newPlayerName || !newPlayerTeam}
            className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </form>

      {/* Player List with Drag-and-Drop */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filtered.map(p => p.id)} strategy={verticalListSortingStrategy}>
          <div className="bg-white rounded-3xl shadow-md divide-y divide-gray-200 max-w-4xl mx-auto overflow-hidden">
            {filtered.map(player => (
              <SortablePlayerItem
                key={player.id}
                player={player}
                showDetails={showDetails}
                showUpdate={showUpdate}
                toggleDetails={toggleDetails}
                toggleUpdate={toggleUpdate}
                updateStat={updateStat}
                onImageClick={handleModal} // Pass handler
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Modal */}
      <PlayerImageModal
        player={modalPlayer}
        show={showModal}
        onClose={handleCloseModal}
        onZoom={(player) => alert(`Zooming ${player.name}`)}
        onUpdatePicture={handleUpdatePicture} // updated prop
      />
    </div>
  );
}
