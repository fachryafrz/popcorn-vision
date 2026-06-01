import { useRouter } from "next/navigation";
import { X, Users, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChatItem, ChatMember, ChatMessage } from "./types";

interface DetailsPanelProps {
  activeChat: ChatItem;
  activeChatMembers: ChatMember[] | undefined;
  sharedMediaList: ChatMessage[];
  showRightPanel: boolean;
  setShowRightPanel: (show: boolean) => void;
  setIsInviteFriendsOpen: (open: boolean) => void;
  setSelectedInvitedUsers: (users: Set<string>) => void;
  handleLeaveGroup: () => void;
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
}: DetailsPanelProps) {
  const router = useRouter();

  return (
    <div
      className={cn(
        "w-full sm:w-[280px] shrink-0 border-l border-zinc-900 bg-zinc-950 flex flex-col overflow-y-auto p-5 space-y-6 scrollbar-thin select-none fixed sm:relative inset-y-0 right-0 transition-transform duration-300 z-30 shadow-2xl sm:shadow-none",
        showRightPanel
          ? "translate-x-0 pointer-events-auto"
          : "translate-x-full pointer-events-none sm:hidden"
      )}
    >
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">Details</h3>
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
            <Avatar className="h-16 w-16 mx-auto border border-zinc-800">
              {activeChat.image ? (
                <AvatarImage src={activeChat.image} alt={activeChat.name} className="object-cover" />
              ) : null}
              <AvatarFallback className="bg-zinc-900 text-zinc-300 font-bold text-lg">
                <Users className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <h4 className="text-xs font-black text-white mt-3 truncate">{activeChat.name}</h4>
            {activeChat.description && (
              <p className="text-[10px] text-zinc-500 mt-1 max-w-xs mx-auto italic">
                &ldquo;{activeChat.description}&rdquo;
              </p>
            )}
          </div>

          {/* Group members list */}
          <div className="space-y-2.5">
            <h5 className="text-[9px] font-black uppercase tracking-wider text-zinc-550 flex items-center justify-between">
              <span>Group Members ({activeChatMembers?.length || 0})</span>
              <button
                onClick={() => {
                  setSelectedInvitedUsers(new Set());
                  setIsInviteFriendsOpen(true);
                }}
                className="text-blue-400 hover:text-blue-300 cursor-pointer"
              >
                + Add
              </button>
            </h5>
            <div className="space-y-2 max-h-48 overflow-y-auto p-0.5 scrollbar-thin">
              {activeChatMembers?.map((m) => {
                const isAdmin = activeChat.adminIds?.includes(m.userId);
                return (
                  <div key={m.userId} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 border border-zinc-900 shrink-0">
                        {m.image && (
                          <AvatarImage src={m.image} alt={m.name} className="object-cover" />
                        )}
                        <AvatarFallback className="bg-zinc-900 text-zinc-400 text-[8px]">
                          {m.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="truncate text-left max-w-[120px]">
                        <span className="font-bold text-zinc-300 block truncate leading-none">
                          {m.name}
                        </span>
                        <span className="text-[8px] text-zinc-550 block truncate mt-0.5">
                          @{m.username}
                        </span>
                      </div>
                    </div>
                    {isAdmin && (
                      <span className="text-[8px] font-bold text-blue-400 bg-blue-950/20 border border-blue-900/30 px-1.5 py-0.5 rounded-full uppercase scale-90 shrink-0">
                        Admin
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Group actions */}
          <div className="pt-4 border-t border-zinc-900 space-y-2">
            <Button
              onClick={handleLeaveGroup}
              variant="ghost"
              className="w-full justify-start rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/20 hover:text-red-300 cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Leave Group Chat
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Private Chat details */}
          <div className="text-center">
            <Avatar className="h-16 w-16 mx-auto border border-zinc-800">
              {activeChat.friend?.image ? (
                <AvatarImage src={activeChat.friend.image} alt={activeChat.friend.name} className="object-cover" />
              ) : null}
              <AvatarFallback className="bg-zinc-900 text-zinc-300 font-bold text-lg">
                {activeChat.friend?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h4 className="text-xs font-black text-white mt-3 truncate">
              {activeChat.friend?.name}
            </h4>
            <span className="text-[10px] text-zinc-550 block mt-0.5 font-bold uppercase tracking-wider">
              @{activeChat.friend?.username}
            </span>
          </div>
        </div>
      )}

      {/* Shared Media History display */}
      <div className="pt-5 border-t border-zinc-900 space-y-3">
        <h5 className="text-[9px] font-black uppercase tracking-wider text-zinc-550 flex items-center justify-between">
          <span>Shared Titles ({sharedMediaList.length})</span>
        </h5>
        {sharedMediaList.length === 0 ? (
          <p className="text-[10px] text-zinc-650 italic text-left">
            No movies or TV shows shared yet.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-0.5 scrollbar-thin">
            {sharedMediaList.map((msg) => {
              const posterUrl = msg.sharedMediaPoster
                ? `https://image.tmdb.org/t/p/w92${msg.sharedMediaPoster}`
                : "/logo/popcorn.png";
              return (
                <div
                  key={msg._id}
                  onClick={() => router.push(`/${msg.sharedMediaType}/${msg.sharedMediaId}`)}
                  className="aspect-2/3 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-850 cursor-pointer hover:border-zinc-650 transition-colors shadow-inner"
                  title={msg.sharedMediaTitle}
                >
                  <img
                    src={posterUrl}
                    alt={msg.sharedMediaTitle}
                    className="w-full h-full object-cover"
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
