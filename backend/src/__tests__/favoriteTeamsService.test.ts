import { describe, expect, it } from "vitest";
import { addFavoriteTeamId, removeFavoriteTeamId } from "../services/favoriteTeamsService.js";

describe("favorite team helpers", () => {
  it("adds a favorite team once", () => {
    expect(addFavoriteTeamId(["lakers"], "lakers")).toEqual(["lakers"]);
    expect(addFavoriteTeamId(["lakers"], "cowboys")).toEqual(["lakers", "cowboys"]);
  });

  it("removes a favorite team", () => {
    expect(removeFavoriteTeamId(["lakers", "cowboys"], "lakers")).toEqual(["cowboys"]);
  });
});
