import { useEffect, useState } from "react";
import { getDrivers, compareDrivers } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { TeamDot, getTeamColor } from "../components/TeamColor";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts";

const SEASON = 2023;

function StatRow({ label, v1, v2, highlight }) {
  return (
    <div className={`flex items-center justify-between py-3 px-5 border-b border-border/50 ${highlight ? "bg-f1-red/5" : ""}`}>
      <span
        className={`font-mono font-bold text-lg min-w-[60px] text-right ${
          typeof v1 === "number" && typeof v2 === "number" && v1 > v2
            ? "text-white"
            : "text-neutral-500"
        }`}
      >
        {v1}
      </span>
      <span className="text-xs text-neutral-600 uppercase tracking-widest font-body text-center px-3 flex-1 text-center">
        {label}
      </span>
      <span
        className={`font-mono font-bold text-lg min-w-[60px] text-left ${
          typeof v1 === "number" && typeof v2 === "number" && v2 > v1
            ? "text-white"
            : "text-neutral-500"
        }`}
      >
        {v2}
      </span>
    </div>
  );
}

function CompTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip min-w-[160px]">
      <p className="font-body text-neutral-400 text-xs mb-2 truncate">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="text-xs font-body" style={{ color: p.color }}>{p.name}</span>
          <span className="font-mono font-bold text-white text-sm">{p.value} pts</span>
        </div>
      ))}
    </div>
  );
}

