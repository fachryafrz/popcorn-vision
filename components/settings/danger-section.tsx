import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DangerSectionProps {
  closeConfirmation: string;
  setCloseConfirmation: (val: string) => void;
  closingAccount: boolean;
  handleCloseAccount: (e: React.FormEvent) => void;
  deleteConfirmation: string;
  setDeleteConfirmation: (val: string) => void;
  deletingAccount: boolean;
  handleDeleteAccount: (e: React.FormEvent) => void;
  clearingDiary: boolean;
  handleClearDiary: () => void;
  clearingWatchlist: boolean;
  handleClearWatchlist: () => void;
  clearingFavorites: boolean;
  handleClearFavorites: () => void;
  clearingRatings: boolean;
  handleClearRatings: () => void;
}

export default function DangerSection({
  closeConfirmation,
  setCloseConfirmation,
  closingAccount,
  handleCloseAccount,
  deleteConfirmation,
  setDeleteConfirmation,
  deletingAccount,
  handleDeleteAccount,
  clearingDiary,
  handleClearDiary,
  clearingWatchlist,
  handleClearWatchlist,
  clearingFavorites,
  handleClearFavorites,
  clearingRatings,
  handleClearRatings,
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
            <Label className="mb-1 block text-left text-xs font-semibold tracking-wider text-zinc-400">
              Type <span className="text-white">"Close My Account"</span> to
              Confirm
            </Label>
            <Input
              type="text"
              required
              placeholder="Close My Account"
              value={closeConfirmation}
              onChange={(e) => setCloseConfirmation(e.target.value)}
              className="placeholder-zinc-650 w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 px-4 py-6 text-left text-sm text-white outline-hidden transition-all focus:border-zinc-500/30 focus:bg-zinc-900"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={closingAccount || closeConfirmation !== "Close My Account"}
          className="mt-6 h-12 w-full cursor-pointer rounded-2xl bg-zinc-800 text-sm font-semibold text-white transition-all duration-200 hover:bg-zinc-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {closingAccount ? (
            <Loader2 className="mx-auto h-5 w-5 animate-spin" />
          ) : (
            "Close My Account"
          )}
        </Button>
      </form>

      {/* CLEAR DATA SECTION */}
      <div className="space-y-6 py-10 text-left">
        <div>
          <h2 className="mb-1 text-xl font-bold tracking-tight text-white">
            Clear Personal Data
          </h2>
          <p className="text-xs text-zinc-500">
            Permanently delete specific categories of data from your account.
            This action cannot be undone.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Clear Diary */}
          <div className="flex flex-col justify-between rounded-2xl border border-zinc-900 bg-zinc-950/20 p-5">
            <div>
              <h3 className="mb-1 text-sm font-bold text-white">Clear Diary</h3>
              <p className="mb-4 text-xs text-zinc-500">
                Delete all your logged watch logs and reviews.
              </p>
            </div>
            <Button
              type="button"
              disabled={clearingDiary}
              onClick={handleClearDiary}
              className="h-10 w-full cursor-pointer rounded-xl bg-zinc-800 text-xs font-semibold text-white transition-all hover:bg-zinc-700 active:scale-[0.98]"
            >
              {clearingDiary ? (
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              ) : (
                "Clear Diary Data"
              )}
            </Button>
          </div>

          {/* Clear Watchlist */}
          <div className="flex flex-col justify-between rounded-2xl border border-zinc-900 bg-zinc-950/20 p-5">
            <div>
              <h3 className="mb-1 text-sm font-bold text-white">
                Clear Watchlist
              </h3>
              <p className="mb-4 text-xs text-zinc-500">
                Delete all movies and TV shows from your watchlist.
              </p>
            </div>
            <Button
              type="button"
              disabled={clearingWatchlist}
              onClick={handleClearWatchlist}
              className="h-10 w-full cursor-pointer rounded-xl bg-zinc-800 text-xs font-semibold text-white transition-all hover:bg-zinc-700 active:scale-[0.98]"
            >
              {clearingWatchlist ? (
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              ) : (
                "Clear Watchlist Data"
              )}
            </Button>
          </div>

          {/* Clear Favorites */}
          <div className="flex flex-col justify-between rounded-2xl border border-zinc-900 bg-zinc-950/20 p-5">
            <div>
              <h3 className="mb-1 text-sm font-bold text-white">
                Clear Favorites
              </h3>
              <p className="mb-4 text-xs text-zinc-500">
                Delete all items from your favorites list.
              </p>
            </div>
            <Button
              type="button"
              disabled={clearingFavorites}
              onClick={handleClearFavorites}
              className="h-10 w-full cursor-pointer rounded-xl bg-zinc-800 text-xs font-semibold text-white transition-all hover:bg-zinc-700 active:scale-[0.98]"
            >
              {clearingFavorites ? (
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              ) : (
                "Clear Favorites Data"
              )}
            </Button>
          </div>

          {/* Clear Ratings */}
          <div className="flex flex-col justify-between rounded-2xl border border-zinc-900 bg-zinc-950/20 p-5">
            <div>
              <h3 className="mb-1 text-sm font-bold text-white">
                Clear Ratings
              </h3>
              <p className="mb-4 text-xs text-zinc-500">
                Delete all ratings and clear ratings from your diary logs.
              </p>
            </div>
            <Button
              type="button"
              disabled={clearingRatings}
              onClick={handleClearRatings}
              className="h-10 w-full cursor-pointer rounded-xl bg-zinc-800 text-xs font-semibold text-white transition-all hover:bg-zinc-700 active:scale-[0.98]"
            >
              {clearingRatings ? (
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              ) : (
                "Clear Ratings Data"
              )}
            </Button>
          </div>
        </div>
      </div>

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
            <Label className="mb-1 block text-left text-xs font-semibold tracking-wider text-zinc-400">
              Type <span className="text-white">"Delete My Account"</span> to
              Confirm
            </Label>
            <Input
              type="text"
              required
              placeholder="Delete My Account"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="placeholder-zinc-650 w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 px-4 py-6 text-left text-sm text-white outline-hidden transition-all focus:border-red-500/30 focus:bg-zinc-900"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={
            deletingAccount || deleteConfirmation !== "Delete My Account"
          }
          className="bg-red-955 mt-6 h-12 w-full cursor-pointer rounded-2xl border border-red-900/50 text-sm font-semibold text-red-200 transition-all duration-200 hover:bg-red-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
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
