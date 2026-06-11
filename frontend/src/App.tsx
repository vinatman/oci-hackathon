import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { DemoUserProvider } from "./hooks/useDemoUser";
import { AssistantPage } from "./pages/AssistantPage";
import { Dashboard } from "./pages/Dashboard";
import { Landing } from "./pages/Landing";
import { Preferences } from "./pages/Preferences";
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
          path="/preferences"
          element={
            <AppShell>
              <Preferences />
            </AppShell>
          }
        />
        <Route path="/profile" element={<Navigate to="/preferences?section=profile" replace />} />
        <Route path="/favorite-teams" element={<Navigate to="/preferences?section=teams" replace />} />
        <Route
          path="/venue-finder"
          element={
            <AppShell>
              <VenueFinder />
            </AppShell>
          }
        />
        <Route path="/saved-venues" element={<Navigate to="/preferences?section=saved" replace />} />
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
