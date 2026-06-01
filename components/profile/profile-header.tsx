"use client";

import React from "react";
import { Users, Loader2, UserPlus, UserCheck, UserX } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserDoc } from "./types";

interface ProfileHeaderProps {
  targetUser: UserDoc | null;
  friendCount: number;
  friendshipStatus: string;
  isOwner: boolean;
  friendLoading: boolean;
  handleFriendAction: () => void;
  setShowFriendsDialog: (show: boolean) => void;
}

export function ProfileHeader({
  targetUser,
  friendCount,
  friendshipStatus,
  isOwner,
  friendLoading,
  handleFriendAction,
  setShowFriendsDialog,
}: ProfileHeaderProps) {
  // Determine Friend Button style & content
  let friendLabel = "Add Friend";
  let FriendIcon = UserPlus;
  let friendVariant: "default" | "secondary" | "outline" | "destructive" = "outline";

  if (friendshipStatus === "request_sent") {
    friendLabel = "Cancel Request";
    FriendIcon = UserX;
    friendVariant = "secondary";
  } else if (friendshipStatus === "request_received") {
    friendLabel = "Accept Request";
    FriendIcon = UserCheck;
    friendVariant = "default";
  } else if (friendshipStatus === "friends") {
    friendLabel = "Friends";
    FriendIcon = UserCheck;
    friendVariant = "outline";
  }

  return (
    <div className="relative rounded-3xl mb-8 flex flex-col items-stretch overflow-hidden border border-zinc-900 bg-zinc-900/10 backdrop-blur-md shadow-lg shadow-black/40 transition-all duration-350 z-10">
      {/* Profile Details Content Overlay */}
      <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 grow min-w-0 w-full">
          <Avatar className="h-20 w-20 sm:h-28 sm:w-28 border-4 border-background bg-background shadow-xl shrink-0 z-10">
            {targetUser?.image && (
              <AvatarImage src={targetUser.image} alt={targetUser?.name} className="object-cover" />
            )}
            <AvatarFallback className="bg-primary text-primary-foreground font-black text-2xl flex items-center justify-center h-full w-full">
              {targetUser?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="grow min-w-0 w-full pt-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white truncate drop-shadow-sm">
              {targetUser?.name}
            </h1>
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-2 gap-y-1 mt-1">
              <span className="text-primary font-semibold text-sm">@{targetUser?.username}</span>
              {targetUser?.country && (
                <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {targetUser?.country}
                </span>
              )}
            </div>
            {targetUser?.bio && (
              <p className="text-zinc-300 text-sm mt-3 max-w-xl italic">
                &ldquo;{targetUser.bio}&rdquo;
              </p>
            )}
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2 mt-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              <button
                onClick={() => setShowFriendsDialog(true)}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Users className="h-3.5 w-3.5" />
                {friendCount} Friends
              </button>
            </div>
          </div>
        </div>

        {/* Social Buttons */}
        {!isOwner && (
          <div className="flex flex-row sm:flex-col gap-2 shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
            <Button
              variant={friendVariant}
              disabled={friendLoading}
              onClick={handleFriendAction}
              className="flex-1 sm:flex-initial rounded-xl px-5 h-10 text-xs font-bold transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            >
              {friendLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <FriendIcon className="h-4 w-4 mr-1.5" />
                  {friendLabel}
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
