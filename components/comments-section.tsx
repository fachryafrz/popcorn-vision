"use client";

import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  MessageSquare,
  Heart,
  Edit2,
  Trash2,
  Reply,
  Send,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useConfirm } from "@/components/ui/confirm-provider";

// Props for CommentsSection
interface CommentsSectionProps {
  mediaId: string;
  mediaType: string;
}

// Sorting options
type SortOption = "best" | "top" | "latest";

// Comment Type representation
interface CommentType {
  _id: Id<"comments">;
  mediaId: string;
  mediaType: string;
  userId: string;
  content: string;
  parentId?: Id<"comments">;
  createdAt: number;
  updatedAt?: number;
  author: {
    name: string;
    username: string;
    image?: string;
  };
  likeCount: number;
  replyCount: number;
  isLiked: boolean;
  replies: CommentType[];
}

export default function CommentsSection({
  mediaId,
  mediaType,
}: CommentsSectionProps) {
  const [sorting, setSorting] = useState<SortOption>("best");
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Authentication session
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const currentUserId = session.data?.user?.id;
  const authModal = useAuthModalStore();

  // Convex comment queries and mutations
  const comments = useQuery(api.comments.getComments, {
    mediaId,
    mediaType,
    sorting,
  }) as CommentType[] | undefined;

  const addCommentMutation = useMutation(api.comments.addComment);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      authModal.open();
      return;
    }

    if (!commentContent.trim()) return;

    setIsSubmitting(true);
    try {
      await addCommentMutation({
        mediaId,
        mediaType,
        content: commentContent,
      });
      setCommentContent("");
      toast.success("Comment posted successfully!");
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 border-t border-zinc-800/80 pt-10">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
            <MessageSquare className="text-primary h-6 w-6" />
            Comments
            <span className="text-sm font-normal text-zinc-500">
              ({comments?.length ?? 0} discussions)
            </span>
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Join the conversation and share your thoughts
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5 self-start rounded-xl border border-zinc-800/50 bg-zinc-900/60 p-1 sm:self-center">
          {(["best", "top", "latest"] as SortOption[]).map((option) => (
            <button
              key={option}
              onClick={() => setSorting(option)}
              className={cn(
                "cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wider uppercase transition-all duration-200",
                sorting === option
                  ? "scale-100 bg-white text-zinc-950 shadow-md"
                  : "text-zinc-400 hover:text-zinc-200",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Comment Editor */}
      <div className="mb-10">
        {isLoggedIn ? (
          <CommentInputForm
            value={commentContent}
            onChange={setCommentContent}
            onSubmit={handlePostComment}
            isSubmitting={isSubmitting}
            placeholder="What's on your mind? Mention others using @username…"
          />
        ) : (
          <div className="group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/20 p-6 text-center shadow-lg backdrop-blur-md">
            <h3 className="mb-1 text-base font-bold text-zinc-200">
              Connect with the Community
            </h3>
            <p className="mx-auto mb-4 max-w-sm text-xs text-zinc-500">
              Log in or register your account to write comments, reply to
              discussions, and like user reviews.
            </p>
            <Button
              onClick={() => authModal.open()}
              variant="default"
              size="sm"
              className="cursor-pointer rounded-xl bg-white font-bold text-black hover:bg-zinc-200"
            >
              Sign In to Participate
            </Button>
          </div>
        )}
      </div>

      {/* Render list of threaded comments */}
      {comments === undefined ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex animate-pulse gap-4">
              <div className="h-10 w-10 rounded-full bg-zinc-800" />
              <div className="flex-1 space-y-2.5">
                <div className="h-4 w-1/4 rounded bg-zinc-800" />
                <div className="h-3 w-3/4 rounded bg-zinc-800/60" />
                <div className="h-3 w-1/2 rounded bg-zinc-800/40" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/30 py-16 text-center">
          <MessageSquare className="mb-3 h-10 w-10 text-zinc-700" />
          <p className="text-sm font-medium text-zinc-400">No comments yet</p>
          <p className="mt-1 text-xs text-zinc-600">
            Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentNode
              key={comment._id}
              comment={comment}
              depth={0}
              currentUserId={currentUserId}
              mediaId={mediaId}
              mediaType={mediaType}
              onAuthRequired={() => authModal.open()}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// COMMENT NODE (Threaded Item)
// ----------------------------------------------------
interface CommentNodeProps {
  comment: CommentType;
  depth: number;
  currentUserId?: string;
  mediaId: string;
  mediaType: string;
  onAuthRequired: () => void;
}

function CommentNode({
  comment,
  depth,
  currentUserId,
  mediaId,
  mediaType,
  onAuthRequired,
}: CommentNodeProps) {
  const confirm = useConfirm();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const addCommentMutation = useMutation(api.comments.addComment);

  const editCommentMutation = useMutation(api.comments.editComment);

  const deleteCommentMutation = useMutation(api.comments.deleteComment);

  const toggleLikeMutation = useMutation(api.comments.toggleLikeComment);

  const isOwner = currentUserId && comment.userId === currentUserId;
  const isDeletedUser =
    comment.author.username === "[deleted]" ||
    comment.author.username === "deleted";

  // Toggle Dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLike = async () => {
    if (!currentUserId) {
      onAuthRequired();
      return;
    }
    try {
      await toggleLikeMutation({ commentId: comment._id as Id<"comments"> });
    } catch {
      toast.error("Failed to toggle like");
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) {
      onAuthRequired();
      return;
    }
    if (!replyContent.trim()) return;

    setIsSubmittingReply(true);
    try {
      await addCommentMutation({
        mediaId,
        mediaType,
        content: replyContent,
        parentId: comment._id as Id<"comments">,
      });
      setReplyContent("");
      setIsReplying(false);
      toast.success("Reply posted!");
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Failed to post reply");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    setIsSubmittingEdit(true);
    try {
      await editCommentMutation({
        commentId: comment._id as Id<"comments">,
        content: editContent,
      });
      setIsEditing(false);
      toast.success("Comment updated!");
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Failed to edit comment");
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (
      await confirm({
        title: "Delete Comment",
        description:
          "Are you sure you want to delete this comment? This will also delete all replies to it.",
        confirmText: "Delete",
      })
    ) {
      try {
        await deleteCommentMutation({
          commentId: comment._id as Id<"comments">,
        });
        toast.success("Comment deleted.");
      } catch {
        toast.error("Failed to delete comment");
      }
    }
  };

  // Parsing Mentions to Rich Links
  const renderRichContent = (content: string) => {
    const mentionRegex = /@([a-zA-Z0-9_]{3,15})/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      const index = match.index;
      if (index > lastIndex) {
        parts.push(content.substring(lastIndex, index));
      }
      const username = match[1];
      parts.push(
        <Link
          key={index}
          href={`/@${username}`}
          className="text-primary font-bold hover:underline"
        >
          @{username}
        </Link>,
      );
      lastIndex = index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts.length > 0 ? parts : content;
  };

  // Limit visual indent spacing at depth 3, keep flat replies aligned
  const maxNestingIndent = 3;
  const isNested = depth > 0;
  const indentClass =
    isNested && depth <= maxNestingIndent
      ? "ml-5 md:ml-10 border-l border-zinc-800/80 pl-4 md:pl-6"
      : "";

  return (
    <div
      className={cn(
        "group flex flex-col gap-1 transition-all duration-300",
        indentClass,
      )}
    >
      <div className="flex items-start gap-3 rounded-2xl border border-transparent bg-zinc-900/10 p-3 transition-all duration-300 hover:border-zinc-800/30 hover:bg-zinc-900/30">
        {isDeletedUser ? (
          <Avatar className="h-9 w-9 border border-zinc-800 ring-2 ring-transparent transition-all duration-300 select-none">
            {comment.author.image && (
              <AvatarImage
                src={comment.author.image}
                alt={comment.author.name}
                className="object-cover"
              />
            )}
            <AvatarFallback className="bg-zinc-800 text-sm font-bold text-zinc-300">
              {comment.author.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <Link href={`/@${comment.author.username}`}>
            <Avatar className="h-9 w-9 border border-zinc-800 ring-2 ring-transparent transition-all duration-300 group-hover:ring-zinc-700/30">
              {comment.author.image && (
                <AvatarImage
                  src={comment.author.image}
                  alt={comment.author.name}
                  className="object-cover"
                />
              )}
              <AvatarFallback className="bg-zinc-800 text-sm font-bold text-zinc-300">
                {comment.author.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        )}

        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              {isDeletedUser ? (
                <span className="text-sm font-bold text-white">
                  {comment.author.name}
                </span>
              ) : (
                <Link
                  href={`/@${comment.author.username}`}
                  className="text-sm font-bold text-white hover:underline"
                >
                  {comment.author.name}
                </Link>
              )}
              {!isDeletedUser && (
                <span className="text-xs text-zinc-500">
                  @{comment.author.username}
                </span>
              )}
              <span className="text-xs font-semibold text-zinc-600">•</span>
              <span
                className="text-[11px] text-zinc-500"
                title={new Date(comment.createdAt).toLocaleString()}
              >
                {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
              </span>
              {comment.updatedAt && (
                <span className="text-[10px] font-semibold text-zinc-600 italic">
                  (edited)
                </span>
              )}
            </div>

            {/* Edit/Delete Options */}
            {isOwner && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="cursor-pointer rounded-lg p-1 text-zinc-500 hover:bg-zinc-800/50 hover:text-white"
                  aria-label="Comment options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {showOptions && (
                  <div className="absolute right-0 z-30 mt-1 w-28 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-xl">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowOptions(false);
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-xs text-zinc-300 hover:bg-zinc-800/80 hover:text-white"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        handleDelete();
                        setShowOptions(false);
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-xs text-red-400 hover:bg-zinc-800/80 hover:text-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="mt-2 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap text-zinc-300">
            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="mt-2 space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[60px] border-zinc-800 bg-zinc-950 text-sm text-white focus-visible:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-600"
                  required
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="h-7 cursor-pointer rounded-lg text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmittingEdit}
                    className="h-7 cursor-pointer rounded-lg bg-white text-xs text-black hover:bg-zinc-200"
                  >
                    {isSubmittingEdit ? "Saving…" : "Save"}
                  </Button>
                </div>
              </form>
            ) : (
              renderRichContent(comment.content)
            )}
          </div>

          {/* Actions */}
          {!isEditing && (
            <div className="mt-3 flex items-center gap-4">
              <button
                onClick={handleLike}
                className={cn(
                  "group/like flex cursor-pointer items-center gap-1 text-[11px] font-bold transition-all duration-200",
                  comment.isLiked
                    ? "scale-105 text-red-500 active:scale-95"
                    : "text-zinc-500 hover:text-zinc-300",
                )}
              >
                <Heart
                  className={cn(
                    "h-3.5 w-3.5 transition-colors group-hover/like:fill-red-500/20",
                    comment.isLiked && "fill-red-500 text-red-500",
                  )}
                />
                <span>{comment.likeCount}</span>
              </button>

              <button
                onClick={() => {
                  if (!currentUserId) {
                    onAuthRequired();
                  } else {
                    setIsReplying(!isReplying);
                  }
                }}
                className={cn(
                  "flex cursor-pointer items-center gap-1 text-[11px] font-bold text-zinc-500 transition-colors hover:text-zinc-300",
                  isReplying && "text-primary hover:text-primary/50",
                )}
              >
                <Reply className="h-3.5 w-3.5" />
                <span>Reply</span>
              </button>
            </div>
          )}

          {/* Reply Form */}
          {isReplying && (
            <div className="mt-4 border-l-2 border-zinc-800 pl-4">
              <CommentInputForm
                value={replyContent}
                onChange={setReplyContent}
                onSubmit={handleReplySubmit}
                isSubmitting={isSubmittingReply}
                placeholder={`Reply to @${comment.author.username}…`}
                onCancel={() => setIsReplying(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Render Child Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-4">
          {comment.replies.map((child) => (
            <CommentNode
              key={child._id}
              comment={child}
              depth={depth + 1}
              currentUserId={currentUserId}
              mediaId={mediaId}
              mediaType={mediaType}
              onAuthRequired={onAuthRequired}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// RICH COMMENT EDITOR WITH USER AUTOCOMPLETE
// ----------------------------------------------------
interface CommentInputFormProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  placeholder: string;
  onCancel?: () => void;
}

function CommentInputForm({
  value,
  onChange,
  onSubmit,
  isSubmitting,
  placeholder,
  onCancel,
}: CommentInputFormProps) {
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Search users based on query
  const searchResults = useQuery(
    api.social.searchUsers,
    mentionQuery !== null && mentionQuery.trim().length >= 1
      ? { query: mentionQuery }
      : "skip",
  );

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChange(val);

    const selectionEnd = e.target.selectionEnd;
    const textBeforeCursor = val.substring(0, selectionEnd);

    // Find if the cursor is currently inside an active @mention block
    const mentionRegex = /@([a-zA-Z0-9_]*)$/;
    const match = textBeforeCursor.match(mentionRegex);

    if (match) {
      setMentionQuery(match[1]);
    } else {
      setMentionQuery(null);
    }
  };

  const handleSelectMention = (username: string) => {
    if (!textareaRef.current) return;
    const selectionEnd = textareaRef.current.selectionEnd;
    const textBeforeCursor = value.substring(0, selectionEnd);
    const textAfterCursor = value.substring(selectionEnd);

    // Replace the incomplete `@username` with the full selection
    const lastAtIdx = textBeforeCursor.lastIndexOf("@");
    const newTextBeforeCursor =
      textBeforeCursor.substring(0, lastAtIdx) + `@${username} `;

    onChange(newTextBeforeCursor + textAfterCursor);
    setMentionQuery(null);

    // Re-focus and update cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const cursorPosition = newTextBeforeCursor.length;
        textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 10);
  };

  return (
    <form onSubmit={onSubmit} className="relative space-y-2">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextareaChange}
          placeholder={placeholder}
          className="min-h-[90px] rounded-2xl border-zinc-800/80 bg-zinc-900 pr-10 text-white focus-visible:border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-700"
          required
        />
      </div>

      {/* Mention Dropdown */}
      {mentionQuery !== null && searchResults && searchResults.length > 0 && (
        <div className="absolute right-0 left-0 z-40 mt-1 max-h-48 max-w-sm divide-y divide-zinc-800/60 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900 p-2 shadow-2xl">
          {searchResults.map((user) => (
            <button
              key={user.userId}
              type="button"
              onClick={() => handleSelectMention(user.username)}
              className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-zinc-800"
            >
              <Avatar className="h-7 w-7 border border-zinc-800">
                {user.image && <AvatarImage src={user.image} alt={user.name} />}
                <AvatarFallback className="bg-zinc-800 text-xs font-bold text-zinc-300">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="group-hover:text-primary truncate text-xs font-semibold text-white transition-colors">
                  {user.name}
                </p>
                <p className="truncate text-[10px] text-zinc-500">
                  @{user.username}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Action triggers */}
      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="h-8 cursor-pointer rounded-xl text-xs font-semibold"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting || !value.trim()}
          size="sm"
          className="h-8 cursor-pointer rounded-xl bg-white text-xs font-bold text-black hover:bg-zinc-200"
        >
          {isSubmitting ? (
            "Sending…"
          ) : (
            <>
              <Send className="mr-1.5 h-3 w-3" />
              Post Comment
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