export default function DriverComparison() {
  const [drivers, setDrivers] = useState([]);
  const [driver1Id, setDriver1Id] = useState("verstappen");
  const [driver2Id, setDriver2Id] = useState("hamilton");
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [driversLoading, setDriversLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDrivers(SEASON)
      .then(setDrivers)
      .catch(() => {})
      .finally(() => setDriversLoading(false));
  }, []);

  useEffect(() => {
    if (!driver1Id || !driver2Id || driver1Id === driver2Id) return;
    setLoading(true);
    setError(null);
    compareDrivers(driver1Id, driver2Id, SEASON)
      .then(setComparison)
      .catch(() => setError("Could not load comparison data."))
      .finally(() => setLoading(false));
  }, [driver1Id, driver2Id]);

  // Build line chart data
  const chartData = comparison
    ? comparison.driver1.race_points.map((rp, i) => ({
        race: rp.race_name.replace(" Grand Prix", "").replace(" Prix", ""),
        [comparison.driver1.driver.short_name]: comparison.driver1.cumulative_points[i],
        [comparison.driver2.driver.short_name]: comparison.driver2.cumulative_points[i],
      }))
    : [];

  const d1Color = comparison ? getTeamColor(comparison.driver1.driver.team) : "#E10600";
  const d2Color = comparison ? getTeamColor(comparison.driver2.driver.team) : "#27F4D2";
  const d1Short = comparison?.driver1.driver.short_name;
  const d2Short = comparison?.driver2.driver.short_name;

  if (driversLoading) return <LoadingSpinner message="Loading drivers..." />;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-white tracking-wide">
          DRIVER COMPARISON
        </h1>
        <p className="text-neutral-500 text-sm mt-1 font-body">
          Head-to-head statistics — {SEASON} Season
        </p>
      </div>

      {/* Driver selectors */}
      <div className="card p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider font-body block mb-2">
              Driver 1
            </label>
            <select
              className="f1-select w-full"
              value={driver1Id}
              onChange={(e) => setDriver1Id(e.target.value)}
            >
              {drivers.map((d) => (
                <option key={d.driver_id} value={d.driver_id} disabled={d.driver_id === driver2Id}>
                  {d.name} ({d.team})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider font-body block mb-2">
              Driver 2
            </label>
            <select
              className="f1-select w-full"
              value={driver2Id}
              onChange={(e) => setDriver2Id(e.target.value)}
            >
              {drivers.map((d) => (
                <option key={d.driver_id} value={d.driver_id} disabled={d.driver_id === driver1Id}>
                  {d.name} ({d.team})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner message="Loading comparison..." />}
      {error && <ErrorMessage message={error} />}

      {comparison && !loading && (
        <>
          {/* Driver header cards */}
          <div className="grid grid-cols-2 gap-4">
            {[comparison.driver1, comparison.driver2].map((data, idx) => (
              <div
                key={data.driver.driver_id}
                className="card p-5"
                style={{ borderTopColor: idx === 0 ? d1Color : d2Color, borderTopWidth: 3 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <TeamDot team={data.driver.team} size={10} />
                      <span className="text-xs text-neutral-500 font-body">{data.driver.team}</span>
                    </div>
                    <p className="font-display font-bold text-xl md:text-2xl text-white">
                      {data.driver.name}
                    </p>
                    <p className="text-xs text-neutral-600 font-mono mt-1">
                      #{data.driver.number} · {data.driver.nationality}
                    </p>
                  </div>
                  <span
                    className="font-display font-bold text-4xl md:text-5xl"
                    style={{ color: idx === 0 ? d1Color : d2Color, opacity: 0.7 }}
                  >
                    {data.driver.short_name}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="font-mono font-bold text-xl text-white">{data.driver.total_points}</p>
                    <p className="text-xs text-neutral-600 font-body mt-0.5">Points</p>
                  </div>
                  <div>
                    <p className="font-mono font-bold text-xl text-white">{data.driver.wins}</p>
                    <p className="text-xs text-neutral-600 font-body mt-0.5">Wins</p>
                  </div>
                  <div>
                    <p className="font-mono font-bold text-xl text-white">{data.driver.podiums}</p>
                    <p className="text-xs text-neutral-600 font-body mt-0.5">Podiums</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Points progression chart */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-white text-xl tracking-wide">
                POINTS PROGRESSION
              </h2>
              <span className="text-xs font-mono text-neutral-600">Cumulative — {SEASON}</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
                <XAxis
                  dataKey="race"
                  tick={{ fill: "#5A5A5A", fontSize: 9, fontFamily: "Space Mono" }}
                  axisLine={false}
                  tickLine={false}
                  interval={1}
                  angle={-35}
                  textAnchor="end"
                  height={48}
                />
                <YAxis
                  tick={{ fill: "#9B9B9B", fontSize: 10, fontFamily: "Space Mono" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CompTooltip />} />
                <Legend
                  wrapperStyle={{ fontFamily: "Space Mono", fontSize: 11, paddingTop: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey={d1Short}
                  stroke={d1Color}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: d1Color }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey={d2Short}
                  stroke={d2Color}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: d2Color }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Head-to-head stats */}
          <div className="card p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-display font-semibold text-white text-xl tracking-wide">
                HEAD-TO-HEAD
              </h2>
              <span className="text-xs font-mono text-neutral-600">
                {comparison.driver1.driver.short_name} vs {comparison.driver2.driver.short_name}
              </span>
            </div>

            {/* H2H wins bar */}
            <div className="px-5 py-4 border-b border-border">
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-body mb-3">
                Races Ahead (of each other)
              </p>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-white min-w-[24px] text-right">
                  {comparison.driver1.h2h_wins}
                </span>
                <div className="flex-1 h-3 bg-bg-hover rounded-full overflow-hidden flex">
                  {(() => {
                    const total = comparison.driver1.h2h_wins + comparison.driver2.h2h_wins;
                    const pct = total > 0 ? (comparison.driver1.h2h_wins / total) * 100 : 50;
                    return (
                      <>
                        <div
                          className="h-full transition-all duration-700"
                          style={{ width: `${pct}%`, backgroundColor: d1Color }}
                        />
                        <div
                          className="h-full transition-all duration-700"
                          style={{ width: `${100 - pct}%`, backgroundColor: d2Color }}
                        />
                      </>
                    );
                  })()}
                </div>
                <span className="font-mono font-bold text-white min-w-[24px]">
                  {comparison.driver2.h2h_wins}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs font-mono" style={{ color: d1Color }}>{d1Short}</span>
                <span className="text-xs font-mono" style={{ color: d2Color }}>{d2Short}</span>
              </div>
            </div>

            {/* Stats rows */}
            <StatRow
              label="Total Points"
              v1={comparison.driver1.driver.total_points}
              v2={comparison.driver2.driver.total_points}
              highlight
            />
            <StatRow
              label="Race Wins"
              v1={comparison.driver1.driver.wins}
              v2={comparison.driver2.driver.wins}
            />
            <StatRow
              label="Podiums"
              v1={comparison.driver1.driver.podiums}
              v2={comparison.driver2.driver.podiums}
              highlight
            />
            <StatRow
              label="Pole Positions"
              v1={comparison.driver1.driver.pole_positions}
              v2={comparison.driver2.driver.pole_positions}
            />
            <StatRow
              label="H2H Ahead"
              v1={comparison.driver1.h2h_wins}
              v2={comparison.driver2.h2h_wins}
              highlight
            />
          </div>

          {/* Race-by-race points table */}
          <div className="card p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-display font-semibold text-white text-xl tracking-wide">
                RACE-BY-RACE POINTS
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-5 py-3 text-neutral-500 font-body font-normal text-xs uppercase tracking-wider">Round</th>
                    <th className="text-left px-3 py-3 text-neutral-500 font-body font-normal text-xs uppercase tracking-wider">Race</th>
                    <th className="text-right px-3 py-3 font-mono text-xs font-bold" style={{ color: d1Color }}>
                      {d1Short}
                    </th>
                    <th className="text-right px-5 py-3 font-mono text-xs font-bold" style={{ color: d2Color }}>
                      {d2Short}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.driver1.race_points.map((rp, i) => {
                    const pts1 = rp.points;
                    const pts2 = comparison.driver2.race_points[i]?.points ?? 0;
                    const winner = pts1 > pts2 ? 1 : pts2 > pts1 ? 2 : 0;
                    return (
                      <tr key={rp.round} className="border-b border-border/50 hover:bg-bg-hover transition-colors">
                        <td className="px-5 py-3 font-mono text-neutral-600 text-xs">R{rp.round}</td>
                        <td className="px-3 py-3 font-body text-neutral-400 text-sm truncate max-w-[180px]">
                          {rp.race_name.replace(" Grand Prix", " GP")}
                        </td>
                        <td className={`px-3 py-3 text-right font-mono font-bold ${winner === 1 ? "text-white" : "text-neutral-600"}`}>
                          {rp.dnf ? <span className="text-f1-red text-xs">DNF</span> : pts1}
                        </td>
                        <td className={`px-5 py-3 text-right font-mono font-bold ${winner === 2 ? "text-white" : "text-neutral-600"}`}>
                          {comparison.driver2.race_points[i]?.dnf ? (
                            <span className="text-f1-red text-xs">DNF</span>
                          ) : pts2}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
