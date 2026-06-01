"use client";

import React, { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
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
}: LogWatchModalProps) {
  const [watchedDate, setWatchedDate] = useState("");
  const [rewatch, setRewatch] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const logWatchMutation = useMutation(api.diary.logWatch);
  const editDiaryEntryMutation = useMutation(api.diary.editDiaryEntry);

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
  }, [isOpen, diaryId, initialWatchedDate, initialRewatch, initialRating, initialReview]);

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
        });
        toast.success(`Updated watch log for "${title}" successfully!`);
      } else {
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
      <DialogContent className="max-w-md bg-zinc-950 border border-zinc-800 text-white rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            {diaryId ? "Edit Watch Log" : "Log Watch"}
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-xs mt-1">
            Log this title to your diary. Records your watched date, ratings, and diary notes.
          </DialogDescription>
        </DialogHeader>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="flex gap-4 items-start bg-zinc-900/10 p-3.5 border border-zinc-900 rounded-2xl">
            <div className="h-16 w-12 rounded-lg bg-zinc-900 overflow-hidden border border-zinc-800 shrink-0">
              {posterPath ? (
                <img
                  src={`https://image.tmdb.org/t/p/w92${posterPath}`}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-white truncate leading-snug">{title}</h4>
              <p className="text-[10px] text-zinc-500 mt-1 uppercase font-semibold">
                {mediaType} • {releaseYear}
              </p>
            </div>
          </div>

          {/* Watched Date */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Watched Date
            </Label>
            <Input
              type="date"
              value={watchedDate}
              onChange={(e) => setWatchedDate(e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-white rounded-xl focus-visible:ring-1 focus-visible:ring-zinc-700 focus-visible:border-zinc-800"
              required
            />
          </div>

          {/* Star Rating Selectors (5 stars supporting half stars, scales to 1-10) */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
              Rating {rating > 0 ? `(${rating / 2} stars)` : <span className="text-zinc-600 font-normal italic">(optional)</span>}
            </Label>
            <div className="flex items-center gap-1.5 py-1">
              {Array.from({ length: 5 }).map((_, starIndex) => {
                const starPosition = starIndex + 1;
                const leftValue = starPosition * 2 - 1;
                const rightValue = starPosition * 2;
                
                const displayRating = hoveredRating || rating;
                
                return (
                  <div className="relative hover:scale-115 transition-transform duration-100 h-6 w-6 shrink-0" key={starIndex}>
                    {/* Base Empty Star */}
                    <Star className="h-6 w-6 text-zinc-700" />
                    
                    {/* Half Filled Overlay */}
                    {displayRating === leftValue && (
                      <div className="absolute top-0 left-0 w-1/2 overflow-hidden pointer-events-none">
                        <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                      </div>
                    )}
                    
                    {/* Fully Filled Overlay */}
                    {displayRating >= rightValue && (
                      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none">
                        <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                      </div>
                    )}
                    
                    {/* Hover/Click Areas */}
                    <div className="absolute inset-0 flex">
                      <button
                        type="button"
                        onMouseEnter={() => setHoveredRating(leftValue)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => setRating(rating === leftValue ? 0 : leftValue)}
                        className="w-1/2 h-full cursor-pointer bg-transparent border-none p-0 outline-none"
                        title={`Rate ${leftValue / 2} stars`}
                      />
                      <button
                        type="button"
                        onMouseEnter={() => setHoveredRating(rightValue)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => setRating(rating === rightValue ? 0 : rightValue)}
                        className="w-1/2 h-full cursor-pointer bg-transparent border-none p-0 outline-none"
                        title={`Rate ${rightValue / 2} stars`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rewatch Checker */}
          <div className="flex items-center gap-3 py-1 bg-zinc-900/10 border border-zinc-900/50 p-3 rounded-2xl">
            <Checkbox
              id="rewatch-check"
              checked={rewatch}
              onCheckedChange={(checked) => setRewatch(checked === true)}
              className="rounded-lg h-5 w-5 border-zinc-800 bg-zinc-950 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
            />
            <div className="flex-1 min-w-0">
              <Label
                htmlFor="rewatch-check"
                className="text-xs font-bold text-white block cursor-pointer select-none"
              >
                I&apos;ve watched this film before
              </Label>
              <span className="text-[10px] text-zinc-500 font-medium leading-none mt-0.5 block">
                Flag this entry as a rewatch log
              </span>
            </div>
          </div>

          {/* Review / Notes */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Diary Notes / Review
              </Label>
              <span className="text-[10px] text-zinc-600 font-bold select-none">optional</span>
            </div>
            <Textarea
              placeholder="Jot down your thoughts, tags, or a full movie review for this watch..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={3}
              className="bg-zinc-900 border-zinc-800 text-white rounded-xl resize-none focus-visible:ring-1 focus-visible:ring-zinc-700 focus-visible:border-zinc-800 text-xs min-h-[80px]"
            />
          </div>

          {/* Actions button triggers */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-900">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl h-9 text-xs font-semibold cursor-pointer border-zinc-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              size="sm"
              className="rounded-xl h-9 text-xs font-bold bg-white text-black hover:bg-zinc-200 cursor-pointer shadow-md"
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
