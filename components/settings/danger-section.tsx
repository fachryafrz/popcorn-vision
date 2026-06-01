import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DangerSectionProps {
  closePassword: string;
  setClosePassword: (val: string) => void;
  closingAccount: boolean;
  handleCloseAccount: (e: React.FormEvent) => void;
  deletePassword: string;
  setDeletePassword: (val: string) => void;
  deletingAccount: boolean;
  handleDeleteAccount: (e: React.FormEvent) => void;
}

export default function DangerSection({
  closePassword,
  setClosePassword,
  closingAccount,
  handleCloseAccount,
  deletePassword,
  setDeletePassword,
  deletingAccount,
  handleDeleteAccount,
}: DangerSectionProps) {
  return (
    <div className="divide-y divide-zinc-900/80">
      {/* CLOSE ACCOUNT SECTION */}
      <form onSubmit={handleCloseAccount} className="space-y-6 pb-10">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white mb-1 text-left">Close Account</h2>
          <p className="text-xs text-zinc-500 text-left">
            Temporarily close your account. This logs you out and hides your profile page. All your logged lists, diary entries, ratings, and reviews will be safely preserved. You can reopen your account anytime simply by logging back in.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1 text-left">
              Enter Password to Confirm Closing Account
            </Label>
            <Input
              type="password"
              required
              placeholder="Current Password"
              value={closePassword}
              onChange={(e) => setClosePassword(e.target.value)}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 py-6 px-4 text-sm text-white placeholder-zinc-650 outline-hidden transition-all focus:border-zinc-500/30 focus:bg-zinc-900 text-left"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={closingAccount}
          className="w-full rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98] mt-6 cursor-pointer h-12"
        >
          {closingAccount ? (
            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
          ) : (
            "Close My Account"
          )}
        </Button>
      </form>

      {/* DANGER ZONE DELETION */}
      <form onSubmit={handleDeleteAccount} className="space-y-6 pt-10">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-red-500 mb-1 text-left">Danger Zone</h2>
          <p className="text-xs text-zinc-500 text-left">
            Delete your profile. This clears your profile information and anonymizes your historical contributions.
          </p>
        </div>

        <div className="rounded-2xl border border-red-950 bg-red-950/10 p-4 text-sm text-red-400 space-y-2 text-left">
          <p className="font-semibold text-xs uppercase tracking-wider text-red-500">
            Warning: Deletion is permanent
          </p>
          <p className="text-xs text-red-400/80 leading-relaxed">
            Your profile details (email, bio, profile image) will be permanently cleared and your username will be randomized to free it up for other film enthusiasts. Your comment authors will appear as <strong className="text-white">[deleted]</strong>. Your ratings, watchlist, and diary records will be safely preserved in the database for continuity but fully anonymized.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1 text-left">
              Enter Password to Confirm Deletion
            </Label>
            <Input
              type="password"
              required
              placeholder="Current Password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 py-6 px-4 text-sm text-white placeholder-zinc-650 outline-hidden transition-all focus:border-red-500/30 focus:bg-zinc-900 text-left"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={deletingAccount}
          className="w-full rounded-2xl bg-red-955 border border-red-900/50 hover:bg-red-900 text-sm font-semibold text-red-200 transition-all duration-200 active:scale-[0.98] mt-6 cursor-pointer h-12"
        >
          {deletingAccount ? (
            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
          ) : (
            "Delete Account"
          )}
        </Button>
      </form>
    </div>
  );
}
