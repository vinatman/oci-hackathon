export function addFavoriteTeamId(currentIds: string[], teamId: string) {
  return Array.from(new Set([...currentIds, teamId]));
}

export function removeFavoriteTeamId(currentIds: string[], teamId: string) {
  return currentIds.filter((id) => id !== teamId);
}
