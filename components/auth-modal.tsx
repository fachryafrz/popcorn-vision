"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthModalStore } from "@/lib/auth-modal-store";
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
  const router = useRouter();
  const convex = useConvex();
  const updateProfile = useMutation(api.users.createOrUpdateProfile);

  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState<"submit" | "google" | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const searchParams = useSearchParams();
  const openAuth = useAuthModalStore((state) => state.open);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      const decodedError = errorParam.toLowerCase();

      // Clean query parameter from URL using Next.js router to update its internal state
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      router.replace(url.pathname + url.search, { scroll: false });

      if (
        decodedError.includes("account_not_linked") ||
        decodedError.includes("account-not-linked")
      ) {
        setError(
          "This Google account is not linked to your email-based account. Please sign in using your email/username and password first, then go to Settings > Security to link your Google account.",
        );
        openAuth();
      } else {
        setError(`Authentication failed: ${errorParam}`);
        openAuth();
      }
    }
  }, [searchParams, openAuth, router]);

  const handleGoogleSignIn = async () => {
    setLoading("google");
    setError("");
    setSuccess("");

    try {
      const { error: googleError } = await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin,
      });

      if (googleError) {
        setError(googleError.message || "Failed to sign in with Google");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during Google sign in",
      );
    } finally {
      setLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("submit");
    setError("");
    setSuccess("");

    try {
      if (mode === "forgot") {
        if (!email.includes("@")) {
          setError("Please enter a valid email address");
          setLoading(null);
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
          router.refresh();
        }
      } else {
        if (!name) {
          setError("Name is required");
          setLoading(null);
          return;
        }

        const cleanedUsername = username.trim().toLowerCase();
        if (!/^[a-zA-Z0-9_]{3,15}$/.test(cleanedUsername)) {
          setError(
            "Username must be between 3 and 15 alphanumeric characters or underscores",
          );
          setLoading(null);
          return;
        }

        // Check if username is taken in Convex first
        const isUnique = await convex.query(api.users.checkUsernameUnique, {
          username: cleanedUsername,
        });
        if (!isUnique) {
          setError("Username is already taken");
          setLoading(null);
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
          router.refresh();
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again.",
      );
    } finally {
      setLoading(null);
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
      <DialogContent className="animate-in fade-in zoom-in max-w-md rounded-3xl border border-zinc-800 bg-zinc-950/85 p-8 text-white shadow-2xl shadow-black/80 backdrop-blur-xl duration-300">
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

        {mode !== "forgot" && (
          <>
            <Button
              type="button"
              variant="outline"
              disabled={loading !== null}
              onClick={handleGoogleSignIn}
              className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 py-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-zinc-900 active:scale-[0.98]"
            >
              {loading === "google" ? (
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              ) : (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.35 11.1H12V13.8H17.38C17.14 15.08 16.42 16.17 15.34 16.9V19.47H18.64C20.57 17.69 21.68 15.07 21.68 12C21.68 11.39 21.62 10.8 21.51 10.21L21.35 11.1Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 20.58C14.43 20.58 16.47 19.78 17.96 18.4L14.66 15.83C13.76 16.43 12.59 16.8 11.36 16.8C8.99 16.8 6.98 15.2 6.26 13.04H2.86V15.7C4.34 18.64 7.4 20.58 10.9 20.58H12Z"
                    fill="#34A853"
                  />
                  <path
                    d="M6.9 13.1C6.72 12.56 6.62 11.99 6.62 11.4C6.62 10.81 6.72 10.24 6.9 9.7V7.04H2.86C2.26 8.24 1.92 9.58 1.92 11.4C1.92 13.22 2.26 14.56 2.86 15.76L6.9 13.1Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.22C13.32 5.22 14.5 5.67 15.44 6.57L18.02 3.99C16.47 2.5 14.43 1.7 12 1.7C8.5 1.7 5.44 3.64 3.96 6.58L8 9.74C8.72 7.58 10.73 5.98 13.1 5.98L12 5.22Z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              <span>
                {mode === "login"
                  ? "Sign in with Google"
                  : "Sign up with Google"}
              </span>
            </Button>

            <div className="relative my-3 flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-800" />
              <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                Or
              </span>
              <div className="h-px flex-1 bg-zinc-800" />
            </div>
          </>
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
            disabled={loading !== null}
            className="to-primary hover:to-primary hover:from-primary from-primary mt-6 w-full cursor-pointer rounded-2xl bg-linear-to-r py-6 text-base font-semibold text-white transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            {loading === "submit" ? (
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
