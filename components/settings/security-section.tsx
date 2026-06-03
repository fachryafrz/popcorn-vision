import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SecuritySectionProps {
  currentPassword: string;
  setCurrentPassword: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  updatingPassword: boolean;
  handleUpdatePassword: (e: React.FormEvent) => void;
}

export default function SecuritySection({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  updatingPassword,
  handleUpdatePassword,
}: SecuritySectionProps) {
  return (
    <form onSubmit={handleUpdatePassword} className="space-y-6">
      <div>
        <h2 className="mb-1 text-xl font-bold tracking-tight text-white">
          Account Security
        </h2>
        <p className="text-xs text-zinc-500">
          Change your password. Upon updating, you will be logged out of other
          devices.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="mb-1 block text-left text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            Current Password
          </Label>
          <Input
            type="password"
            required
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="placeholder-zinc-650 focus:border-primary/50 w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 px-4 py-6 text-left text-sm text-white outline-hidden transition-all focus:bg-zinc-900"
          />
        </div>

        <div>
          <Label className="mb-1 block text-left text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            New Password
          </Label>
          <Input
            type="password"
            required
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="placeholder-zinc-655 focus:border-primary/50 w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 px-4 py-6 text-left text-sm text-white outline-hidden transition-all focus:bg-zinc-900"
          />
        </div>

        <div>
          <Label className="mb-1 block text-left text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            Confirm New Password
          </Label>
          <Input
            type="password"
            required
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="placeholder-zinc-655 focus:border-primary/50 w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 px-4 py-6 text-left text-sm text-white outline-hidden transition-all focus:bg-zinc-900"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={updatingPassword}
        className="to-primary hover:to-primary hover:from-primary from-primary mt-6 w-full cursor-pointer rounded-2xl bg-linear-to-r py-6 text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98]"
      >
        {updatingPassword ? (
          <Loader2 className="mx-auto h-5 w-5 animate-spin" />
        ) : (
          "Change Password"
        )}
      </Button>
    </form>
  );
}
