"use client";

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  Suspense,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { authClient } from "@/lib/auth-client";
import { Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useConfirm } from "@/components/ui/confirm-provider";
import { useAuthModalStore } from "@/lib/auth-modal-store";

// Import types and subcomponents
import {
  Friend,
  ChatMessage,
  ChatItem,
  ChatMember,
} from "@/components/chat/types";
import SidebarPanel from "@/components/chat/sidebar-panel";
import ChatWorkspace from "@/components/chat/chat-workspace";
import DetailsPanel from "@/components/chat/details-panel";
import ChatModals from "@/components/chat/chat-modals";
import QuickViewModal from "@/components/quick-view-modal";
import AuthModal from "@/components/auth-modal";
import { useQuickViewMediaState } from "@/hooks/use-query-modal-state";
import { TMDBMedia } from "@/lib/tmdb";
import { siteConfig } from "@/config/site";
import { STORAGE_KEYS } from "@/lib/constants";

function ChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const confirm = useConfirm();
  const {
    isOpen: isAuthOpen,
    open: openAuth,
    close: closeAuth,
  } = useAuthModalStore();
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const currentUserId = session.data?.user?.id;

  const [isSending, setIsSending] = useState(false);
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>([]);
  const [optimisticDeletions, setOptimisticDeletions] = useState<Set<Id<"messages">>>(new Set());
  const [optimisticEdits, setOptimisticEdits] = useState<Record<Id<"messages">, string>>({});
  const [optimisticMutes, setOptimisticMutes] = useState<Record<Id<"chats">, boolean>>({});

  // ----------------------------------------------------
  // CONVEX STATE QUERIES & MUTATIONS
  // ----------------------------------------------------
  const currentUserProfile = useQuery(
    api.users.getCurrentUser,
    isLoggedIn ? {} : "skip",
  );
  const rawChatsList = useQuery(
    api.chats.getChatsList,
    isLoggedIn ? {} : "skip",
  );

  // Cast raw Convex query output to strong local ChatItem interface
  const chats = useMemo(() => {
    if (!rawChatsList) return undefined;
    const items = rawChatsList as unknown as ChatItem[];
    return items.map((c) => {
      if (c.chatId in optimisticMutes) {
        return { ...c, isMuted: optimisticMutes[c.chatId] };
      }
      return c;
    });
  }, [rawChatsList, optimisticMutes]);

  // Get active friends list to start new chat
  const profileData = useQuery(
    api.social.getUserSocialProfile,
    currentUserProfile?.username
      ? { username: currentUserProfile.username }
      : "skip",
  );

  // Strictly cast friends profiles
  const friends = useMemo(() => {
    if (!profileData || !("friends" in profileData) || !profileData.friends) {
      return [];
    }
    return profileData.friends as Friend[];
  }, [profileData]);

  // Mutations
  const createOrGetPrivateChat = useMutation(api.chats.createOrGetPrivateChat);
  const createGroupChat = useMutation(api.chats.createGroupChat);
  const inviteToGroupChat = useMutation(api.chats.inviteToGroupChat);
  const leaveGroupChat = useMutation(api.chats.leaveGroupChat);
  const sendMessage = useMutation(api.chats.sendMessage);
  const editChatMessage = useMutation(api.chats.editMessage);
  const setReadReceipt = useMutation(api.chats.setReadReceipt);
  const setTypingStatus = useMutation(api.chats.setTypingStatus);
  const toggleMuteChat = useMutation(api.chats.toggleMuteChat);
  const reportUser = useMutation(api.chats.reportUser);
  const deleteChatMessage = useMutation(api.chats.deleteMessage);
  const deleteChat = useMutation(api.chats.deleteChat);

  // ----------------------------------------------------
  // LOCAL COMPONENT STATE
  // ----------------------------------------------------
  const [selectedChatId, setSelectedChatId] = useState<Id<"chats"> | null>(
    () => {
      if (typeof window !== "undefined") {
        return (
          sessionStorage.getItem(STORAGE_KEYS.ACTIVE_CHAT_ID) ||
          sessionStorage.getItem(STORAGE_KEYS.LEGACY_ACTIVE_CHAT_ID) ||
          localStorage.getItem(STORAGE_KEYS.ACTIVE_CHAT_ID) ||
          localStorage.getItem(STORAGE_KEYS.LEGACY_ACTIVE_CHAT_ID)
        ) as Id<"chats"> | null;
      }
      return null;
    },
  );

  // Save selectedChatId to storage when it changes
  useEffect(() => {
    if (selectedChatId) {
      sessionStorage.setItem(STORAGE_KEYS.ACTIVE_CHAT_ID, selectedChatId);
      sessionStorage.removeItem(STORAGE_KEYS.LEGACY_ACTIVE_CHAT_ID);
      localStorage.removeItem(STORAGE_KEYS.LEGACY_ACTIVE_CHAT_ID);
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.ACTIVE_CHAT_ID);
      sessionStorage.removeItem(STORAGE_KEYS.LEGACY_ACTIVE_CHAT_ID);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_CHAT_ID);
      localStorage.removeItem(STORAGE_KEYS.LEGACY_ACTIVE_CHAT_ID);
    }
  }, [selectedChatId]);

  const userIdParam = searchParams.get("userId");

  // Auto-start private chat if userId query param is provided
  useEffect(() => {
    if (userIdParam && isLoggedIn) {
      const initChat = async () => {
        try {
          const newChatId = await createOrGetPrivateChat({
            friendUserId: userIdParam,
          });
          setSelectedChatId(newChatId);
          // Clean up the URL query param
          const url = new URL(window.location.href);
          url.searchParams.delete("userId");
          router.replace(url.pathname + url.search);
        } catch (err: unknown) {
          console.error("Failed to start DM from query param:", err);
          const errorObj = err as { message?: string };
          toast.error(errorObj.message || "Failed to start chat session.");
        }
      };
      initChat();
    }
  }, [userIdParam, isLoggedIn, createOrGetPrivateChat, router]);

  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const saved =
        sessionStorage.getItem(STORAGE_KEYS.ACTIVE_CHAT_ID) ||
        sessionStorage.getItem(STORAGE_KEYS.LEGACY_ACTIVE_CHAT_ID) ||
        localStorage.getItem(STORAGE_KEYS.ACTIVE_CHAT_ID);
      if (saved) {
        return window.innerWidth >= 640; // sm breakpoint is 640px
      }
    }
    return true;
  });

  const [showRightPanel, setShowRightPanel] = useState(false);
  const [editingMessageId, setEditingMessageId] =
    useState<Id<"messages"> | null>(null);
  const [editingText, setEditingText] = useState("");
  const [activeContextMenuMessageId, setActiveContextMenuMessageId] = useState<
    string | null
  >(null);
  const [quickViewMediaRef, setQuickViewMediaRef] = useQuickViewMediaState();

  const quickViewMedia = useMemo<TMDBMedia | null>(() => {
    if (!quickViewMediaRef) return null;
    return {
      id: Number(quickViewMediaRef.id),
      media_type: quickViewMediaRef.media_type,
    } as TMDBMedia;
  }, [quickViewMediaRef]);

  const setQuickViewMedia = useCallback(
    (media: TMDBMedia | null) => {
      if (media) {
        setQuickViewMediaRef({
          id: String(media.id),
          media_type: media.media_type || "movie",
        });
      } else {
        setQuickViewMediaRef(null);
      }
    },
    [setQuickViewMediaRef],
  );

  const isQuickViewOpen = quickViewMedia !== null;

  // Modals
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isInviteFriendsOpen, setIsInviteFriendsOpen] = useState(false);
  const [isGIFPickerOpen, setIsGIFPickerOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isPrivacyErrorOpen, setIsPrivacyErrorOpen] = useState(false);

  // Forms
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedInvitedUsers, setSelectedInvitedUsers] = useState<Set<string>>(
    new Set(),
  );
  const [reportReason, setReportReason] = useState("");
  const [reportedUserId, setReportedUserId] = useState<string | null>(null);

  // DOM Refs
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingTimeRef = useRef<number>(0);

  // Fetch details of active chat session
  const activeChat = useMemo(() => {
    if (!chats || !selectedChatId) return null;
    return chats.find((c) => c.chatId === selectedChatId) || null;
  }, [chats, selectedChatId]);

  const rawActiveChatMessages = useQuery(
    api.chats.getChatMessages,
    selectedChatId ? { chatId: selectedChatId } : "skip",
  );
  const activeChatMessages = useMemo(() => {
    if (!rawActiveChatMessages) return undefined;
    return rawActiveChatMessages as unknown as ChatMessage[];
  }, [rawActiveChatMessages]);

  const rawActiveChatMembers = useQuery(
    api.chats.getChatMembers,
    selectedChatId ? { chatId: selectedChatId } : "skip",
  );
  const activeChatMembers = useMemo(() => {
    if (!rawActiveChatMembers) return undefined;
    return rawActiveChatMembers as unknown as ChatMember[];
  }, [rawActiveChatMembers]);

  const activeChatTyping = useQuery(
    api.chats.getTypingUsers,
    selectedChatId ? { chatId: selectedChatId } : "skip",
  );

  // Mark chat as read when opening or receiving messages
  useEffect(() => {
    if (selectedChatId) {
      setReadReceipt({ chatId: selectedChatId }).catch(console.error);
    }
  }, [selectedChatId, activeChatMessages?.length, setReadReceipt]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [activeChatMessages?.length, optimisticMessages.length]);

  // Handle case where chat session is deleted or membership is revoked
  useEffect(() => {
    if (
      selectedChatId &&
      (rawActiveChatMessages === null || rawActiveChatMembers === null)
    ) {
      const timer = setTimeout(() => {
        setSelectedChatId(null);
        setIsSidebarOpen(true);
        toast.error("This chat session is no longer available.");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [rawActiveChatMessages, rawActiveChatMembers, selectedChatId]);

  // Handle typing triggers
  const handleTyping = () => {
    if (!selectedChatId) return;

    const now = Date.now();
    if (now - lastTypingTimeRef.current > 2000) {
      lastTypingTimeRef.current = now;
      setTypingStatus({ chatId: selectedChatId, isTyping: true }).catch(
        console.error,
      );
    }

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      setTypingStatus({ chatId: selectedChatId, isTyping: false }).catch(
        console.error,
      );
      lastTypingTimeRef.current = 0;
    }, 3000);
  };

  // Send pure text direct message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending || !selectedChatId || !messageText.trim() || !currentUserId) return;

    const textToSend = messageText.trim();
    const tempId = `temp_${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      _id: tempId as unknown as Id<"messages">,
      _creationTime: Date.now(),
      chatId: selectedChatId,
      senderId: currentUserId,
      senderName: currentUserProfile?.name || currentUserProfile?.username || "Me",
      senderImage: currentUserProfile?.image || undefined,
      content: textToSend,
      createdAt: Date.now(),
    };

    try {
      setMessageText("");
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      setTypingStatus({ chatId: selectedChatId, isTyping: false }).catch(
        console.error,
      );

      setOptimisticMessages((prev) => [...prev, optimisticMsg]);
      setIsSending(true);

      await sendMessage({
        chatId: selectedChatId,
        content: textToSend,
      });
    } catch (err: unknown) {
      // Restore typed message back to the input field on failure so text is not lost
      setMessageText(textToSend);

      const errorObj = err as { message?: string };
      if (
        errorObj.message?.includes("privacy settings") ||
        errorObj.message?.includes("direct messaging")
      ) {
        setIsPrivacyErrorOpen(true);
      } else {
        toast.error(errorObj.message || "Failed to send message");
      }
    } finally {
      setIsSending(false);
      setOptimisticMessages((prev) => prev.filter((m) => m._id !== optimisticMsg._id));
    }
  };

  // Edit existing message
  const handleUpdateMessage = async (messageId: Id<"messages">) => {
    if (!editingText.trim()) {
      toast.error("Message content cannot be empty");
      return;
    }
    
    const originalText = editingText.trim();
    
    try {
      setOptimisticEdits((prev) => ({ ...prev, [messageId]: originalText }));
      setEditingMessageId(null);
      setEditingText("");
      
      await editChatMessage({
        messageId,
        newContent: originalText,
      });
      toast.success("Message updated!");
    } catch {
      toast.error("Failed to edit message");
    } finally {
      setOptimisticEdits((prev) => {
        const next = { ...prev };
        delete next[messageId];
        return next;
      });
    }
  };

  // Send a high-fidelity GIF
  const handleSendGIF = async (gifUrl: string) => {
    if (!selectedChatId) return;
    try {
      setIsGIFPickerOpen(false);
      await sendMessage({
        chatId: selectedChatId,
        content: "Shared a GIF reaction",
        attachmentUrl: gifUrl,
        attachmentType: "gif",
      });
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      if (
        errorObj.message?.includes("privacy settings") ||
        errorObj.message?.includes("direct messaging")
      ) {
        setIsPrivacyErrorOpen(true);
      } else {
        toast.error(errorObj.message || "Failed to send GIF");
      }
    }
  };

  // Group chat creators
  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }
    try {
      const invitedIds = Array.from(selectedInvitedUsers);
      const newChatId = await createGroupChat({
        name: groupName,
        description: groupDescription,
        invitedUserIds: invitedIds,
      });
      setSelectedChatId(newChatId);
      setIsCreateGroupOpen(false);
      setGroupName("");
      setGroupDescription("");
      setSelectedInvitedUsers(new Set());
      toast.success("Group chat created and invitations sent!");
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Failed to create group");
    }
  };

  // Invite friends to group chat
  const handleInviteToGroup = async () => {
    if (!selectedChatId) return;
    try {
      const selectedIds = Array.from(selectedInvitedUsers);
      await inviteToGroupChat({
        chatId: selectedChatId,
        userIds: selectedIds,
      });
      setIsInviteFriendsOpen(false);
      setSelectedInvitedUsers(new Set());
      toast.success("Group invitations sent successfully!");
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Failed to invite friends");
    }
  };

  // Leave active group chat
  const handleLeaveGroup = async () => {
    if (!selectedChatId) return;
    if (
      !(await confirm({
        title: "Leave Group Chat",
        description: "Are you sure you want to leave this group chat?",
        confirmText: "Leave",
      }))
    )
      return;

    try {
      await leaveGroupChat({ chatId: selectedChatId });
      setSelectedChatId(null);
      setIsSidebarOpen(true);
      toast.success("Left group successfully!");
    } catch {
      toast.error("Failed to leave group");
    }
  };

  // Toggle group/direct message muting status
  const handleToggleMute = async () => {
    if (!selectedChatId || !activeChat) return;
    const targetMuteState = !activeChat.isMuted;
    try {
      setOptimisticMutes((prev) => ({ ...prev, [selectedChatId]: targetMuteState }));
      const status = await toggleMuteChat({ chatId: selectedChatId });
      toast.success(status ? "Chat muted" : "Chat unmuted");
    } catch {
      toast.error("Failed to toggle mute state");
    } finally {
      setOptimisticMutes((prev) => {
        const next = { ...prev };
        delete next[selectedChatId];
        return next;
      });
    }
  };

  // Safety Submit Report
  const handleSubmitReport = async () => {
    if (!reportedUserId || !reportReason.trim()) return;
    try {
      await reportUser({
        reportedUserId,
        reason: reportReason.trim(),
      });
      setIsReportOpen(false);
      setReportReason("");
      setReportedUserId(null);
      toast.success(
        `User reported successfully. ${siteConfig.name} safety admins will review this chat session.`,
      );
    } catch {
      toast.error("Failed to submit report");
    }
  };

  // Start direct message
  const handleStartDM = async (friendId: string) => {
    try {
      const newChatId = await createOrGetPrivateChat({
        friendUserId: friendId,
      });
      setSelectedChatId(newChatId);
      setIsNewChatOpen(false);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      if (
        errorObj.message?.includes("privacy settings") ||
        errorObj.message?.includes("direct messaging")
      ) {
        setIsPrivacyErrorOpen(true);
      } else {
        toast.error(
          errorObj.message || "Failed to start direct message session",
        );
      }
    }
  };

  // Delete message handler
  const handleDeleteMessage = async (messageId: Id<"messages">) => {
    try {
      setOptimisticDeletions((prev) => {
        const next = new Set(prev);
        next.add(messageId);
        return next;
      });
      await deleteChatMessage({ messageId });
      toast.success("Message deleted");
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Failed to delete message");
    } finally {
      setOptimisticDeletions((prev) => {
        const next = new Set(prev);
        next.delete(messageId);
        return next;
      });
    }
  };

  // Delete chat room/session handler
  const handleDeleteChat = async () => {
    if (!selectedChatId) return;
    const isGroup = activeChat?.type === "group";
    const confirmMsg = isGroup
      ? "Are you sure you want to delete this group chat for everyone? This will remove all messages and members."
      : "Are you sure you want to delete this conversation? This will delete all messages for both users.";

    if (
      !(await confirm({
        title: isGroup ? "Delete Group Chat" : "Delete Chat",
        description: confirmMsg.trim(),
        confirmText: "Delete",
      }))
    )
      return;

    try {
      await deleteChat({ chatId: selectedChatId });
      setSelectedChatId(null);
      setIsSidebarOpen(true);
      toast.success("Chat deleted successfully");
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Failed to delete chat");
    }
  };

  // Filter messages dynamically by query
  const filteredMessages = useMemo(() => {
    if (!activeChatMessages) return [];
    
    const activeOptimistic = optimisticMessages.filter(
      (m) => m.chatId === selectedChatId
    );
    
    const combined = [...activeChatMessages, ...activeOptimistic]
      .filter((m) => !optimisticDeletions.has(m._id))
      .map((m) => {
        if (m._id in optimisticEdits) {
          return { ...m, content: optimisticEdits[m._id] };
        }
        return m;
      });

    if (!searchQuery.trim()) return combined;
    const q = searchQuery.toLowerCase();
    return combined.filter((m) =>
      m.content.toLowerCase().includes(q),
    );
  }, [activeChatMessages, optimisticMessages, selectedChatId, searchQuery, optimisticDeletions, optimisticEdits]);

  // Extract shared media list
  const sharedMediaList = useMemo(() => {
    if (!activeChatMessages) return [];
    return activeChatMessages
      .filter((m) => !optimisticDeletions.has(m._id))
      .filter((m) => m.attachmentType === "media" && m.sharedMediaId);
  }, [activeChatMessages, optimisticDeletions]);

  // Handle session loading
  if (session.isPending) {
    return (
      <div className="flex min-h-[60vh] grow items-center justify-center bg-zinc-950 text-white">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
      </div>
    );
  }

  // Enforce logged-in status
  if (!isLoggedIn || !currentUserId) {
    return (
      <div className="flex min-h-[60vh] grow flex-col items-center justify-center bg-zinc-950 p-6 text-center text-white">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900 shadow-xl">
          <Users className="text-primary h-8 w-8" />
        </div>
        <h1 className="text-xl font-bold">Login Required</h1>
        <p className="text-zinc-400 mt-2 max-w-sm text-xs sm:text-sm">
          Please log in to participate in direct messages and group chats.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <Button
            onClick={() => openAuth()}
            className="hover:bg-primary/90 bg-primary cursor-pointer rounded-xl px-6 font-semibold text-white"
          >
            Sign In
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="cursor-pointer rounded-xl border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white"
          >
            Go Home
          </Button>
        </div>
        <AuthModal isOpen={isAuthOpen} onClose={closeAuth} />
      </div>
    );
  }

  return (
    <div className="relative flex max-h-svh min-h-svh grow flex-row overflow-hidden border-t border-zinc-900 bg-zinc-950 text-white">
      <SidebarPanel
        chats={chats}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        setIsCreateGroupOpen={setIsCreateGroupOpen}
        setIsNewChatOpen={setIsNewChatOpen}
        setSelectedInvitedUsers={setSelectedInvitedUsers}
      />

      <ChatWorkspace
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        activeChat={activeChat}
        currentUserId={currentUserId}
        activeChatMessages={activeChatMessages}
        activeChatMembers={activeChatMembers}
        activeChatTyping={activeChatTyping}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredMessages={filteredMessages}
        messageText={messageText}
        setMessageText={setMessageText}
        handleSendMessage={handleSendMessage}
        handleTyping={handleTyping}
        setIsGIFPickerOpen={setIsGIFPickerOpen}
        showRightPanel={showRightPanel}
        setShowRightPanel={setShowRightPanel}
        setIsSidebarOpen={setIsSidebarOpen}
        editingMessageId={editingMessageId}
        setEditingMessageId={setEditingMessageId}
        editingText={editingText}
        setEditingText={setEditingText}
        handleUpdateMessage={handleUpdateMessage}
        messageEndRef={messageEndRef}
        activeContextMenuMessageId={activeContextMenuMessageId}
        setActiveContextMenuMessageId={setActiveContextMenuMessageId}
        handleDeleteMessage={handleDeleteMessage}
        onQuickView={(media) => {
          setQuickViewMedia(media);
        }}
        isSending={isSending}
      />

      {selectedChatId && activeChat && (
        <DetailsPanel
          activeChat={activeChat}
          activeChatMembers={activeChatMembers}
          sharedMediaList={sharedMediaList}
          showRightPanel={showRightPanel}
          setShowRightPanel={setShowRightPanel}
          setIsInviteFriendsOpen={setIsInviteFriendsOpen}
          setSelectedInvitedUsers={setSelectedInvitedUsers}
          handleLeaveGroup={handleLeaveGroup}
          handleDeleteChat={handleDeleteChat}
          currentUserId={currentUserId}
          handleToggleMute={handleToggleMute}
          onBlockSuccess={() => {
            setSelectedChatId(null);
            setIsSidebarOpen(true);
            setShowRightPanel(false);
          }}
        />
      )}

      <ChatModals
        isNewChatOpen={isNewChatOpen}
        setIsNewChatOpen={setIsNewChatOpen}
        isCreateGroupOpen={isCreateGroupOpen}
        setIsCreateGroupOpen={setIsCreateGroupOpen}
        isInviteFriendsOpen={isInviteFriendsOpen}
        setIsInviteFriendsOpen={setIsInviteFriendsOpen}
        isGIFPickerOpen={isGIFPickerOpen}
        setIsGIFPickerOpen={setIsGIFPickerOpen}
        isReportOpen={isReportOpen}
        setIsReportOpen={setIsReportOpen}
        friends={friends}
        activeChatMembers={activeChatMembers}
        selectedInvitedUsers={selectedInvitedUsers}
        setSelectedInvitedUsers={setSelectedInvitedUsers}
        groupName={groupName}
        setGroupName={setGroupName}
        groupDescription={groupDescription}
        setGroupDescription={setGroupDescription}
        reportReason={reportReason}
        setReportReason={setReportReason}
        handleStartDM={handleStartDM}
        handleCreateGroup={handleCreateGroup}
        handleInviteToGroup={handleInviteToGroup}
        handleSendGIF={handleSendGIF}
        handleSubmitReport={handleSubmitReport}
        isPrivacyErrorOpen={isPrivacyErrorOpen}
        setIsPrivacyErrorOpen={setIsPrivacyErrorOpen}
      />
      {isQuickViewOpen && quickViewMedia && (
        <QuickViewModal
          isOpen={isQuickViewOpen}
          onClose={() => {
            setQuickViewMedia(null);
          }}
          media={quickViewMedia}
        />
      )}
      <AuthModal isOpen={isAuthOpen} onClose={closeAuth} />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense>
      <ChatPageContent />
    </Suspense>
  );
}
