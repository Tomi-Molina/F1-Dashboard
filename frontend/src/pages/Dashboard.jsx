import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStandings, getRaces, getSeasons } from "../services/api";
import StatCard from "../components/StatCard";
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
} from "recharts";

function PositionBadge({ pos, dnf }) {
  if (dnf) return <span className="pos-badge pos-dnf">DNF</span>;
  if (pos === 1) return <span className="pos-badge pos-1">1st</span>;
  if (pos === 2) return <span className="pos-badge pos-2">2nd</span>;
  if (pos === 3) return <span className="pos-badge pos-3">3rd</span>;
  return <span className="pos-badge pos-other">P{pos}</span>;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="font-display font-semibold text-white text-sm mb-1">{label}</p>
      <p className="font-mono text-f1-red text-lg font-bold">{payload[0].value} pts</p>
    </div>
  );
}

export default function Dashboard() {
  const [season, setSeason] = useState(2023);
  const [seasons, setSeasons] = useState([2023]);
  const [standings, setStandings] = useState(null);
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getSeasons()
      .then(setSeasons)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([getStandings(season), getRaces(season)])
      .then(([s, r]) => {
        setStandings(s);
        setRaces(r);
      })
      .catch(() => setError("Could not load data from the API."))
      .finally(() => setLoading(false));
  }, [season]);

  if (loading) return <LoadingSpinner message="Loading season data..." />;
  if (error) return <ErrorMessage message={error} />;

  const leader = standings?.entries?.[0];
  const topRace = races?.[races.length - 1]; // most recent
  const totalRaces = races.length;

  // Chart data: top 8 drivers
  const chartData = (standings?.entries ?? []).slice(0, 8).map((e) => ({
    name: e.short_name,
    points: e.total_points,
    team: e.team,
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white tracking-wide">
            SEASON OVERVIEW
          </h1>
          <p className="text-neutral-500 text-sm mt-1 font-body">
            Formula 1 Championship — {season}
          </p>
        </div>
        <select
          className="f1-select"
          value={season}
          onChange={(e) => setSeason(Number(e.target.value))}
        >
          {seasons.map((s) => (
            <option key={s} value={s}>
              {s} Season
            </option>
          ))}
        </select>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger">
        <StatCard
          label="Championship Leader"
          value={leader?.short_name ?? "—"}
          sub={leader?.team}
          accent
        />
        <StatCard
          label="Leader Points"
          value={leader ? `${leader.total_points}` : "—"}
          sub={`${leader?.wins ?? 0} wins this season`}
        />
        <StatCard
          label="Races Completed"
          value={totalRaces}
          sub="of 22 scheduled"
        />
        <StatCard
          label="Last Race"
          value={topRace?.country ?? "—"}
          sub={topRace?.name}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Standings table — takes 2 cols */}
        <div className="lg:col-span-2 card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-display font-semibold text-white text-xl tracking-wide">
              DRIVERS' STANDINGS
            </h2>
            <span className="text-xs font-mono text-neutral-600">{season}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-neutral-500 font-body font-normal text-xs uppercase tracking-wider w-10">
                    Pos
                  </th>
                  <th className="text-left px-3 py-3 text-neutral-500 font-body font-normal text-xs uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="text-left px-3 py-3 text-neutral-500 font-body font-normal text-xs uppercase tracking-wider hidden md:table-cell">
                    Team
                  </th>
                  <th className="text-right px-3 py-3 text-neutral-500 font-body font-normal text-xs uppercase tracking-wider w-16">
                    Wins
                  </th>
                  <th className="text-right px-5 py-3 text-neutral-500 font-body font-normal text-xs uppercase tracking-wider w-20">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {(standings?.entries ?? []).map((entry, idx) => (
                  <tr
                    key={entry.driver_id}
                    className="border-b border-border/50 hover:bg-bg-hover transition-colors cursor-default group"
                  >
                    <td className="px-5 py-3">
                      <span
                        className={`font-mono font-bold text-sm ${
                          idx === 0
                            ? "text-f1-red"
                            : idx < 3
                            ? "text-white"
                            : "text-neutral-500"
                        }`}
                      >
                        {entry.position}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <TeamDot team={entry.team} />
                        <span className="font-body text-white font-medium">
                          {entry.driver_name}
                        </span>
                        <span className="hidden sm:inline text-neutral-600 font-mono text-xs">
                          #{entry.driver_id}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell text-neutral-400 font-body text-xs">
                      {entry.team}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-neutral-400 text-sm">
                      {entry.wins}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="font-mono font-bold text-white text-sm">
                        {entry.total_points}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Race calendar */}
        <div className="card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-display font-semibold text-white text-xl tracking-wide">
              RACE CALENDAR
            </h2>
          </div>
          <div className="divide-y divide-border/50 overflow-y-auto max-h-[480px]">
            {races.map((race) => (
              <button
                key={race.race_id}
                onClick={() => navigate(`/races/${race.race_id}`)}
                className="w-full text-left px-5 py-3.5 hover:bg-bg-hover transition-colors flex items-start justify-between gap-3 group accent-line pl-8"
              >
                <div className="min-w-0">
                  <p className="font-body font-medium text-white text-sm truncate group-hover:text-f1-red transition-colors">
                    {race.name}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5 font-mono">
                    {race.circuit}
                  </p>
                  {race.winner_name && (
                    <p className="text-xs text-neutral-600 mt-1">
                      🏆 {race.winner_name}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-mono text-xs text-neutral-600">
                    R{race.round}
                  </span>
                  <p className="font-mono text-xs text-neutral-600 mt-0.5">
                    {race.date}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Points chart */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-white text-xl tracking-wide">
            POINTS COMPARISON
          </h2>
          <span className="text-xs font-mono text-neutral-600">Top 8 Drivers</span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: "#9B9B9B", fontSize: 12, fontFamily: "Space Mono" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#9B9B9B", fontSize: 11, fontFamily: "Space Mono" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="points" radius={[4, 4, 0, 0]} maxBarSize={48}>
              {chartData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={index === 0 ? "#E10600" : getTeamColor(entry.team)}
                  fillOpacity={index === 0 ? 1 : 0.7}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
