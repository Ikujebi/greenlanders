"use client";

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
import { Player } from "@/types/stats";
import PlayerImageModal from "@/app/components/PlayerImageModal";

export default function PlayerList({
  players,
  showDetails,
  showUpdate,
  toggleDetails,
  toggleUpdate,
  updateStat,
  onReorder,
  onImageClick,
  modalPlayer,
  showModal,
  closeModal,
  updatePicture,
}: {
  players: Player[];
  showDetails: string | null;
  showUpdate: string | null;
  toggleDetails: (id: string) => void;
  toggleUpdate: (id: string) => void;
  updateStat: (id: string, stat: string) => void;
  onReorder: (newPlayers: Player[]) => void;
  onImageClick: (player: Player) => void;

  modalPlayer: Player | null;
  showModal: boolean;
  closeModal: () => void;
  updatePicture: (id: string, file: File) => Promise<void>;

}) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = players.findIndex((p) => p.id === active.id);
    const newIndex = players.findIndex((p) => p.id === over.id);

    const reordered = arrayMove(players, oldIndex, newIndex);
    onReorder(reordered);
  };

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={players.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <div className="bg-white rounded-3xl shadow-md divide-y divide-gray-200 max-w-4xl mx-auto overflow-hidden">
            {players.map((player) => (
              <SortablePlayerItem
                key={player.id}
                player={player}
                showDetails={showDetails}
                showUpdate={showUpdate}
                toggleDetails={toggleDetails}
                toggleUpdate={toggleUpdate}
                updateStat={updateStat}
                onImageClick={onImageClick}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <PlayerImageModal
        player={modalPlayer}
        show={showModal}
        onClose={closeModal}
        onZoom={() => {}}
        onUpdatePicture={updatePicture}
      />
    </>
  );
}

/* Sortable Player Item moved here */
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
      className="flex flex-col sm:flex-row items-center gap-3 p-3 sm:p-4 hover:bg-gray-50 transition bg-white"
    >
      <div className="w-12 h-12 sm:w-16 sm:h-16">
        <img
          src={player.picture || "/images/player-placeholder.png"}
          alt={player.name}
          className="w-full h-full object-cover rounded-full border border-gray-300 cursor-pointer"
          onClick={() => onImageClick(player)}
        />
      </div>

      <div className="flex-1 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 sm:gap-4">
        <div>
          <p className="font-bold text-base sm:text-lg text-gray-800">{player.name}</p>
          <p className="text-gray-500 text-xs sm:text-sm">{player.teamId?.name}</p>
        </div>

        <div className="flex gap-1 sm:gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => toggleDetails(player.id)}
            className="px-2 py-1 sm:px-3 sm:py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm"
          >
            {showDetails === player.id ? "Hide Stats" : "View Stats"}
          </button>
          <button
            onClick={() => toggleUpdate(player.id)}
            className="px-2 py-1 sm:px-3 sm:py-2 bg-green-600 text-white rounded-lg text-xs sm:text-sm"
          >
            {showUpdate === player.id ? "Close Update" : "Update Stats"}
          </button>
        </div>
      </div>

      {showDetails === player.id && (
        <div className="mt-2 w-full p-3 bg-gray-50 rounded-xl border">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-gray-700 text-xs sm:text-sm">
            <p><strong>Goals:</strong> {player.goals}</p>
            <p><strong>Assists:</strong> {player.assists}</p>
            <p><strong>Yellow Cards:</strong> {player.yellowCards}</p>
            <p><strong>Red Cards:</strong> {player.redCards}</p>
          </div>
        </div>
      )}

      {showUpdate === player.id && (
        <div className="mt-2 w-full p-3 border rounded-xl bg-white">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => updateStat(player.id, "goals")}
              className="px-2 py-1 bg-green-600 text-white rounded-lg text-xs"
            >
              + Goal
            </button>
            <button
              onClick={() => updateStat(player.id, "assists")}
              className="px-2 py-1 bg-blue-600 text-white rounded-lg text-xs"
            >
              + Assist
            </button>
            <button
              onClick={() => updateStat(player.id, "yellow")}
              className="px-2 py-1 bg-yellow-500 text-white rounded-lg text-xs"
            >
              + Yellow
            </button>
            <button
              onClick={() => updateStat(player.id, "red")}
              className="px-2 py-1 bg-red-600 text-white rounded-lg text-xs"
            >
              + Red
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
