import React from "react";
import { useRouter } from "next/navigation";
import {
  Send,
  Search,
  Smile,
  X,
  Check,
  CheckCheck,
  Loader2,
  Users,
  Info,
  Film,
  Bookmark,
  ChevronRight,
  Grid,
  Pencil,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import moment from "moment";
import { toast } from "sonner";
import { TMDBMedia } from "@/lib/tmdb";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { ChatItem, ChatMessage, ChatMember } from "./types";
import { Id } from "@/convex/_generated/dataModel";

interface ChatWorkspaceProps {
  selectedChatId: Id<"chats"> | null;
  activeChat: ChatItem | null;
  currentUserId: string;
  activeChatMessages: ChatMessage[] | undefined;
  activeChatMembers: ChatMember[] | undefined;
  activeChatTyping: string[] | undefined;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredMessages: ChatMessage[];
  messageText: string;
  setMessageText: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: (e: React.FormEvent) => void;
  handleTyping: () => void;
  setIsGIFPickerOpen: (open: boolean) => void;
  showRightPanel: boolean;
  setShowRightPanel: (show: boolean) => void;
  setIsSidebarOpen: (open: boolean) => void;
  editingMessageId: Id<"messages"> | null;
  setEditingMessageId: (id: Id<"messages"> | null) => void;
  editingText: string;
  setEditingText: (text: string) => void;
  handleUpdateMessage: (id: Id<"messages">) => void;
  messageEndRef: React.RefObject<HTMLDivElement | null>;
  activeContextMenuMessageId: string | null;
  setActiveContextMenuMessageId: (id: string | null) => void;
  handleDeleteMessage: (id: Id<"messages">) => void;
  onQuickView: (media: TMDBMedia) => void;
}

export default function ChatWorkspace({
  selectedChatId,
  activeChat,
  currentUserId,
  activeChatMessages,
  activeChatMembers,
  activeChatTyping,
  searchQuery,
  setSearchQuery,
  filteredMessages,
  messageText,
  setMessageText,
  handleSendMessage,
  handleTyping,
  setIsGIFPickerOpen,
  showRightPanel,
  setShowRightPanel,
  setIsSidebarOpen,
  editingMessageId,
  setEditingMessageId,
  editingText,
  setEditingText,
  handleUpdateMessage,
  messageEndRef,
  activeContextMenuMessageId,
  setActiveContextMenuMessageId,
  handleDeleteMessage,
  onQuickView,
}: ChatWorkspaceProps) {
  const router = useRouter();

  if (!selectedChatId || !activeChat) {
    return (
      <div className="flex grow flex-col items-center justify-center space-y-4 p-6 text-center">
        <div className="text-zinc-650 flex h-16 w-16 items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900 shadow-xl select-none">
          <Users className="h-8 w-8 text-blue-500" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white">POVI Chat</h2>
          <p className="text-zinc-550 mt-1 max-w-sm text-xs">
            Chat in real-time with movie friends! Share lists, DMs, react with
            GIFs, and verify active streaming providers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-between overflow-hidden bg-zinc-950/20">
      {/* Header controls of active room */}
      <div className="flex items-center justify-between border-b border-zinc-900 bg-zinc-950 p-4 select-none">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="h-8 w-8 cursor-pointer text-zinc-400 sm:hidden"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
          </Button>
          <div className="relative">
            <Avatar className="h-9 w-9 shrink-0 border border-zinc-800">
              {activeChat.type === "group" ? (
                activeChat.image ? (
                  <AvatarImage
                    src={activeChat.image}
                    alt={activeChat.name}
                    className="object-cover"
                  />
                ) : null
              ) : activeChat.friend?.image ? (
                <AvatarImage
                  src={activeChat.friend.image}
                  alt={activeChat.friend.name}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="bg-zinc-900 text-xs font-bold text-zinc-300">
                {activeChat.type === "group" ? (
                  <Users className="h-4 w-4" />
                ) : (
                  activeChat.friend?.name.charAt(0).toUpperCase()
                )}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="text-left">
            <h2 className="text-xs leading-none font-black text-white">
              {activeChat.type === "group"
                ? activeChat.name
                : activeChat.friend?.name}
            </h2>
            {activeChatTyping && activeChatTyping.length > 0 ? (
              <span className="mt-1 block animate-pulse text-[9px] font-bold text-blue-400 italic">
                {activeChat.type === "group"
                  ? `${activeChatTyping.join(", ")} is typing...`
                  : "typing..."}
              </span>
            ) : (
              <span className="mt-1 block text-[9px] font-bold tracking-wider text-zinc-500 uppercase">
                {activeChat.type === "group"
                  ? "Group Chat"
                  : `@${activeChat.friend?.username}`}
              </span>
            )}
          </div>
        </div>

        {/* Sidebar toggle buttons */}
        <div className="flex items-center gap-1.5">
          <div className="relative hidden max-w-44 md:block">
            <Search className="text-zinc-650 absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-900 bg-zinc-950 py-1.5 pr-3 pl-8 text-xs text-white placeholder-zinc-600 outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-zinc-500"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowRightPanel(!showRightPanel)}
            className="h-8 w-8 cursor-pointer text-zinc-400 hover:text-white"
            title="Toggle details"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Scrollable messages history viewport */}
      <div className="flex flex-1 scrollbar-thin flex-col overflow-y-auto p-4">
        {!activeChatMessages ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="text-zinc-550 text-[10px] font-bold tracking-wider uppercase">
              Loading message log...
            </span>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="space-y-2 px-6 py-20 text-center">
            <Smile className="mx-auto h-10 w-10 text-zinc-800" />
            <p className="text-zinc-550 text-xs font-semibold">
              {searchQuery
                ? "No messages match search query"
                : "No messages shared yet"}
            </p>
            <p className="text-zinc-650 text-[10px]">
              {searchQuery
                ? "Try clearing search"
                : "Type below to spark a conversation!"}
            </p>
          </div>
        ) : (
          filteredMessages.map((msg, index) => {
            const isMe = msg.senderId === currentUserId;
            const isPrevSame =
              index > 0 &&
              filteredMessages[index - 1].senderId === msg.senderId;
            const isNextSame =
              index < filteredMessages.length - 1 &&
              filteredMessages[index + 1].senderId === msg.senderId;
            const showAvatar = !isPrevSame;

            return (
              <ContextMenu
                key={msg._id}
                onOpenChange={(open) => {
                  setActiveContextMenuMessageId(open ? msg._id : null);
                }}
              >
                <ContextMenuTrigger
                  className={cn(
                    "block w-full rounded-2xl px-3 transition-all duration-300",
                    isPrevSame ? "mt-0.5 py-0.5" : "mt-3 py-1",
                    activeContextMenuMessageId === msg._id &&
                      "scale-[1.01] bg-white/10 shadow-lg",
                  )}
                >
                  <div
                    className={cn(
                      "group/msg relative flex max-w-[85%] gap-3 sm:max-w-[70%]",
                      isMe ? "ml-auto flex-row-reverse" : "mr-auto",
                    )}
                  >
                    {/* Message Avatar */}
                    <div className={cn("w-8 shrink-0", isMe && "hidden")}>
                      {showAvatar && !isMe && (
                        <Avatar className="h-8 w-8 border border-zinc-800">
                          {msg.senderImage && (
                            <AvatarImage
                              src={msg.senderImage}
                              alt={msg.senderName}
                              className="object-cover"
                            />
                          )}
                          <AvatarFallback className="bg-zinc-900 text-[10px] font-bold text-zinc-300">
                            {msg.senderName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>

                    {/* Message Balloon */}
                    <div className="flex max-w-full flex-col gap-1">
                      {showAvatar && !isMe && (
                        <span className="pl-1 text-left text-[9px] font-bold text-zinc-500">
                          {msg.senderName}
                        </span>
                      )}

                      <div
                        className={cn(
                          "flex max-w-full items-center gap-2",
                          isMe && "justify-end",
                        )}
                      >
                        <div
                          className={cn(
                            "relative max-w-full shrink-0 p-3.5 text-left text-xs transition-all duration-300",
                            isMe
                              ? cn(
                                  "bg-blue-600 text-white",
                                  !isPrevSame &&
                                    !isNextSame &&
                                    "rounded-2xl rounded-br-[4px]",
                                  !isPrevSame &&
                                    isNextSame &&
                                    "rounded-2xl rounded-br-[4px]",
                                  isPrevSame &&
                                    isNextSame &&
                                    "rounded-l-2xl rounded-r-[4px]",
                                  isPrevSame &&
                                    !isNextSame &&
                                    "rounded-2xl rounded-tr-[4px] rounded-br-[4px]",
                                )
                              : cn(
                                  "border-zinc-850/60 border bg-zinc-900 text-zinc-200",
                                  !isPrevSame &&
                                    !isNextSame &&
                                    "rounded-2xl rounded-bl-[4px]",
                                  !isPrevSame &&
                                    isNextSame &&
                                    "rounded-2xl rounded-bl-[4px]",
                                  isPrevSame &&
                                    isNextSame &&
                                    "rounded-l-[4px] rounded-r-2xl",
                                  isPrevSame &&
                                    !isNextSame &&
                                    "rounded-2xl rounded-tl-[4px] rounded-bl-[4px]",
                                ),
                          )}
                        >
                          {/* Main Text Content */}
                          {editingMessageId === msg._id ? (
                            <div className="flex max-w-full min-w-[180px] flex-col gap-2">
                              <textarea
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 p-2 text-xs text-white outline-hidden focus:border-blue-500/50"
                                rows={2}
                                autoFocus
                              />
                              <div className="flex justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setEditingMessageId(null)}
                                  className="bg-zinc-850 cursor-pointer rounded-lg px-2 py-1 text-[10px] font-bold text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateMessage(msg._id)}
                                  className="cursor-pointer rounded-lg bg-blue-600 px-2 py-1 text-[10px] font-bold text-white transition-colors hover:bg-blue-500"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {msg.content && (
                                <p className="leading-relaxed wrap-break-word whitespace-pre-wrap">
                                  {msg.content}
                                  {msg.editedAt && (
                                    <span className="ml-1.5 text-[8px] font-bold text-zinc-500 lowercase italic select-none">
                                      (edited)
                                    </span>
                                  )}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* GIF Image displays */}
                      {msg.attachmentType === "gif" && msg.attachmentUrl && (
                        <div className="relative mt-2 max-h-48 max-w-64 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-lg">
                          <img
                            src={msg.attachmentUrl}
                            alt="Reaction GIF"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}

                      {/* Movie/Show Share cards */}
                      {msg.attachmentType === "media" && msg.sharedMediaId && (
                        <div className="border-zinc-850 mt-3 flex max-w-64 flex-col items-stretch overflow-hidden rounded-2xl border bg-zinc-950 shadow-2xl">
                          <div className="flex gap-3 p-2.5">
                            <div className="border-zinc-850 aspect-2/3 w-16 shrink-0 overflow-hidden rounded-lg border bg-zinc-900">
                              {msg.sharedMediaPoster ? (
                                <img
                                  src={`https://image.tmdb.org/t/p/w185${msg.sharedMediaPoster}`}
                                  alt={msg.sharedMediaTitle}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-zinc-600">
                                  <Film className="h-6 w-6" />
                                </div>
                              )}
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col justify-center text-left">
                              <h4 className="truncate text-xs leading-tight font-black text-white">
                                {msg.sharedMediaTitle}
                              </h4>
                              <span className="mt-1 text-[9px] font-bold text-zinc-500 uppercase">
                                {msg.sharedMediaType === "tv"
                                  ? "TV Series"
                                  : "Movie"}
                                {msg.sharedMediaYear
                                  ? ` • ${msg.sharedMediaYear}`
                                  : ""}
                              </span>
                              {msg.sharedMediaRating !== undefined &&
                                msg.sharedMediaRating > 0 && (
                                  <div className="mt-1 flex items-center gap-1 text-[9px] font-black text-yellow-400">
                                    <Bookmark className="h-3 w-3 fill-current" />
                                    <span>
                                      {msg.sharedMediaRating.toFixed(1)}/10
                                    </span>
                                  </div>
                                )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 border-t border-zinc-900 bg-zinc-900/30 text-[9px] font-bold tracking-wider uppercase">
                            <button
                              onClick={() =>
                                router.push(
                                  `/${msg.sharedMediaType}/${msg.sharedMediaId}`,
                                )
                              }
                              className="cursor-pointer border-r border-zinc-900 py-2.5 text-center text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => {
                                onQuickView({
                                  id: Number(msg.sharedMediaId),
                                  media_type: msg.sharedMediaType as "movie" | "tv",
                                  title: msg.sharedMediaTitle || "",
                                  name: msg.sharedMediaTitle || "",
                                  poster_path: msg.sharedMediaPoster || "",
                                  vote_average: msg.sharedMediaRating || 0,
                                  release_date: msg.sharedMediaYear || "",
                                  backdrop_path: "",
                                  genre_ids: [],
                                  overview: "",
                                  popularity: 0,
                                });
                              }}
                              className="cursor-pointer py-2.5 text-center text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Timestamp Details */}
                      <div
                        className={cn(
                          "mt-1 flex items-center gap-1.5 text-[9px] text-zinc-500 select-none",
                          isMe ? "justify-end pr-1" : "justify-start pl-1",
                        )}
                      >
                        <span>{moment(msg.createdAt).format("h:mm A")}</span>
                        {isMe && (
                          <span>
                            {activeChatMembers &&
                            activeChatMembers.every(
                              (m) =>
                                m.userId === currentUserId ||
                                (m.lastReadAt && m.lastReadAt >= msg.createdAt),
                            ) ? (
                              <CheckCheck className="h-3.5 w-3.5 stroke-3 text-blue-400" />
                            ) : (
                              <Check className="text-zinc-650 h-3.5 w-3.5" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </ContextMenuTrigger>

                <ContextMenuContent className="animate-in fade-in-50 zoom-in-95 z-50 min-w-40 rounded-2xl border border-zinc-800 bg-zinc-950 p-1.5 text-white shadow-2xl duration-200">
                  {isMe &&
                    !msg.sharedMediaId &&
                    msg.attachmentType !== "gif" && (
                      <ContextMenuItem
                        onClick={() => {
                          setEditingMessageId(msg._id);
                          setEditingText(msg.content);
                        }}
                        className="flex cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs text-zinc-300 hover:bg-zinc-900 hover:text-white"
                      >
                        <Pencil className="h-3.5 w-3.5 text-zinc-400" />
                        Edit Message
                      </ContextMenuItem>
                    )}
                  {isMe && (
                    <ContextMenuItem
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this message?")) {
                          handleDeleteMessage(msg._id);
                        }
                      }}
                      className="flex cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs text-red-400 hover:bg-red-950/20 hover:text-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-400" />
                      Delete Message
                    </ContextMenuItem>
                  )}
                  <ContextMenuItem
                    onClick={() => {
                      if (msg.content) {
                        navigator.clipboard
                          .writeText(msg.content)
                          .then(() => {
                            toast.success("Message copied to clipboard!");
                          })
                          .catch(() => {
                            toast.error("Failed to copy message");
                          });
                      }
                    }}
                    className="flex cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs text-zinc-300 hover:bg-zinc-900 hover:text-white"
                  >
                    <Bookmark className="h-3.5 w-3.5 text-zinc-400" />
                    Copy Content
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })
        )}

        {/* Real-time Typing Indicators */}
        {activeChatTyping && activeChatTyping.length > 0 && (
          <div className="text-zinc-550 flex animate-pulse items-center gap-2 py-1 pl-11 text-[10px] font-semibold italic select-none">
            <div className="flex gap-1">
              <span className="bg-zinc-650 h-1.5 w-1.5 animate-bounce rounded-full" />
              <span className="bg-zinc-650 h-1.5 w-1.5 animate-bounce rounded-full delay-150" />
              <span className="bg-zinc-650 h-1.5 w-1.5 animate-bounce rounded-full delay-300" />
            </div>
            <span>
              {activeChatTyping.join(", ")}{" "}
              {activeChatTyping.length === 1 ? "is typing..." : "are typing..."}
            </span>
          </div>
        )}

        <div ref={messageEndRef} />
      </div>

      {/* Input Message Area */}
      <form
        onSubmit={handleSendMessage}
        className="border-zinc-905 flex flex-col gap-3 border-t bg-zinc-950 p-4"
      >
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsGIFPickerOpen(true)}
            className="h-9 w-9 cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900/20 text-zinc-400 hover:text-white"
            title="Send reaction GIF"
          >
            <Grid className="h-4.5 w-4.5" />
          </Button>
          <div className="relative grow">
            <Input
              type="text"
              required
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
                handleTyping();
              }}
              className="border-zinc-850 placeholder-zinc-550 w-full rounded-xl border bg-zinc-900/30 py-5 pr-10 pl-4 text-left text-xs text-white outline-hidden transition-all focus:border-blue-500/50 focus:bg-zinc-900"
            />
            <button
              type="button"
              onClick={() => setMessageText((prev) => prev + " 🍿")}
              className="absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer text-sm text-zinc-500 hover:text-zinc-300"
            >
              🍿
            </button>
          </div>
          <Button
            type="submit"
            disabled={!messageText.trim()}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-blue-600 text-white transition-all hover:bg-blue-500 active:scale-95"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
