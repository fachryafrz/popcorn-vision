"use client";

import React from "react";
import { Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { ProfileFriend } from "./types";

interface FriendsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  friendCount: number;
  friends: ProfileFriend[] | undefined;
}

export function FriendsDialog({
  isOpen,
  onOpenChange,
  friendCount,
  friends,
}: FriendsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] flex-col overflow-hidden sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-left text-lg font-bold">
            <Users className="text-primary h-5 w-5" />
            Friends ({friendCount})
          </DialogTitle>
        </DialogHeader>
        <div className="-mx-6 flex-1 overflow-y-auto px-6">
          {friends && friends.length > 0 ? (
            <div className="space-y-1">
              {friends.map((friend) => (
                <Link
                  key={friend.userId}
                  href={`/user/${friend.username}`}
                  onClick={() => onOpenChange(false)}
                  className="group/friend flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-zinc-900/50"
                >
                  <Avatar className="group-hover/friend:border-primary/50 h-10 w-10 shrink-0 border-2 border-zinc-800 transition-colors">
                    {friend.image && (
                      <AvatarImage
                        src={friend.image}
                        alt={friend.name}
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback className="bg-zinc-900 text-sm font-bold text-zinc-400">
                      {friend.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="group-hover/friend:text-primary truncate text-sm font-bold text-white transition-colors">
                      {friend.name}
                    </p>
                    <p className="text-zinc-550 truncate text-xs">
                      @{friend.username}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="mb-3 h-10 w-10 text-zinc-700" />
              <p className="text-sm font-medium text-zinc-500">
                No friends yet
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
