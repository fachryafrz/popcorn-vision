import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Users, LogOut, Trash2, Volume2, VolumeX, UserX, Loader2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChatItem, ChatMember, ChatMessage } from "./types";
import { useConfirm } from "@/components/ui/confirm-provider";

interface DetailsPanelProps {
  activeChat: ChatItem;
  activeChatMembers: ChatMember[] | undefined;
  sharedMediaList: ChatMessage[];
  showRightPanel: boolean;
  setShowRightPanel: (show: boolean) => void;
  setIsInviteFriendsOpen: (open: boolean) => void;
  setSelectedInvitedUsers: (users: Set<string>) => void;
  handleLeaveGroup: () => void;
  handleDeleteChat: () => void;
  currentUserId: string;
  handleToggleMute: () => void | Promise<void>;
  onBlockSuccess?: () => void;
}

export default function DetailsPanel({
  activeChat,
  activeChatMembers,
  sharedMediaList,
  showRightPanel,
  setShowRightPanel,
  setIsInviteFriendsOpen,
  setSelectedInvitedUsers,
  handleLeaveGroup,
  handleDeleteChat,
  currentUserId,
  handleToggleMute,
  onBlockSuccess,
}: DetailsPanelProps) {
  const router = useRouter();
  const confirm = useConfirm();
  const blockUser = useMutation(api.social.blockUser);
  const [blockLoading, setBlockLoading] = useState(false);

  const handleBlockUser = async () => {
    if (!activeChat.friend?.userId) return;
    if (
      !(await confirm({
        title: "Block User",
        description: `Are you sure you want to block ${activeChat.friend.name}? You will no longer be able to message each other, and they will be removed from your friends.`,
        confirmText: "Block",
      }))
    ) {
      return;
    }
    setBlockLoading(true);
    try {
      await blockUser({ targetUserId: activeChat.friend.userId });
      toast.success(`${activeChat.friend.name} has been blocked.`);
      onBlockSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to block user.");
    } finally {
      setBlockLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-y-0 right-0 z-30 flex w-full shrink-0 scrollbar-thin flex-col space-y-6 overflow-y-auto border-l border-zinc-900 bg-zinc-950 p-5 shadow-2xl transition-transform duration-300 select-none sm:relative sm:w-[280px] sm:shadow-none",
        showRightPanel
          ? "pointer-events-auto translate-x-0"
          : "pointer-events-none translate-x-full sm:hidden",
      )}
    >
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <h3 className="text-xs font-black tracking-wider text-zinc-400 uppercase">
          Details
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowRightPanel(false)}
          className="h-6 w-6 text-zinc-500 hover:text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Group details or direct friend profile */}
      {activeChat.type === "group" ? (
        <div className="space-y-5">
          <div className="text-center">
            <Avatar className="mx-auto h-16 w-16 border border-zinc-800">
              {activeChat.image ? (
                <AvatarImage
                  src={activeChat.image}
                  alt={activeChat.name}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="bg-zinc-900 text-lg font-bold text-zinc-300">
                <Users className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <h4 className="mt-3 truncate text-xs font-black text-white">
              {activeChat.name}
            </h4>
            {activeChat.description && (
              <p className="mx-auto mt-1 max-w-xs text-[10px] text-zinc-500 italic">
                &ldquo;{activeChat.description}&rdquo;
              </p>
            )}
          </div>

          {/* Group members list */}
          <div className="space-y-2.5">
            <h5 className="text-zinc-550 flex items-center justify-between text-[9px] font-black tracking-wider uppercase">
              <span>Group Members ({activeChatMembers?.length || 0})</span>
              <button
                onClick={() => {
                  setSelectedInvitedUsers(new Set());
                  setIsInviteFriendsOpen(true);
                }}
                className="text-primary cursor-pointer hover:text-primary/50"
              >
                + Add
              </button>
            </h5>
            <div className="max-h-48 scrollbar-thin space-y-2 overflow-y-auto p-0.5">
              {activeChatMembers?.map((m) => {
                const isAdmin = activeChat.adminIds?.includes(m.userId);
                return (
                  <div
                    key={m.userId}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 shrink-0 border border-zinc-900">
                        {m.image && (
                          <AvatarImage
                            src={m.image}
                            alt={m.name}
                            className="object-cover"
                          />
                        )}
                        <AvatarFallback className="bg-zinc-900 text-[8px] text-zinc-400">
                          {m.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="max-w-[120px] truncate text-left">
                        <span className="block truncate leading-none font-bold text-zinc-300">
                          {m.name}
                        </span>
                        <span className="text-zinc-550 mt-0.5 block truncate text-[8px]">
                          @{m.username}
                        </span>
                      </div>
                    </div>
                    {isAdmin && (
                      <span className="text-primary shrink-0 scale-90 rounded-full border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[8px] font-bold uppercase">
                        Admin
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Group actions */}
          <div className="space-y-2 border-t border-zinc-900 pt-4">
            <Button
              onClick={handleToggleMute}
              variant="ghost"
              className="w-full cursor-pointer justify-start rounded-xl text-xs font-bold text-zinc-400 hover:bg-zinc-900 hover:text-white"
            >
              {activeChat.isMuted ? (
                <>
                  <Volume2 className="mr-2 h-4 w-4" />
                  Unmute Chat
                </>
              ) : (
                <>
                  <VolumeX className="mr-2 h-4 w-4" />
                  Mute Chat
                </>
              )}
            </Button>
            <Button
              onClick={handleLeaveGroup}
              variant="ghost"
              className="w-full cursor-pointer justify-start rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/20 hover:text-red-300"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Leave Group Chat
            </Button>
            {activeChat.adminIds?.includes(currentUserId) && (
              <Button
                onClick={handleDeleteChat}
                variant="ghost"
                className="w-full cursor-pointer justify-start rounded-xl text-xs font-bold text-red-500 hover:bg-red-950/35 hover:text-red-400"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Group Chat
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Private Chat details */}
          <div className="text-center">
            <Avatar className="mx-auto h-16 w-16 border border-zinc-800">
              {activeChat.friend?.image ? (
                <AvatarImage
                  src={activeChat.friend.image}
                  alt={activeChat.friend.name}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="bg-zinc-900 text-lg font-bold text-zinc-300">
                {activeChat.friend?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h4 className="mt-3 truncate text-xs font-black text-white">
              {activeChat.friend?.name}
            </h4>
            <span className="text-zinc-550 mt-0.5 block text-[10px] font-bold tracking-wider uppercase">
              @{activeChat.friend?.username}
            </span>
          </div>

          <div className="space-y-2 border-t border-zinc-900 pt-4">
            <Button
              onClick={handleToggleMute}
              variant="ghost"
              className="w-full cursor-pointer justify-start rounded-xl text-xs font-bold text-zinc-400 hover:bg-zinc-900 hover:text-white"
            >
              {activeChat.isMuted ? (
                <>
                  <Volume2 className="mr-2 h-4 w-4" />
                  Unmute Chat
                </>
              ) : (
                <>
                  <VolumeX className="mr-2 h-4 w-4" />
                  Mute Chat
                </>
              )}
            </Button>
            <Button
              onClick={handleDeleteChat}
              variant="ghost"
              className="w-full cursor-pointer justify-start rounded-xl text-xs font-bold text-red-500 hover:bg-red-950/35 hover:text-red-400"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Chat
            </Button>
            <Button
              onClick={handleBlockUser}
              disabled={blockLoading}
              variant="ghost"
              className="w-full cursor-pointer justify-start rounded-xl text-xs font-bold text-red-500 hover:bg-red-950/35 hover:text-red-400"
            >
              {blockLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  <UserX className="mr-2 h-4 w-4" />
                  Block User
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Shared Media History display */}
      <div className="space-y-3 border-t border-zinc-900 pt-5">
        <h5 className="text-zinc-550 flex items-center justify-between text-[9px] font-black tracking-wider uppercase">
          <span>Shared Titles ({sharedMediaList.length})</span>
        </h5>
        {sharedMediaList.length === 0 ? (
          <p className="text-zinc-650 text-left text-[10px] italic">
            No movies or TV shows shared yet.
          </p>
        ) : (
          <div className="grid max-h-48 scrollbar-thin grid-cols-3 gap-2 overflow-y-auto p-0.5">
            {sharedMediaList.map((msg) => {
              const posterUrl = msg.sharedMediaPoster
                ? `https://image.tmdb.org/t/p/w92${msg.sharedMediaPoster}`
                : "/logo/popcorn.png";
              return (
                <div
                  key={msg._id}
                  onClick={() =>
                    router.push(`/${msg.sharedMediaType}/${msg.sharedMediaId}`)
                  }
                  className="border-zinc-850 hover:border-zinc-650 aspect-2/3 cursor-pointer overflow-hidden rounded-lg border bg-zinc-900 shadow-inner transition-colors"
                  title={msg.sharedMediaTitle}
                >
                  <img
                    src={posterUrl}
                    alt={msg.sharedMediaTitle}
                    className="h-full w-full object-cover"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
