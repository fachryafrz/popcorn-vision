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
          <h2 className="mb-1 text-left text-xl font-bold tracking-tight text-white">
            Close Account
          </h2>
          <p className="text-left text-xs text-zinc-500">
            Temporarily close your account. This logs you out and hides your
            profile page. All your logged lists, diary entries, ratings, and
            reviews will be safely preserved. You can reopen your account
            anytime simply by logging back in.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="mb-1 block text-left text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Enter Password to Confirm Closing Account
            </Label>
            <Input
              type="password"
              required
              placeholder="Current Password"
              value={closePassword}
              onChange={(e) => setClosePassword(e.target.value)}
              className="placeholder-zinc-650 w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 px-4 py-6 text-left text-sm text-white outline-hidden transition-all focus:border-zinc-500/30 focus:bg-zinc-900"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={closingAccount}
          className="mt-6 h-12 w-full cursor-pointer rounded-2xl bg-zinc-800 text-sm font-semibold text-white transition-all duration-200 hover:bg-zinc-700 active:scale-[0.98]"
        >
          {closingAccount ? (
            <Loader2 className="mx-auto h-5 w-5 animate-spin" />
          ) : (
            "Close My Account"
          )}
        </Button>
      </form>

      {/* DANGER ZONE DELETION */}
      <form onSubmit={handleDeleteAccount} className="space-y-6 pt-10">
        <div>
          <h2 className="mb-1 text-left text-xl font-bold tracking-tight text-red-500">
            Danger Zone
          </h2>
          <p className="text-left text-xs text-zinc-500">
            Delete your profile. This clears your profile information and
            anonymizes your historical contributions.
          </p>
        </div>

        <div className="space-y-2 rounded-2xl border border-red-950 bg-red-950/10 p-4 text-left text-sm text-red-400">
          <p className="text-xs font-semibold tracking-wider text-red-500 uppercase">
            Warning: Deletion is permanent
          </p>
          <p className="text-xs leading-relaxed text-red-400/80">
            Your profile details (email, bio, profile image) will be permanently
            cleared and your username will be randomized to free it up for other
            film enthusiasts. Your comment authors will appear as{" "}
            <strong className="text-white">[deleted]</strong>. Your ratings,
            watchlist, and diary records will be safely preserved in the
            database for continuity but fully anonymized.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="mb-1 block text-left text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Enter Password to Confirm Deletion
            </Label>
            <Input
              type="password"
              required
              placeholder="Current Password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="placeholder-zinc-650 w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 px-4 py-6 text-left text-sm text-white outline-hidden transition-all focus:border-red-500/30 focus:bg-zinc-900"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={deletingAccount}
          className="bg-red-955 mt-6 h-12 w-full cursor-pointer rounded-2xl border border-red-900/50 text-sm font-semibold text-red-200 transition-all duration-200 hover:bg-red-900 active:scale-[0.98]"
        >
          {deletingAccount ? (
            <Loader2 className="mx-auto h-5 w-5 animate-spin" />
          ) : (
            "Delete Account"
          )}
        </Button>
      </form>
    </div>
  );
}
