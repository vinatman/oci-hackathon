// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LocationPicker } from "../components/LocationPicker";

describe("LocationPicker", () => {
  it("makes current location primary and keeps demo cities secondary", () => {
    const onUseCurrentLocation = vi.fn();
    const onChange = vi.fn();

    render(
      <LocationPicker
        value={{ mode: "manual", city: "Los Angeles", status: "Use current location or enter a city manually." }}
        onChange={onChange}
        onUseCurrentLocation={onUseCurrentLocation}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Use Current Location" }));

    expect(onUseCurrentLocation).toHaveBeenCalledOnce();
    expect(screen.queryByRole("combobox")).toBeNull();
    expect(screen.getByText("Can't use current location? Enter a city manually.")).toBeTruthy();
    expect(screen.getByText("Try a demo city")).toBeTruthy();
  });

  it("shows detected city and rounded coordinates", () => {
    render(
      <LocationPicker
        value={{
          mode: "current",
          city: "San Francisco",
          region: "CA",
          latitude: 37.774929,
          longitude: -122.419416,
          locationSource: "browser",
          status: "Location detected: San Francisco, CA.",
          statusKind: "success"
        }}
        onChange={() => undefined}
        onUseCurrentLocation={() => undefined}
      />
    );

    expect(screen.getByText("Location detected")).toBeTruthy();
    expect(screen.getByText("Using your current location near San Francisco, CA.")).toBeTruthy();
    expect(screen.getByText("Coordinates: 37.7749, -122.4194")).toBeTruthy();
  });
});
