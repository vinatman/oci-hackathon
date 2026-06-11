// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Sidebar } from "../components/Sidebar";

describe("Sidebar navigation", () => {
  it("keeps personal management consolidated under Preferences", () => {
    render(
      <MemoryRouter initialEntries={["/preferences?section=teams"]}>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getAllByText("Preferences").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Find a Spot").length).toBeGreaterThan(0);
    expect(screen.queryByText("Teams")).toBeNull();
    expect(screen.queryByText("Saved Spots")).toBeNull();
    expect(screen.queryByText("Saved")).toBeNull();
  });
});
