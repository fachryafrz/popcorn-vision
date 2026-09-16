"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ListCreator } from "./types";
import { siteConfig } from "@/config/site";

interface FriendUser {
  userId: string;
  name: string;
  username?: string;
  image?: string;
}

interface ManageCollaboratorsDialogProps {
  isInviteOpen: boolean;
  setIsInviteOpen: (open: boolean) => void;
  isMembersOpen: boolean;
  setIsMembersOpen: (open: boolean) => void;
  friends: FriendUser[];
  collaborators: ListCreator[];
  creator: ListCreator | null;
  currentUserId?: string;
  isOwner: boolean;
  onInvite: (userId: string, name: string) => void;
  onRemoveMember: (userId: string, name: string) => void;
}

export default function ManageCollaboratorsDialog({
  isInviteOpen,
  setIsInviteOpen,
  isMembersOpen,
  setIsMembersOpen,
  friends,
  collaborators,
  creator,
  currentUserId,
  isOwner,
  onInvite,
  onRemoveMember,
}: ManageCollaboratorsDialogProps) {
  const availableFriends = friends.filter(
    (friend) => !collaborators.some((c) => c.userId === friend.userId),
  );

  return (
    <>
      {/* Invite Collaborator Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Add Collaborators
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[300px] space-y-4 overflow-y-auto py-4 pr-1">
            {friends.length === 0 ? (
              <p className="py-6 text-center text-sm text-zinc-500">
                Add friends on {siteConfig.name} first to invite them to
                collaborate!
              </p>
            ) : availableFriends.length === 0 ? (
              <p className="py-6 text-center text-sm text-zinc-500">
                All your friends are already collaborators!
              </p>
            ) : (
              availableFriends.map((friend) => (
                <div
                  key={friend.userId}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-zinc-800">
                      {friend.image && (
                        <AvatarImage src={friend.image} alt={friend.name} />
                      )}
                      <AvatarFallback className="bg-primary text-xs font-bold text-white">
                        {friend.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {friend.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        @{friend.username}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="xs"
                    onClick={() => onInvite(friend.userId, friend.name)}
                    className="rounded-lg bg-white text-black hover:bg-zinc-200"
                  >
                    Add
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* View Members / Collaborators Dialog */}
      <Dialog open={isMembersOpen} onOpenChange={setIsMembersOpen}>
        <DialogContent className="max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              List Collaborators
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[300px] space-y-4 overflow-y-auto py-4 pr-1">
            {collaborators.map((collab) => {
              const isCollabCreator = collab.userId === creator?.userId;
              const canRemove =
                (isOwner && !isCollabCreator) ||
                collab.userId === currentUserId;
              return (
                <div
                  key={collab.userId}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-zinc-800">
                      {collab.image && (
                        <AvatarImage src={collab.image} alt={collab.name} />
                      )}
                      <AvatarFallback className="bg-primary text-xs font-bold text-white">
                        {collab.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="flex items-center gap-1 text-sm font-bold text-white">
                        {collab.name}
                        {isCollabCreator && (
                          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[10px] font-extrabold text-zinc-400 uppercase">
                            Owner
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-zinc-500">
                        @{collab.username}
                      </p>
                    </div>
                  </div>

                  {canRemove && (
                    <Button
                      size="xs"
                      variant="destructive"
                      onClick={() =>
                        onRemoveMember(collab.userId, collab.name)
                      }
                      className="h-8 rounded-lg"
                    >
                      {collab.userId === currentUserId ? "Leave" : "Remove"}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
