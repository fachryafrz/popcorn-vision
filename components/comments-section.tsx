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

export default function CommentsSection({ mediaId, mediaType }: CommentsSectionProps) {
  const [sorting, setSorting] = useState<SortOption>("best");
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Authentication session
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const currentUserId = session.data?.user?.id;
  const authModal = useAuthModalStore();

  // Convex comment queries and mutations
  const comments = useQuery(
    api.comments.getComments,
    {
      mediaId,
      mediaType,
      sorting,
    }
  ) as CommentType[] | undefined;

  
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-blue-500" />
            Comments
            <span className="text-zinc-500 text-sm font-normal">
              ({comments?.length ?? 0} discussions)
            </span>
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Join the conversation and share your thoughts
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5 self-start sm:self-center bg-zinc-900/60 p-1 rounded-xl border border-zinc-800/50">
          {(["best", "top", "latest"] as SortOption[]).map((option) => (
            <button
              key={option}
              onClick={() => setSorting(option)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer",
                sorting === option
                  ? "bg-white text-zinc-950 shadow-md scale-100"
                  : "text-zinc-400 hover:text-zinc-200"
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
          <div className="relative group overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/20 backdrop-blur-md p-6 text-center shadow-lg">
            <h3 className="text-zinc-200 font-bold text-base mb-1">
              Connect with the Community
            </h3>
            <p className="text-zinc-500 text-xs max-w-sm mx-auto mb-4">
              Log in or register your account to write comments, reply to discussions, and like user reviews.
            </p>
            <Button
              onClick={() => authModal.open()}
              variant="default"
              size="sm"
              className="rounded-xl font-bold bg-white text-black hover:bg-zinc-200 cursor-pointer"
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
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="h-10 w-10 rounded-full bg-zinc-800" />
              <div className="flex-1 space-y-2.5">
                <div className="h-4 bg-zinc-800 rounded w-1/4" />
                <div className="h-3 bg-zinc-800/60 rounded w-3/4" />
                <div className="h-3 bg-zinc-800/40 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/30">
          <MessageSquare className="h-10 w-10 text-zinc-700 mb-3" />
          <p className="text-zinc-400 font-medium text-sm">No comments yet</p>
          <p className="text-zinc-600 text-xs mt-1">Be the first to share your thoughts!</p>
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
  const isDeletedUser = comment.author.username === "[deleted]" || comment.author.username === "deleted";

  // Toggle Dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
    if (confirm("Are you sure you want to delete this comment? This will also delete all replies to it.")) {
      try {
        await deleteCommentMutation({ commentId: comment._id as Id<"comments"> });
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
          href={`/@/${username}`}
          className="text-blue-400 font-bold hover:underline"
        >
          @{username}
        </Link>
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
  const indentClass = isNested && depth <= maxNestingIndent ? "ml-5 md:ml-10 border-l border-zinc-800/80 pl-4 md:pl-6" : "";

  return (
    <div className={cn("group flex flex-col gap-1 transition-all duration-300", indentClass)}>
      <div className="flex items-start gap-3 bg-zinc-900/10 p-3 rounded-2xl hover:bg-zinc-900/30 border border-transparent hover:border-zinc-800/30 transition-all duration-300">
        {isDeletedUser ? (
          <Avatar className="h-9 w-9 border border-zinc-800 ring-2 ring-transparent transition-all duration-300 select-none">
            {comment.author.image && (
              <AvatarImage src={comment.author.image} alt={comment.author.name} className="object-cover" />
            )}
            <AvatarFallback className="bg-zinc-800 text-zinc-300 text-sm font-bold">
              {comment.author.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <Link href={`/@/${comment.author.username}`}>
            <Avatar className="h-9 w-9 border border-zinc-800 ring-2 ring-transparent group-hover:ring-zinc-700/30 transition-all duration-300">
              {comment.author.image && (
                <AvatarImage src={comment.author.image} alt={comment.author.name} className="object-cover" />
              )}
              <AvatarFallback className="bg-zinc-800 text-zinc-300 text-sm font-bold">
                {comment.author.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        )}

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              {isDeletedUser ? (
                <span className="font-bold text-white text-sm">
                  {comment.author.name}
                </span>
              ) : (
                <Link
                  href={`/@/${comment.author.username}`}
                  className="font-bold text-white text-sm hover:underline"
                >
                  {comment.author.name}
                </Link>
              )}
              {!isDeletedUser && <span className="text-zinc-500 text-xs">@{comment.author.username}</span>}
              <span className="text-zinc-600 text-xs font-semibold">•</span>
              <span className="text-zinc-500 text-[11px]" title={new Date(comment.createdAt).toLocaleString()}>
                {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
              </span>
              {comment.updatedAt && (
                <span className="text-zinc-600 text-[10px] italic font-semibold">(edited)</span>
              )}
            </div>

            {/* Edit/Delete Options */}
            {isOwner && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-800/50 cursor-pointer"
                  aria-label="Comment options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {showOptions && (
                  <div className="absolute right-0 mt-1 w-28 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-30 overflow-hidden">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowOptions(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800/80 hover:text-white text-left cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        handleDelete();
                        setShowOptions(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-zinc-800/80 hover:text-red-300 text-left cursor-pointer"
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
          <div className="mt-2 text-sm text-zinc-300 leading-relaxed wrap-break-word whitespace-pre-wrap">
            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="mt-2 space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 text-white min-h-[60px] text-sm focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-700"
                  required
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="rounded-lg h-7 text-xs cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmittingEdit}
                    className="rounded-lg h-7 text-xs bg-white text-black hover:bg-zinc-200 cursor-pointer"
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
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={handleLike}
                className={cn(
                  "flex items-center gap-1 text-[11px] font-bold group/like transition-all duration-200 cursor-pointer",
                  comment.isLiked
                    ? "text-red-500 scale-105 active:scale-95"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <Heart className={cn("h-3.5 w-3.5 transition-colors group-hover/like:fill-red-500/20", comment.isLiked && "fill-red-500 text-red-500")} />
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
                  "flex items-center gap-1 text-[11px] font-bold text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer",
                  isReplying && "text-blue-400 hover:text-blue-300"
                )}
              >
                <Reply className="h-3.5 w-3.5" />
                <span>Reply</span>
              </button>
            </div>
          )}

          {/* Reply Form */}
          {isReplying && (
            <div className="mt-4 pl-4 border-l-2 border-zinc-800">
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
      : "skip"
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
    const newTextBeforeCursor = textBeforeCursor.substring(0, lastAtIdx) + `@${username} `;
    
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
          className="bg-zinc-900 border-zinc-800/80 text-white rounded-2xl min-h-[90px] pr-10 focus-visible:ring-1 focus-visible:ring-zinc-700 focus-visible:border-zinc-800"
          required
        />
      </div>

      {/* Mention Dropdown */}
      {mentionQuery !== null && searchResults && searchResults.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-40 p-2 divide-y divide-zinc-800/60 max-w-sm">
          {searchResults.map((user) => (
            <button
              key={user.userId}
              type="button"
              onClick={() => handleSelectMention(user.username)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-zinc-800 transition-colors cursor-pointer group"
            >
              <Avatar className="h-7 w-7 border border-zinc-800">
                {user.image && <AvatarImage src={user.image} alt={user.name} />}
                <AvatarFallback className="bg-zinc-800 text-zinc-300 text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-white text-xs font-semibold truncate group-hover:text-blue-400 transition-colors">
                  {user.name}
                </p>
                <p className="text-zinc-500 text-[10px] truncate">@{user.username}</p>
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
            className="rounded-xl h-8 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting || !value.trim()}
          size="sm"
          className="rounded-xl h-8 text-xs font-bold bg-white text-black hover:bg-zinc-200 cursor-pointer"
        >
          {isSubmitting ? (
            "Sending…"
          ) : (
            <>
              <Send className="h-3 w-3 mr-1.5" />
              Post Comment
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
