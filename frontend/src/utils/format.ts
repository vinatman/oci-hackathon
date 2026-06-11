export function formatGameLabel(game: { awayTeam: { name: string }; homeTeam: { name: string } }) {
  return `${game.awayTeam.name} at ${game.homeTeam.name}`;
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function formatDistance(km?: number) {
  if (typeof km !== "number") {
    return "distance unavailable";
  }
  return `${(km * 0.621371).toFixed(1)} mi`;
}
