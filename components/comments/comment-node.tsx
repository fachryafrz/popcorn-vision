"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserRoleBadge } from "@/components/user-role-badge";
import { useConfirm } from "@/components/ui/confirm-provider";
import { toast } from "sonner";
import {
  Heart,
  Reply,
  MoreHorizontal,
  Edit2,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CommentType } from "./types";
import CommentComposer from "./comment-composer";

interface CommentNodeProps {
  comment: CommentType;
  depth: number;
  currentUserId?: string;
  mediaId: string;
  mediaType: string;
  mediaTitle?: string;
  mediaPosterPath?: string;
  onAuthRequired: () => void;
}

export default function CommentNode({
  comment,
  depth,
  currentUserId,
  mediaId,
  mediaType,
  mediaTitle,
  mediaPosterPath,
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
        mediaTitle,
        mediaPosterPath,
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
          <Avatar className="h-9 w-9 border border-zinc-800 ring-2 ring-transparent transition-all duration-300">
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
              {!isDeletedUser && <UserRoleBadge role={comment.author.role} />}
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
              <CommentComposer
                value={replyContent}
                onChange={setReplyContent}
                onSubmit={handleReplySubmit}
                isSubmitting={isSubmittingReply}
                placeholder={`Reply to @${comment.author.username}…`}
                onCancel={() => setIsReplying(false)}
                submitLabel="Post Reply"
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
              mediaTitle={mediaTitle}
              mediaPosterPath={mediaPosterPath}
              onAuthRequired={onAuthRequired}
            />
          ))}
        </div>
      )}
    </div>
  );
}
