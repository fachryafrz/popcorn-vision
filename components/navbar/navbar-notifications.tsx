"use client";

import { useState, useEffect, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Bell, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/components/ui/confirm-provider";
import { cn } from "@/lib/utils";

interface NavbarNotificationsProps {
  isLoggedIn: boolean;
  variant?: "desktop" | "mobile";
}

export function NavbarNotifications({
  isLoggedIn,
  variant = "desktop",
}: NavbarNotificationsProps) {
  const router = useRouter();
  const confirm = useConfirm();

  const notifications = useQuery(
    api.social.getNotifications,
    isLoggedIn ? {} : "skip",
  );
  const acceptFriendRequest = useMutation(api.social.acceptFriendRequest);
  const rejectFriendRequest = useMutation(api.social.rejectFriendRequest);
  const acceptListInvite = useMutation(api.customLists.acceptListInvite);
  const declineListInvite = useMutation(api.customLists.declineListInvite);
  const acceptGroupInvite = useMutation(api.chats.acceptGroupInvite);
  const declineGroupInvite = useMutation(api.chats.declineGroupInvite);
  const markRead = useMutation(api.social.markNotificationRead);
  const clearAll = useMutation(api.social.clearAllNotifications);

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  // Track current time in state so formatTime is pure during render
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (ts: number) => {
    const diff = now - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const handleClearAll = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const confirmed = await confirm({
      title: "Clear Notifications",
      description: "Clear all notifications?",
      confirmText: "Clear",
    });
    if (confirmed) {
      await clearAll();
    }
  };

  if (!isLoggedIn) return null;

  const isMobile = variant === "mobile";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "relative cursor-pointer rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 transition-all hover:border-zinc-700 hover:text-white focus:outline-none",
          isMobile ? "p-2 hover:border-zinc-700" : "p-2",
        )}
        aria-label="Notifications"
      >
        <Bell className={isMobile ? "h-5 w-5" : "h-4 w-4"} />
        {unreadCount > 0 && (
          <span
            className={cn(
              "ring-background bg-primary absolute -top-1 -right-1 flex items-center justify-center rounded-full text-[8px] font-black text-white ring-2",
              isMobile ? "h-4.5 w-4.5" : "h-4 w-4",
            )}
          >
            {unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className={cn(
          "animate-in fade-in-50 zoom-in-95 z-50 rounded-2xl border border-zinc-800 bg-zinc-950 p-1 text-white shadow-2xl shadow-black/60 duration-200",
          isMobile ? "w-76" : "w-80",
        )}
      >
        <div className="flex items-center justify-between px-3.5 py-2">
          <span className="text-[10px] font-black tracking-wider text-zinc-400 uppercase">
            Notifications
          </span>
          {notifications && notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex cursor-pointer items-center gap-1 text-[10px] font-bold text-zinc-500 transition-colors hover:text-red-400"
            >
              <Trash2 className="h-3 w-3" />
              Clear All
            </button>
          )}
        </div>

        <DropdownMenuSeparator className="my-1 bg-zinc-800" />

        <div className="max-h-80 overflow-y-auto py-1">
          {!notifications ? (
            <div className="flex items-center justify-center py-6 text-xs text-zinc-500">
              <Loader2 className="text-primary mr-2 h-4 w-4 animate-spin" />
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-zinc-500">
              <Bell className="h-8 w-8 text-zinc-800" />
              <span className="text-xs font-semibold">All caught up!</span>
            </div>
          ) : (
            notifications.map((notif) => {
              return (
                <div
                  key={notif._id}
                  onClick={async () => {
                    if (!notif.read) {
                      await markRead({ notifId: notif._id });
                    }
                    if (notif.type === "chat_message") {
                      if (notif.mediaId) {
                        localStorage.setItem(
                          "active_chat_id",
                          notif.mediaId,
                        );
                      }
                      router.push(`/chat`);
                    } else if (
                      notif.type === "comment_reply" ||
                      notif.type === "comment_mention"
                    ) {
                      if (notif.mediaType && notif.mediaId) {
                        router.push(
                          `/${notif.mediaType}/${notif.mediaId}`,
                        );
                      }
                    } else if (notif.sender) {
                      router.push(`/@${notif.sender.username}`);
                    }
                  }}
                  className={cn(
                    "group relative flex cursor-pointer items-start gap-3 rounded-xl border border-transparent p-3 transition-all hover:border-zinc-800/40 hover:bg-zinc-900",
                    !notif.read ? "bg-primary/5 hover:bg-primary/10" : "",
                  )}
                >
                  <Avatar className="h-8 w-8 border border-zinc-800">
                    {notif.sender?.image && (
                      <AvatarImage
                        src={notif.sender.image}
                        alt={notif.sender.name}
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback className="bg-zinc-800 text-xs font-bold text-zinc-300">
                      {notif.sender?.name?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs leading-normal text-zinc-200">
                      <span className="font-bold text-white">
                        {notif.sender?.name}
                      </span>{" "}
                      {notif.type === "friend_request" &&
                        "sent you a friend request."}
                      {notif.type === "friend_accepted" &&
                        "accepted your friend request."}
                      {notif.type === "comment_reply" &&
                        "replied to your comment."}
                      {notif.type === "comment_mention" &&
                        "mentioned you in a comment."}
                      {notif.type === "chat_message" && (
                        <>
                          {notif.groupName
                            ? `sent a message in "${notif.groupName}":`
                            : "sent you a message:"}
                          <span className="mt-0.5 block max-w-full truncate font-normal text-zinc-400 italic">
                            &quot;{notif.chatMessageContent || "Message"}&quot;
                          </span>
                        </>
                      )}
                      {notif.type === "list_invite" &&
                        (notif.targetName
                          ? `invited you to collaborate on the list "${notif.targetName}".`
                          : "invited you to collaborate on a list.")}
                      {notif.type === "group_invite" &&
                        (notif.targetName
                          ? `invited you to join the group chat "${notif.targetName}".`
                          : "invited you to join a group chat.")}
                    </p>
                    <span className="mt-1 block text-[10px] font-semibold text-zinc-500">
                      {formatTime(notif.createdAt)}
                    </span>

                    {/* Friend Request Actions */}
                    {notif.type === "friend_request" && notif.sender && (
                      <div
                        className="mt-2 flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          size="xs"
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (notif.sender)
                              await acceptFriendRequest({
                                targetUserId: notif.sender.userId,
                              });
                          }}
                          className="hover:bg-primary bg-primary h-7 cursor-pointer rounded-lg px-3 text-[10px] font-bold text-white"
                        >
                          Accept
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (notif.sender)
                              await rejectFriendRequest({
                                targetUserId: notif.sender.userId,
                              });
                          }}
                          className="h-7 cursor-pointer rounded-lg border-zinc-800 px-3 text-[10px] font-bold text-zinc-400 hover:bg-zinc-900 hover:text-white"
                        >
                          Decline
                        </Button>
                      </div>
                    )}

                    {/* List Invite Actions */}
                    {notif.type === "list_invite" && notif.mediaId && (
                      <div
                        className="mt-2 flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          size="xs"
                          onClick={async (e) => {
                            e.stopPropagation();
                            await acceptListInvite({
                              listId: notif.mediaId as Id<"customLists">,
                            });
                            toast.success("List invitation accepted!");
                            router.push(`/lists/${notif.mediaId}`);
                          }}
                          className="hover:bg-primary bg-primary h-7 cursor-pointer rounded-lg px-3 text-[10px] font-bold text-white"
                        >
                          Accept
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={async (e) => {
                            e.stopPropagation();
                            await declineListInvite({
                              listId: notif.mediaId as Id<"customLists">,
                            });
                            toast.success("List invitation declined.");
                          }}
                          className="h-7 cursor-pointer rounded-lg border-zinc-800 px-3 text-[10px] font-bold text-zinc-400 hover:bg-zinc-900 hover:text-white"
                        >
                          Decline
                        </Button>
                      </div>
                    )}

                    {/* Group Invite Actions */}
                    {notif.type === "group_invite" && notif.mediaId && (
                      <div
                        className="mt-2 flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          size="xs"
                          onClick={async (e) => {
                            e.stopPropagation();
                            await acceptGroupInvite({
                              chatId: notif.mediaId as Id<"chats">,
                            });
                            localStorage.setItem(
                              "active_chat_id",
                              notif.mediaId!,
                            );
                            toast.success("Group invitation accepted!");
                            router.push(`/chat`);
                          }}
                          className="hover:bg-primary bg-primary h-7 cursor-pointer rounded-lg px-3 text-[10px] font-bold text-white"
                        >
                          Accept
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={async (e) => {
                            e.stopPropagation();
                            await declineGroupInvite({
                              chatId: notif.mediaId as Id<"chats">,
                            });
                            toast.success("Group invitation declined.");
                          }}
                          className="h-7 cursor-pointer rounded-lg border-zinc-800 px-3 text-[10px] font-bold text-zinc-400 hover:bg-zinc-900 hover:text-white"
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Mark read dot */}
                  {!notif.read && (
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        await markRead({ notifId: notif._id });
                      }}
                      className="hover:text-primary text-primary absolute top-2.5 right-2.5 cursor-pointer"
                      title="Mark as read"
                    >
                      <span className="bg-primary block h-1.5 w-1.5 rounded-full" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
