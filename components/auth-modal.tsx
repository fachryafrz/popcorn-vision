"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Mail, Lock, User, Loader2, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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

  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (mode === "forgot") {
        if (!email.includes("@")) {
          setError("Please enter a valid email address");
          setLoading(false);
          return;
        }

        const { error: forgotError } = await authClient.requestPasswordReset({
          email,
          redirectTo: window.location.origin + "/reset-password",
        });

        if (forgotError) {
          setError(forgotError.message || "Failed to send reset email");
        } else {
          setSuccess("A password reset link has been sent to your email.");
          setEmail("");
        }
      } else if (mode === "login") {
        const isEmail = email.includes("@");
        const { data: signInData, error: signInError } = isEmail
          ? await authClient.signIn.email({
              email,
              password,
            })
          : await authClient.signIn.username({
              username: email,
              password,
            });

        if (signInError) {
          setError(
            signInError.message ||
              `Invalid ${isEmail ? "email" : "username"} or password`,
          );
        } else if (signInData?.user) {
          // Best effort profile sync on login
          if (signInData.user.username) {
            try {
              await updateProfile({
                username: signInData.user.username,
                name: signInData.user.name,
                email: signInData.user.email || "",
              });
            } catch (err) {
              console.error("Convex profile sync failed on login:", err);
            }
          }
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
          setError(
            "Username must be between 3 and 15 alphanumeric characters or underscores",
          );
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

        const { data: signUpData, error: signUpError } =
          await authClient.signUp.email({
            email,
            password,
            name,
            username: cleanedUsername,
          });

        if (signUpError) {
          setError(signUpError.message || "Failed to create account");
        } else if (signUpData?.user) {
          // Success: Sync profile to Convex users table!
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
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setMode("login");
          setError("");
          setSuccess("");
          setEmail("");
          setPassword("");
          setName("");
          setUsername("");
          onClose();
        }
      }}
    >
      <DialogContent className="animate-in fade-in zoom-in max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/85 p-8 text-white shadow-2xl shadow-black/80 backdrop-blur-xl duration-300">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            <img
              src="/logo/popcorn.png"
              alt="Logo"
              className="h-9 w-9 object-contain"
            />
          </div>
          <DialogTitle className="bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            {mode === "login"
              ? "Welcome Back"
              : mode === "signup"
                ? "Create Account"
                : "Reset Password"}
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-zinc-400">
            {mode === "login"
              ? "Sign in to save your watchlist and rate titles"
              : mode === "signup"
                ? "Register to explore, track, and review titles"
                : "Enter your email address and we'll send you a link to reset your password"}
          </DialogDescription>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              <div className="relative">
                <Label className="mb-1 block text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                  Name
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-zinc-500">
                    <User className="h-5 w-5" />
                  </span>
                  <Input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="focus:border-primary/50 focus:ring-primary/30 w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 py-6 pr-4 pl-12 text-sm text-white placeholder-zinc-500 transition-all duration-200 outline-none focus:bg-zinc-900 focus:ring-1"
                  />
                </div>
              </div>

              <div className="relative">
                <Label className="mb-1 block text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                  Username
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-zinc-500">
                    <AtSign className="h-5 w-5" />
                  </span>
                  <Input
                    type="text"
                    required
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="focus:border-primary/50 focus:ring-primary/30 w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 py-6 pr-4 pl-12 text-sm text-white placeholder-zinc-500 transition-all duration-200 outline-none focus:bg-zinc-900 focus:ring-1"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <Label className="mb-1 block text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              {mode === "login" ? "Email or Username" : "Email Address"}
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-zinc-500">
                {mode === "login" &&
                !email.includes("@") &&
                email.trim() !== "" ? (
                  <AtSign className="h-5 w-5" />
                ) : (
                  <Mail className="h-5 w-5" />
                )}
              </span>
              <Input
                type={mode === "signup" || mode === "forgot" ? "email" : "text"}
                required
                placeholder={
                  mode === "login"
                    ? "you@example.com or username"
                    : "you@example.com"
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:border-primary/50 focus:ring-primary/30 w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 py-6 pr-4 pl-12 text-sm text-white placeholder-zinc-500 transition-all duration-200 outline-none focus:bg-zinc-900 focus:ring-1"
              />
            </div>
          </div>

          {mode !== "forgot" && (
            <div>
              <div className="mb-1 flex items-center justify-between">
                <Label className="block text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                  Password
                </Label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setError("");
                      setSuccess("");
                    }}
                    className="text-primary cursor-pointer border-none bg-transparent p-0 text-xs font-semibold hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-zinc-500">
                  <Lock className="h-5 w-5" />
                </span>
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:border-primary/50 focus:ring-primary/30 w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 py-6 pr-4 pl-12 text-sm text-white placeholder-zinc-500 transition-all duration-200 outline-none focus:bg-zinc-900 focus:ring-1"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="to-primary hover:to-primary hover:from-primary from-primary mt-6 w-full cursor-pointer rounded-2xl bg-linear-to-r py-6 text-base font-semibold text-white transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : mode === "login" ? (
              "Sign In"
            ) : mode === "signup" ? (
              "Create Account"
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-zinc-400">
          {mode === "login" && (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError("");
                  setSuccess("");
                }}
                className="text-primary cursor-pointer border-none bg-transparent p-0 font-semibold transition-all duration-200 hover:underline"
              >
                Sign Up
              </button>
            </>
          )}
          {mode === "signup" && (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setSuccess("");
                }}
                className="text-primary cursor-pointer border-none bg-transparent p-0 font-semibold transition-all duration-200 hover:underline"
              >
                Sign In
              </button>
            </>
          )}
          {mode === "forgot" && (
            <>
              Remembered your password?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setSuccess("");
                }}
                className="text-primary cursor-pointer border-none bg-transparent p-0 font-semibold transition-all duration-200 hover:underline"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
