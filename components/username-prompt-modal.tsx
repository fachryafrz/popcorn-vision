"use client";

import { useState } from "react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { Loader2, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConvex, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { siteConfig } from "@/config/site";
import { useEffect } from "react";

export default function UsernamePromptModal() {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const user = session.data?.user;

  const convex = useConvex();
  const updateProfile = useMutation(api.users.createOrUpdateProfile);

  const convexProfile = useQuery(
    api.users.getCurrentUser,
    isLoggedIn ? {} : "skip"
  );

  // Auto-sync user profile to Convex if logged in but missing in Convex db
  useEffect(() => {
    if (isLoggedIn && user && user.username && convexProfile === null) {
      updateProfile({
        username: user.username,
        name: user.name,
        email: user.email || "",
      }).catch((err) => {
        console.error("Auto sync profile to Convex failed:", err);
      });
    }
  }, [isLoggedIn, user, convexProfile, updateProfile]);

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Derived open state to prevent cascading renders inside useEffect
  const isOpen = isLoggedIn && user && !user.username && !isSubmitted;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const cleanedUsername = username.trim().toLowerCase();
    if (!/^[a-zA-Z0-9_]{3,15}$/.test(cleanedUsername)) {
      setError("Username must be between 3 and 15 alphanumeric characters or underscores");
      setLoading(false);
      return;
    }

    try {
      // 1. Check uniqueness in Convex first
      const isUnique = await convex.query(api.users.checkUsernameUnique, {
        username: cleanedUsername,
      });
      if (!isUnique) {
        setError("Username is already taken");
        setLoading(false);
        return;
      }

      // 2. Change username via Better Auth client updateUser method
      const result = await authClient.updateUser({
        username: cleanedUsername,
      });

      if (result.error) {
        setError(result.error.message || "Failed to save username in account");
      } else {
        // 3. Sync to Convex users profile table
        await updateProfile({
          username: cleanedUsername,
          name: user?.name || "User",
          email: user?.email || "",
        });

        setIsSubmitted(true);
        window.location.reload();
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        showCloseButton={false}
        className="max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-white shadow-2xl shadow-black/95 backdrop-blur-xl [&>button]:hidden"
      >
        <div className="absolute -top-32 -left-32 -z-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 relative">
            <Image
              src="/logo/popcorn.png"
              alt="Logo"
              fill
              className="object-contain p-1.5"
            />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Choose Your Username
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-zinc-400">
            {siteConfig.name} is a social platform! Please choose a unique username to continue browsing, track watchlists, and rate titles.
          </DialogDescription>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              Username
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500 z-10">
                <AtSign className="h-5 w-5" />
              </span>
              <Input
                type="text"
                required
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 py-6 pl-12 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-blue-500/50 focus:bg-zinc-900 focus:ring-1 focus:ring-blue-500/30"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 py-6 text-base font-semibold text-white transition-all duration-200 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] mt-4 cursor-pointer"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Username"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

