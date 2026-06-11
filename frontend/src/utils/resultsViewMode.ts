export type ResultsViewMode = "list" | "map";

export const RESULTS_VIEW_STORAGE_KEY = "sports-connect-results-view";

export function getStoredResultsViewMode(storage: Storage = window.localStorage): ResultsViewMode {
  const value = storage.getItem(RESULTS_VIEW_STORAGE_KEY);
  return value === "map" ? "map" : "list";
}

export function storeResultsViewMode(mode: ResultsViewMode, storage: Storage = window.localStorage) {
  storage.setItem(RESULTS_VIEW_STORAGE_KEY, mode);
}

export function coerceResultsViewMode(mode: ResultsViewMode, mapAvailable: boolean): ResultsViewMode {
  return mode === "map" && !mapAvailable ? "list" : mode;
}
