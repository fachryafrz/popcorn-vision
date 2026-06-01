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
        <h2 className="text-xl font-bold tracking-tight text-white mb-1">Account Security</h2>
        <p className="text-xs text-zinc-500">
          Change your password. Upon updating, you will be logged out of other devices.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1 text-left">
            Current Password
          </Label>
          <Input
            type="password"
            required
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 py-6 px-4 text-sm text-white placeholder-zinc-650 outline-hidden transition-all focus:border-blue-500/50 focus:bg-zinc-900 text-left"
          />
        </div>

        <div>
          <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1 text-left">
            New Password
          </Label>
          <Input
            type="password"
            required
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 py-6 px-4 text-sm text-white placeholder-zinc-655 outline-hidden transition-all focus:border-blue-500/50 focus:bg-zinc-900 text-left"
          />
        </div>

        <div>
          <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1 text-left">
            Confirm New Password
          </Label>
          <Input
            type="password"
            required
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 py-6 px-4 text-sm text-white placeholder-zinc-655 outline-hidden transition-all focus:border-blue-500/50 focus:bg-zinc-900 text-left"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={updatingPassword}
        className="w-full rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 py-6 text-sm font-semibold text-white transition-all duration-200 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] mt-6 cursor-pointer"
      >
        {updatingPassword ? (
          <Loader2 className="h-5 w-5 animate-spin mx-auto" />
        ) : (
          "Change Password"
        )}
      </Button>
    </form>
  );
}
