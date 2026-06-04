"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { batchFetchMediaMetadata } from "@/lib/tmdb-actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Calendar, Star, Loader2 } from "lucide-react";

interface LogWatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaId: string;
  mediaType: string;
  title: string;
  posterPath: string;
  releaseYear: string;
  onSuccess?: () => void;
  // Optional props for editing
  diaryId?: string;
  initialWatchedDate?: number;
  initialRewatch?: boolean;
  initialRating?: number;
  initialReview?: string;
  season?: number;
  episode?: number;
}

export default function LogWatchModal({
  isOpen,
  onClose,
  mediaId,
  mediaType,
  title,
  posterPath,
  releaseYear,
  onSuccess,
  diaryId,
  initialWatchedDate,
  initialRewatch,
  initialRating,
  initialReview,
  season,
  episode,
}: LogWatchModalProps) {
  const [watchedDate, setWatchedDate] = useState("");
  const [rewatch, setRewatch] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const logWatchMutation = useMutation(api.diary.logWatch);
  const editDiaryEntryMutation = useMutation(api.diary.editDiaryEntry);
  const currentUser = useQuery(api.users.getCurrentUser);

  // Set default watch date to today or initial values if editing (local YYYY-MM-DD)
  useEffect(() => {
    if (isOpen) {
      if (diaryId) {
        // Editing Mode
        const dateObj = new Date(initialWatchedDate || Date.now());
        const offset = dateObj.getTimezoneOffset();
        const localDate = new Date(dateObj.getTime() - offset * 60 * 1000);
        const dateStr = localDate.toISOString().split("T")[0];

        const timer = setTimeout(() => {
          setWatchedDate(dateStr);
          setRewatch(initialRewatch || false);
          setRating(initialRating || 0);
          setReview(initialReview || "");
        }, 0);

        return () => clearTimeout(timer);
      } else {
        // Logging Mode
        const today = new Date();
        const offset = today.getTimezoneOffset();
        const localToday = new Date(today.getTime() - offset * 60 * 1000);
        const todayStr = localToday.toISOString().split("T")[0];

        const timer = setTimeout(() => {
          setWatchedDate(todayStr);
          setRewatch(false);
          setRating(0);
          setReview("");
        }, 0);

        return () => clearTimeout(timer);
      }
    }
  }, [
    isOpen,
    diaryId,
    initialWatchedDate,
    initialRewatch,
    initialRating,
    initialReview,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!watchedDate) {
      toast.error("Please select a watched date.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Parse YYYY-MM-DD date to timestamp
      const timestamp = new Date(watchedDate).getTime();

      if (diaryId) {
        await editDiaryEntryMutation({
          diaryId: diaryId as Id<"diary">,
          watchedDate: timestamp,
          rewatch,
          review: review.trim() || undefined,
          rating: rating > 0 ? rating : undefined,
          season,
          episode,
        });
        toast.success(`Updated watch log for "${title}" successfully!`);
      } else {
        // Fetch metadata properties from TMDB server action
        let metadataArgs = {};
        try {
          const results = await batchFetchMediaMetadata(
            [{ mediaId, mediaType: mediaType as "movie" | "tv" }],
            currentUser?.country || "US"
          );
          const meta = results[`${mediaType}-${mediaId}`];
          if (meta) {
            metadataArgs = {
              runtime: meta.runtime,
              genres: meta.genres,
              cast: meta.cast,
              directors: meta.directors,
              watchProviders: meta.watchProviders,
            };
          }
        } catch (err) {
          console.error("Failed to fetch TMDB metadata for diary entry:", err);
        }

        await logWatchMutation({
          mediaId,
          mediaType,
          title,
          posterPath,
          releaseYear,
          watchedDate: timestamp,
          rewatch,
          review: review.trim() || undefined,
          rating: rating > 0 ? rating : undefined,
          season,
          episode,
          ...metadataArgs,
        });
        toast.success(`Logged watch for "${title}" successfully!`);
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Failed to save watch log");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="animate-in zoom-in-95 max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white shadow-2xl duration-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
            <Calendar className="text-primary h-5 w-5" />
            {diaryId ? "Edit Watch Log" : "Log Watch"}
          </DialogTitle>
          <DialogDescription className="mt-1 text-xs text-zinc-500">
            Log this title to your diary. Records your watched date, ratings,
            and diary notes.
          </DialogDescription>
        </DialogHeader>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          <div className="flex items-start gap-4 rounded-2xl border border-zinc-900 bg-zinc-900/10 p-3.5">
            <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
              {posterPath ? (
                <img
                  src={`https://image.tmdb.org/t/p/w92${posterPath}`}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm leading-snug font-bold text-white">
                {title}
              </h4>
              <p className="mt-1 text-[10px] font-semibold text-zinc-500 uppercase">
                {mediaType} • {releaseYear}
                {season !== undefined && episode !== undefined && ` • S${season} E${episode}`}
              </p>
            </div>
          </div>

          {/* Watched Date */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold tracking-wider text-zinc-400 uppercase">
              Watched Date
            </Label>
            <Input
              type="date"
              value={watchedDate}
              onChange={(e) => setWatchedDate(e.target.value)}
              className="rounded-xl border-zinc-800 bg-zinc-900 text-white focus-visible:border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-700"
              required
            />
          </div>

          {/* Star Rating Selectors (10 stars representing 1-10 rating scale) */}
          <div className="space-y-2">
            <Label className="block text-xs font-bold tracking-wider text-zinc-400 uppercase">
              Rating{" "}
              {rating > 0 ? (
                `(${rating} / 10)`
              ) : (
                <span className="font-normal text-zinc-600 italic">
                  (optional)
                </span>
              )}
            </Label>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 py-1">
                {Array.from({ length: 10 }).map((_, starIndex) => {
                  const starValue = starIndex + 1;
                  const displayRating = hoveredRating || rating;

                  return (
                    <div
                      className="relative h-5 w-5 shrink-0 transition-transform duration-100 hover:scale-115 cursor-pointer"
                      key={starIndex}
                      onMouseEnter={() => setHoveredRating(starValue)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() =>
                        setRating(rating === starValue ? 0 : starValue)
                      }
                      title={`Rate ${starValue} / 10`}
                    >
                      {/* Base Empty Star */}
                      <Star className="h-5 w-5 text-zinc-700" />

                      {/* Fully Filled Overlay */}
                      {displayRating >= starValue && (
                        <div className="pointer-events-none absolute top-0 left-0 w-full overflow-hidden">
                          <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <span className="ml-2 rounded-md border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 text-sm font-black text-white">
                {hoveredRating ? `${hoveredRating} / 10` : rating ? `${rating} / 10` : "_ / 10"}
              </span>
            </div>
          </div>

          {/* Rewatch Checker */}
          <div className="flex items-center gap-3 rounded-2xl border border-zinc-900/50 bg-zinc-900/10 p-3 py-1">
            <Checkbox
              id="rewatch-check"
              checked={rewatch}
              onCheckedChange={(checked) => setRewatch(checked === true)}
              className="data-[state=checked]:border-primary data-[state=checked]:bg-primary h-5 w-5 cursor-pointer rounded-lg border-zinc-800 bg-zinc-950 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <div className="min-w-0 flex-1">
              <Label
                htmlFor="rewatch-check"
                className="block cursor-pointer text-xs font-bold text-white select-none"
              >
                I&apos;ve watched this film before
              </Label>
              <span className="mt-0.5 block text-[10px] leading-none font-medium text-zinc-500">
                Flag this entry as a rewatch log
              </span>
            </div>
          </div>

          {/* Review / Notes */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold tracking-wider text-zinc-400 uppercase">
                Diary Notes / Review
              </Label>
              <span className="text-[10px] font-bold text-zinc-600 select-none">
                optional
              </span>
            </div>
            <Textarea
              placeholder="Jot down your thoughts, tags, or a full movie review for this watch..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={3}
              className="min-h-[80px] resize-none rounded-xl border-zinc-800 bg-zinc-900 text-xs text-white focus-visible:border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-700"
            />
          </div>

          {/* Actions button triggers */}
          <div className="flex items-center justify-end gap-2 border-t border-zinc-900 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-9 cursor-pointer rounded-xl border-zinc-800 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              size="sm"
              className="h-9 cursor-pointer rounded-xl bg-white text-xs font-bold text-black shadow-md hover:bg-zinc-200"
            >
              {isSubmitting && <Loader2 className="h-4.5 w-4.5 animate-spin" />}
              {diaryId ? "Save Changes" : "Save Watch"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
