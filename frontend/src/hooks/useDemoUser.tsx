import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "../api/client";
import type { User } from "../types/domain";

const STORAGE_KEY = "sports-connect-demo-user-id";

interface DemoUserContextValue {
  user?: User;
  userId?: string;
  loading: boolean;
  error?: string;
  refreshUser: () => Promise<void>;
  setUser: (user: User) => void;
}

const DemoUserContext = createContext<DemoUserContextValue | undefined>(undefined);

export function DemoUserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const refreshUser = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const storedUserId = localStorage.getItem(STORAGE_KEY) ?? undefined;
      const response = await api.createDemoUser(storedUserId);
      localStorage.setItem(STORAGE_KEY, response.user.id);
      setUserState(response.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not prepare your profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const value = useMemo(
    () => ({
      user,
      userId: user?.id,
      loading,
      error,
      refreshUser,
      setUser: setUserState
    }),
    [error, loading, refreshUser, user]
  );

  return <DemoUserContext.Provider value={value}>{children}</DemoUserContext.Provider>;
}

export function useDemoUser() {
  const context = useContext(DemoUserContext);
  if (!context) {
    throw new Error("useDemoUser must be used inside DemoUserProvider");
  }
  return context;
}
