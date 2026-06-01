"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Lock, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(token ? "" : "Invalid or missing reset token. Please request a new password reset link.");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Missing reset token");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } = await authClient.resetPassword({
        newPassword,
        token,
      });

      if (resetError) {
        setError(resetError.message || "Failed to reset password. The link might have expired.");
      } else {
        setSuccess(true);
        toast.success("Password reset successfully!");
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <CheckCircle2 className="h-8 w-8 animate-bounce" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Password Reset Successful</h2>
        <p className="text-sm text-zinc-400 max-w-sm mx-auto mb-6">
          Your password has been updated. Redirecting you back to the home page so you can sign in with your new password...
        </p>
        <div className="flex justify-center items-center gap-2 text-zinc-500 text-xs">
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          <span>Please wait</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
          <img
            src="/logo/popcorn.png"
            alt="Logo"
            className="h-9 w-9 object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold tracking-tight bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          Set New Password
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Please enter your new password below to secure your account.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {token && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              New Password
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500 z-10">
                <Lock className="h-5 w-5" />
              </span>
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 py-6 pl-12 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:border-blue-500/50 focus:bg-zinc-900 focus:ring-1 focus:ring-blue-500/30"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              Confirm New Password
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500 z-10">
                <Lock className="h-5 w-5" />
              </span>
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      )}

      <div className="mt-8 text-center text-sm text-zinc-400">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-semibold text-zinc-400 hover:text-white transition-all duration-200 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center p-4 pt-22 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute -top-32 -left-32 -z-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 -z-10 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />

      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/85 p-8 text-white shadow-2xl shadow-black/80 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-zinc-400 text-sm">Loading page resources...</p>
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
