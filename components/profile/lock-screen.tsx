"use client";

import React from "react";
import { Lock } from "lucide-react";

interface LockScreenProps {
  isFriendsOnly: boolean;
}

export function LockScreen({ isFriendsOnly }: LockScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-zinc-900 bg-zinc-900/10 px-6 py-20 text-center backdrop-blur-md">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-500">
        <Lock className="h-8 w-8" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-zinc-300">
          This Profile is Private
        </h2>
        <p className="text-zinc-550 mt-1 max-w-md text-sm">
          {isFriendsOnly
            ? "Send a friend request to see their favorite titles, watchlist, and ratings."
            : "You must be approved to view this user's activities."}
        </p>
      </div>
    </div>
  );
}
