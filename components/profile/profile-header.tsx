"use client";

import React from "react";
import {
  Users,
  Loader2,
  UserPlus,
  UserCheck,
  UserX,
  MessageSquare,
  MoreVertical,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserRoleBadge } from "@/components/user-role-badge";
import { UserDoc } from "./types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface ProfileHeaderProps {
  targetUser: UserDoc | null;
  friendCount: number;
  friendshipStatus: string;
  isOwner: boolean;
  friendLoading: boolean;
  handleFriendAction: () => void;
  setShowFriendsDialog: (show: boolean) => void;
  handleBlockAction: () => void;
  blockLoading: boolean;
}

export function ProfileHeader({
  targetUser,
  friendCount,
  friendshipStatus,
  isOwner,
  friendLoading,
  handleFriendAction,
  setShowFriendsDialog,
  handleBlockAction,
  blockLoading,
}: ProfileHeaderProps) {
  // Determine Friend Button style & content
  let friendLabel = "Add Friend";
  let FriendIcon = UserPlus;
  let friendVariant: "default" | "secondary" | "outline" | "destructive" =
    "outline";

  if (friendshipStatus === "request_sent") {
    friendLabel = "Cancel Request";
    FriendIcon = UserX;
    friendVariant = "secondary";
  } else if (friendshipStatus === "request_received") {
    friendLabel = "Accept Request";
    FriendIcon = UserCheck;
    friendVariant = "default";
  } else if (friendshipStatus === "friends") {
    friendLabel = "Unfriend";
    FriendIcon = UserX;
    friendVariant = "outline";
  }

  return (
    <div className="relative z-10 mb-8 flex flex-col items-stretch overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-900/10 shadow-lg shadow-black/40 backdrop-blur-md transition-all duration-350">
      {/* Profile Details Content Overlay */}
      <div className="flex flex-col items-center justify-between gap-6 p-6 text-center sm:flex-row sm:items-end sm:p-8 sm:text-left">
        <div className="flex w-full min-w-0 grow flex-col items-center gap-6 sm:flex-row sm:items-start">
          <Avatar className="border-background bg-background z-10 h-20 w-20 shrink-0 border-4 shadow-xl sm:h-28 sm:w-28">
            {targetUser?.image && (
              <AvatarImage
                src={targetUser.image}
                alt={targetUser?.name}
                className="object-cover"
              />
            )}
            <AvatarFallback className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center text-2xl font-black">
              {targetUser?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="w-full min-w-0 grow pt-2">
            <h1 className="truncate text-2xl font-black tracking-tight text-white drop-shadow-sm sm:text-3xl">
              {targetUser?.name}
            </h1>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:justify-start">
              <span className="text-primary text-sm font-semibold">
                @{targetUser?.username}
              </span>
              <UserRoleBadge role={targetUser?.role} />
              {targetUser?.status === "suspended" && (
                <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-amber-400">
                  Suspended
                </span>
              )}
              {targetUser?.status === "banned" && (
                <span className="rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-rose-400">
                  Banned
                </span>
              )}
              {targetUser?.country && (
                <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  {targetUser?.country}
                </span>
              )}
            </div>
            {targetUser?.bio && (
              <p className="mt-3 max-w-xl text-sm text-zinc-300 italic">
                &ldquo;{targetUser.bio}&rdquo;
              </p>
            )}
            <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold tracking-wider text-zinc-400 uppercase sm:justify-start">
              <button
                onClick={() => setShowFriendsDialog(true)}
                className="flex cursor-pointer items-center gap-1.5 transition-colors hover:text-white"
              >
                <Users className="h-3.5 w-3.5" />
                {friendCount} Friends
              </button>
              {targetUser?._creationTime && (
                <span className="flex items-center gap-1.5 text-zinc-500">
                  <Calendar className="h-3.5 w-3.5" />
                  Member Since {new Date(targetUser._creationTime).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
              )}
            </div>

            {/* Social Buttons */}
            {!isOwner && (
              <div className="mt-5 flex w-full flex-row items-center justify-center gap-2 sm:w-auto sm:justify-start">
                <Button
                  variant={friendVariant}
                  disabled={friendLoading}
                  onClick={handleFriendAction}
                  className="h-10 flex-1 cursor-pointer rounded-xl px-5 text-xs font-bold transition-all duration-200 hover:scale-[1.02] sm:flex-initial"
                >
                  {friendLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <>
                      <FriendIcon className="mr-1.5 h-4 w-4" />
                      {friendLabel}
                    </>
                  )}
                </Button>
                {friendshipStatus === "friends" && targetUser && (
                  <Link
                    href={`/chat?userId=${targetUser.userId}`}
                    className="flex-1 sm:flex-initial"
                  >
                    <Button className="h-10 w-full cursor-pointer rounded-xl px-5 text-xs font-bold transition-all duration-200 hover:scale-[1.02]">
                      <MessageSquare className="mr-1.5 h-4 w-4" />
                      Chat
                    </Button>
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-zinc-800 text-zinc-400 transition-all duration-200 outline-none hover:scale-[1.02] hover:bg-zinc-800/50 hover:text-white">
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      variant="destructive"
                      disabled={blockLoading}
                      onClick={handleBlockAction}
                      className="cursor-pointer"
                    >
                      {blockLoading ? (
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <UserX className="mr-1.5 h-4 w-4" />
                      )}
                      Block User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
