import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRace } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { TeamDot, getTeamColor } from "../components/TeamColor";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

function PosBadge({ pos, dnf }) {
  const base = "font-mono font-bold text-sm min-w-[36px] h-8 flex items-center justify-center rounded text-center";
  if (dnf) return <span className={`${base} bg-f1-red/10 text-f1-red border border-f1-red/20`}>DNF</span>;
  if (pos === 1) return <span className={`${base} bg-yellow-400 text-black`}>P1</span>;
  if (pos === 2) return <span className={`${base} bg-neutral-400 text-black`}>P2</span>;
  if (pos === 3) return <span className={`${base} bg-amber-600 text-white`}>P3</span>;
  return <span className={`${base} bg-bg-card text-neutral-500 border border-border`}>P{pos}</span>;
}

function formatLapTime(seconds) {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toFixed(3);
  return `${m}:${s.padStart(6, "0")}`;
}

function LapTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="font-display font-semibold text-white text-sm mb-1">{label}</p>
      <p className="font-mono text-f1-orange text-base font-bold">
        {formatLapTime(payload[0].value)}
      </p>
    </div>
  );
}

export default function RaceDetails() {
  const { raceId } = useParams();
  const navigate = useNavigate();
  const [race, setRace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getRace(raceId)
      .then(setRace)
      .catch(() => setError("Race not found."))
      .finally(() => setLoading(false));
  }, [raceId]);

  if (loading) return <LoadingSpinner message="Loading race data..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!race) return null;

  const winner = race.results.find((r) => r.position === 1 && !r.dnf);
  const fastestLap = race.results.find((r) => r.fastest_lap);

  // Chart: avg lap time per driver (top 10, excluding DNFs with no time)
  const lapData = race.results
    .filter((r) => r.avg_lap_time && !r.dnf)
    .sort((a, b) => a.avg_lap_time - b.avg_lap_time)
    .map((r) => ({
      name: r.short_name,
      time: r.avg_lap_time,
      team: r.team,
      fastest: r.fastest_lap,
    }));

  const minLap = lapData.length ? Math.min(...lapData.map((d) => d.time)) : 0;
  const domainMin = minLap ? minLap - 2 : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-sm font-body"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back to Dashboard
      </button>

      {/* Header card */}
      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs text-neutral-600 border border-border px-2 py-0.5 rounded">
                Round {race.round}
              </span>
              <span className="font-mono text-xs text-neutral-600">{race.date}</span>
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-white tracking-wide">
              {race.name.toUpperCase()}
            </h1>
            <p className="text-neutral-400 font-body mt-1">{race.circuit}</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <div className="text-right">
              <p className="text-xs text-neutral-600 uppercase tracking-wider font-body mb-1">Laps</p>
              <p className="font-mono font-bold text-white text-2xl">{race.laps}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-600 uppercase tracking-wider font-body mb-1">Season</p>
              <p className="font-mono font-bold text-white text-2xl">{race.season}</p>
            </div>
          </div>
        </div>

        {/* Quick highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider font-body mb-1">Winner</p>
            <div className="flex items-center gap-2">
              <TeamDot team={winner?.team ?? ""} />
              <span className="font-display font-semibold text-white">
                {winner?.driver_name ?? "—"}
              </span>
            </div>
            <p className="text-xs text-neutral-600 font-body mt-0.5">{winner?.team}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider font-body mb-1">Fastest Lap</p>
            <div className="flex items-center gap-2">
              <span className="text-purple-400">⚡</span>
              <span className="font-display font-semibold text-white">
                {fastestLap?.driver_name ?? "—"}
              </span>
            </div>
            <p className="text-xs text-neutral-600 font-mono mt-0.5">
              {fastestLap ? formatLapTime(fastestLap.avg_lap_time) : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider font-body mb-1">Country</p>
            <p className="font-display font-semibold text-white">{race.country}</p>
          </div>
        </div>
      </div>

      {/* Results & chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Results table */}
        <div className="card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-display font-semibold text-white text-xl tracking-wide">
              RACE RESULTS
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-neutral-500 font-body font-normal text-xs uppercase tracking-wider">Pos</th>
                  <th className="text-left px-3 py-3 text-neutral-500 font-body font-normal text-xs uppercase tracking-wider">Driver</th>
                  <th className="text-left px-3 py-3 text-neutral-500 font-body font-normal text-xs uppercase tracking-wider hidden sm:table-cell">Team</th>
                  <th className="text-right px-5 py-3 text-neutral-500 font-body font-normal text-xs uppercase tracking-wider">Pts</th>
                </tr>
              </thead>
              <tbody>
                {race.results.map((r) => (
                  <tr
                    key={r.driver_id}
                    className="border-b border-border/50 hover:bg-bg-hover transition-colors"
                  >
                    <td className="px-5 py-3">
                      <PosBadge pos={r.position} dnf={r.dnf} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <TeamDot team={r.team} size={8} />
                        <span className="font-body font-medium text-white">{r.driver_name}</span>
                        {r.fastest_lap && (
                          <span title="Fastest Lap" className="text-purple-400 text-xs">⚡</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell text-neutral-500 font-body text-xs">
                      {r.team}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className={`font-mono font-bold ${r.dnf ? "text-neutral-600" : "text-white"}`}>
                        {r.points}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lap time chart */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-white text-xl tracking-wide">
              AVG LAP TIMES
            </h2>
            <span className="text-xs font-mono text-neutral-600">seconds</span>
          </div>
          {lapData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={lapData}
                layout="vertical"
                margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
              >
                <XAxis
                  type="number"
                  domain={[domainMin, "auto"]}
                  tick={{ fill: "#9B9B9B", fontSize: 10, fontFamily: "Space Mono" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}s`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "#9B9B9B", fontSize: 11, fontFamily: "Space Mono" }}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                />
                <Tooltip content={<LapTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <ReferenceLine x={minLap} stroke="#E10600" strokeDasharray="4 2" strokeOpacity={0.5} />
                <Bar dataKey="time" radius={[0, 4, 4, 0]} maxBarSize={22}>
                  {lapData.map((entry, i) => (
                    <Cell
                      key={entry.name}
                      fill={entry.fastest ? "#a855f7" : getTeamColor(entry.team)}
                      fillOpacity={entry.fastest ? 1 : 0.75}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-neutral-600 text-sm font-mono">
              No lap time data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
