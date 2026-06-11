import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { DemoUserProvider } from "./hooks/useDemoUser";
import { AssistantPage } from "./pages/AssistantPage";
import { Dashboard } from "./pages/Dashboard";
import { FavoriteTeams } from "./pages/FavoriteTeams";
import { Landing } from "./pages/Landing";
import { Profile } from "./pages/Profile";
import { SavedVenues } from "./pages/SavedVenues";
import { VenueFinder } from "./pages/VenueFinder";

export default function App() {
  return (
    <DemoUserProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/dashboard"
          element={
            <AppShell>
              <Dashboard />
            </AppShell>
          }
        />
        <Route
          path="/profile"
          element={
            <AppShell>
              <Profile />
            </AppShell>
          }
        />
        <Route
          path="/favorite-teams"
          element={
            <AppShell>
              <FavoriteTeams />
            </AppShell>
          }
        />
        <Route
          path="/venue-finder"
          element={
            <AppShell>
              <VenueFinder />
            </AppShell>
          }
        />
        <Route
          path="/saved-venues"
          element={
            <AppShell>
              <SavedVenues />
            </AppShell>
          }
        />
        <Route
          path="/assistant"
          element={
            <AppShell>
              <AssistantPage />
            </AppShell>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DemoUserProvider>
  );
}
