const TEAM_COLORS = {
  "Red Bull Racing": "#3671C6",
  Ferrari: "#E8002D",
  Mercedes: "#27F4D2",
  McLaren: "#FF8000",
  "Aston Martin": "#358C75",
  Alpine: "#FF87BC",
  Williams: "#64C4FF",
  AlphaTauri: "#5E8FAA",
  "Alfa Romeo": "#C92D4B",
  Haas: "#B6BABD",
};

export function getTeamColor(team) {
  return TEAM_COLORS[team] ?? "#9B9B9B";
}

export function TeamDot({ team, size = 10 }) {
  return (
    <span
      className="inline-block rounded-full flex-shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: getTeamColor(team),
      }}
    />
  );
}
