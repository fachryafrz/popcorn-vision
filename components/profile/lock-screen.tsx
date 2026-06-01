"use client";

import React from "react";
import { Lock } from "lucide-react";

interface LockScreenProps {
  isFriendsOnly: boolean;
}

export function LockScreen({ isFriendsOnly }: LockScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 bg-zinc-900/10 border border-zinc-900 rounded-3xl text-center gap-4 backdrop-blur-md">
      <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
        <Lock className="h-8 w-8" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-zinc-300">This Profile is Private</h2>
        <p className="text-zinc-550 text-sm mt-1 max-w-md">
          {isFriendsOnly 
            ? "Send a friend request to see their favorite titles, watchlist, and ratings." 
            : "You must be approved to view this user's activities."}
        </p>
      </div>
    </div>
  );
}
