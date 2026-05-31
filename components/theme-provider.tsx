"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";

export type ThemeType =
  | "light"
  | "dark"
  | "netflix"
  | "hbo"
  | "disney"
  | "prime"
  | "letterboxd"
  | "cinema"
  | "sakura";

interface PersonalizationContextProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const PersonalizationContext = createContext<PersonalizationContextProps | undefined>(undefined);

export function PersonalizationProvider({ children }: { children: ReactNode }) {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;

  // DB Sync mutations and queries
  const currentUser = useQuery(api.users.getCurrentUser, isLoggedIn ? {} : "skip");
  const saveThemeSettings = useMutation(api.users.updateUserThemeSettings);

  // Compute active variables based on user status
  const theme = isLoggedIn && currentUser?.theme ? (currentUser.theme as ThemeType) : "dark";

  const setTheme = async (newTheme: ThemeType) => {
    if (isLoggedIn) {
      try {
        await saveThemeSettings({ theme: newTheme });
      } catch (err) {
        console.error("Failed to save theme setting to DB:", err);
      }
    }
  };

  // Effect to apply dynamic theme class tags and accent style overrides to html tag
  useEffect(() => {
    const root = document.documentElement;

    // Class list resolution - Always Dark Mode first
    root.classList.remove("light");
    root.classList.add("dark");

    // Set custom theme tag
    root.setAttribute("data-theme", theme);

    // Override hardcoded blue/indigo tailwind utilities with the theme's active primary color
    root.style.setProperty("--color-blue-400", "var(--primary)");
    root.style.setProperty("--color-blue-500", "var(--primary)");
    root.style.setProperty("--color-blue-600", "var(--primary)");
    root.style.setProperty("--color-indigo-500", "var(--primary)");
    root.style.setProperty("--color-indigo-600", "var(--primary)");
  }, [theme]);

  return (
    <PersonalizationContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </PersonalizationContext.Provider>
  );
}

export function usePersonalization() {
  const context = useContext(PersonalizationContext);
  if (context === undefined) {
    throw new Error("usePersonalization must be used within a PersonalizationProvider");
  }
  return context;
}
