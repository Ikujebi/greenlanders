"use client";

import { useRef, useState } from "react";
import { Player } from "@/types/stats";

type Props = {
  player: Player | null;
  show: boolean;
  onClose: () => void;
  onZoom: (player: Player) => void;
  onUpdatePicture: (playerId: string, file: File) => Promise<void>;
};

export default function PlayerImageModal({
  player,
  show,
  onClose,
  onZoom,
  onUpdatePicture,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  if (!show || !player) return null;

  const handleChangeClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await onUpdatePicture(player.id, file);
    setUploading(false);
    onClose(); // close modal after update
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl p-6 w-80 sm:w-96 shadow-lg relative">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
          {player.name}
        </h3>
        <img
          src={player.picture || "/images/player-placeholder.png"}
          alt={player.name}
          className="w-full h-48 sm:h-64 object-cover rounded-xl mb-4"
        />
        <div className="flex justify-between gap-4">
          <button
            onClick={() => onZoom(player)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Zoom
          </button>
          <button
            onClick={handleChangeClick}
            className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Change"}
          </button>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
