"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Mail, Lock, User, Loader2, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const convex = useConvex();
  const updateProfile = useMutation(api.users.createOrUpdateProfile);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const { error: signInError } = await authClient.signIn.email({
          email,
          password,
        });
        if (signInError) {
          setError(signInError.message || "Invalid email or password");
        } else {
          onClose();
          window.location.reload();
        }
      } else {
        if (!name) {
          setError("Name is required");
          setLoading(false);
          return;
        }

        const cleanedUsername = username.trim().toLowerCase();
        if (!/^[a-zA-Z0-9_]{3,15}$/.test(cleanedUsername)) {
          setError("Username must be between 3 and 15 alphanumeric characters or underscores");
          setLoading(false);
          return;
        }

        // Check if username is taken in Convex first
        const isUnique = await convex.query(api.users.checkUsernameUnique, {
          username: cleanedUsername,
        });
        if (!isUnique) {
          setError("Username is already taken");
          setLoading(false);
          return;
        }

        const { data: signUpData, error: signUpError } = await authClient.signUp.email({
          email,
          password,
          name,
          username: cleanedUsername,
        });

        if (signUpError) {
          setError(signUpError.message || "Failed to create account");
        } else if (signUpData?.user) {
          // Success: Sync profile to Convex users table!
          // We can call createOrUpdateProfile directly as the user session should be established,
          // or we pass user data. In our Convex mutation, it gets ctx user which is authenticated.
          // Wait, sometimes the server context doesn't register the cookie instantly on the very next microtask,
          // but Better-Auth client stores the token. Let's make sure the mutation can also succeed if we run it.
          // To be safe, wait a short moment or let the page reload. Actually, createOrUpdateProfile is called.
          // Wait! If createOrUpdateProfile uses authComponent.getAuthUser(ctx), does it work if we haven't reloaded?
          // The Better Auth client sets headers/cookies, so the next request to Convex will include them.
          // Let's call it!
          try {
            await updateProfile({
              username: cleanedUsername,
              name,
              email,
            });
          } catch (err) {
            console.error("Convex profile sync failed:", err);
          }

          onClose();
          window.location.reload();
        }
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/85 p-8 text-white shadow-2xl shadow-black/80 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
        
        {/* Glow effect */}
        <div className="absolute -top-32 -left-32 -z-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 -z-10 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
            <img
              src="/logo/popcorn.png"
              alt="Logo"
              className="h-9 w-9 object-contain"
            />
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            {isLogin ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-zinc-400">
            {isLogin
              ? "Sign in to save your watchlist and rate titles"
              : "Register to explore, track, and review titles"}
          </DialogDescription>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="relative">
                <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                  Name
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500 z-10">
                    <User className="h-5 w-5" />
                  </span>
                  <Input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 py-6 pl-12 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:border-blue-500/50 focus:bg-zinc-900 focus:ring-1 focus:ring-blue-500/30"
                  />
                </div>
              </div>

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
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 py-6 pl-12 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:border-blue-500/50 focus:bg-zinc-900 focus:ring-1 focus:ring-blue-500/30"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              Email Address
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500 z-10">
                <Mail className="h-5 w-5" />
              </span>
              <Input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 py-6 pl-12 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:border-blue-500/50 focus:bg-zinc-900 focus:ring-1 focus:ring-blue-500/30"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              Password
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500 z-10">
                <Lock className="h-5 w-5" />
              </span>
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 py-6 pl-12 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:border-blue-500/50 focus:bg-zinc-900 focus:ring-1 focus:ring-blue-500/30"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 py-6 text-base font-semibold text-white transition-all duration-200 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 mt-6 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-zinc-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold text-blue-400 hover:underline transition-all duration-200 bg-transparent border-none p-0 cursor-pointer"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
