import { describe, expect, it } from "vitest";
import {
  RESULTS_VIEW_STORAGE_KEY,
  coerceResultsViewMode,
  getStoredResultsViewMode,
  storeResultsViewMode
} from "../utils/resultsViewMode";

describe("results view mode storage", () => {
  it("defaults to list view and remembers map view", () => {
    localStorage.removeItem(RESULTS_VIEW_STORAGE_KEY);
    expect(getStoredResultsViewMode()).toBe("list");

    storeResultsViewMode("map");
    expect(getStoredResultsViewMode()).toBe("map");
  });

  it("falls back to list when map coordinates are unavailable", () => {
    expect(coerceResultsViewMode("map", false)).toBe("list");
    expect(coerceResultsViewMode("map", true)).toBe("map");
  });
});
