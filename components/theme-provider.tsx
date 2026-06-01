"use client";

import { createContext, useContext, useEffect, ReactNode, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
  const reopenAccount = useMutation(api.users.reopenCurrentUserAccount);

  const [reopening, setReopening] = useState(false);

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

      {/* Account Deactivated/Closed Overlay Prompt */}
      {isLoggedIn && currentUser && currentUser.status === "closed" && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950/80 backdrop-blur-md p-6">
          <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-3xl text-center space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-white">Reopen Your Account?</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Welcome back! Your account is currently closed. Reopening your account will restore your profile page and all your previous logged history.
            </p>
            <div className="flex flex-col gap-3 pt-2">
              <Button
                disabled={reopening}
                onClick={async () => {
                  setReopening(true);
                  try {
                    const res = await reopenAccount();
                    if (res?.reopened) {
                      window.location.reload();
                    }
                  } catch (err: unknown) {
                    console.error("Failed to reopen account:", err);
                    setReopening(false);
                  }
                }}
                className="w-full rounded-2xl bg-white hover:bg-zinc-200 text-black font-bold py-3.5 cursor-pointer transition-all active:scale-[0.98] h-12 flex items-center justify-center"
              >
                {reopening ? (
                  <Loader2 className="h-5 w-5 animate-spin text-black" />
                ) : (
                  "Yes, Reopen My Account"
                )}
              </Button>
              <Button
                disabled={reopening}
                onClick={async () => {
                  setReopening(true);
                  try {
                    await authClient.signOut();
                    window.location.reload();
                  } catch (err: unknown) {
                    console.error("Failed to sign out:", err);
                    setReopening(false);
                  }
                }}
                variant="outline"
                className="w-full rounded-2xl border-zinc-800 text-zinc-400 hover:text-white py-3.5 cursor-pointer transition-all h-12 flex items-center justify-center bg-transparent hover:bg-zinc-800/40"
              >
                Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
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
