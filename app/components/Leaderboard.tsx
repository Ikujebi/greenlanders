"use client";
import Image from "next/image";
import { Player } from "@/types/stats";

interface Props {
  expandedPlayerId: string | null;
  toggleExpand: (id: string) => void;
  updateStat: (id: string, field: string) => void;
  openImageModal: (player: Player) => void;
  setExpandedPlayerId: (id: string | null) => void;

  topByGoals: Player[];
  topByAssists: Player[];
  topByYellow: Player[];
  topByRed: Player[];

  primaryStat: "goals" | "assists" | "yellow" | "red";
}

export default function LeaderboardColumns({
  expandedPlayerId,
  toggleExpand,
  updateStat,
  openImageModal,
  setExpandedPlayerId,
  topByGoals,
  topByAssists,
  topByYellow,
  topByRed,
  primaryStat
}: Props) {

  const renderColumn = (
    title: string,
    subtitle: string,
    list: Player[],
    statKey: "goals" | "assists" | "yellowCards" | "redCards"
  ) => (
    <section className="min-w-full">
      <h2 className="text-2xl font-extrabold text-white mb-4">
        {title}
        <span className="block text-sm text-gray-400">{subtitle}</span>
      </h2>

      {/* Loading state */}
      {list.length === 0 ? (
        <div className="text-center text-gray-400 py-8">Loading players...</div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-700">
          {list.map((player, index) => (
            <div key={player.id}>
              {/* Player Row */}
              <div
                className="py-3 flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpand(player.id)}
              >
                {/* LEFT SIDE */}
                <div className="flex items-center gap-4">
                  <div className="text-xl font-bold text-gray-300 w-8 text-center">{index + 1}.</div>

                  <Image
                    width={1000}
                    height={1000}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent expand toggle
                      openImageModal(player);
                    }}
                    src={player.picture || "/images/player-placeholder.png"}
                    alt={player.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-600 cursor-pointer"
                  />

                  <div>
                    <p className="font-semibold text-white">{player.name}</p>
                    <p className="text-sm text-gray-400">{player.teamId.name}</p>
                  </div>
                </div>

                {/* RIGHT SIDE: STAT */}
                <div className="text-xl font-bold text-white">
                  {statKey === "goals" && player.goals}
                  {statKey === "assists" && player.assists}
                  {statKey === "yellowCards" && player.yellowCards}
                  {statKey === "redCards" && player.redCards}
                </div>
              </div>

              {/* Expanded Card */}
              {expandedPlayerId === player.id && (
                <div className="p-4 bg-gray-800 rounded-xl mt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Player Info */}
                    <div className="flex items-center gap-4">
                      <Image
                        width={1000}
                        height={1000}
                        onClick={() => openImageModal(player)}
                        src={player.picture || "/images/player-placeholder.png"}
                        alt={player.name}
                        className="w-24 h-24 rounded-lg object-cover border border-gray-700 cursor-pointer"
                      />
                      <div>
                        <p className="font-bold text-white text-xl">{player.name}</p>
                        <p className="text-sm text-gray-400">{player.teamId.name}</p>
                        <div className="grid grid-cols-2 gap-3 mt-3 text-gray-300 text-sm">
                          <div>Goals: {player.goals}</div>
                          <div>Assists: {player.assists}</div>
                          <div>Yellow Cards: {player.yellowCards}</div>
                          <div>Red Cards: {player.redCards}</div>
                        </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col gap-2 sm:items-end">
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStat(player.id, "goals")}
                          className="px-3 py-2 bg-green-600 text-white rounded-md text-sm"
                        >
                          + Goal
                        </button>
                        <button
                          onClick={() => updateStat(player.id, "assists")}
                          className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm"
                        >
                          + Assist
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStat(player.id, "yellow")}
                          className="px-3 py-2 bg-yellow-500 text-white rounded-md text-sm"
                        >
                          + Yellow
                        </button>
                        <button
                          onClick={() => updateStat(player.id, "red")}
                          className="px-3 py-2 bg-red-600 text-white rounded-md text-sm"
                        >
                          + Red
                        </button>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => openImageModal(player)}
                          className="px-3 py-2 border border-gray-400 text-gray-200 rounded-md text-sm"
                        >
                          Update Picture
                        </button>
                        <button
                          onClick={() => setExpandedPlayerId(null)}
                          className="px-3 py-2 border border-gray-400 text-gray-200 rounded-md text-sm"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="max-w-5xl mx-auto">
      {primaryStat === "goals" &&
        renderColumn("Goals", "Top scorers", topByGoals, "goals")}

      {primaryStat === "assists" &&
        renderColumn("Assists", "Top creators", topByAssists, "assists")}

      {primaryStat === "yellow" &&
        renderColumn("Yellow Cards", "Most bookings", topByYellow, "yellowCards")}

      {primaryStat === "red" &&
        renderColumn("Red Cards", "Most send offs", topByRed, "redCards")}
    </div>
  );
}
