"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  Info,
  ThumbsUp,
  Zap,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

export interface ManagedServerItem {
  _id?: Id<"streamingServers">;
  title: string;
  movieUrl: string;
  tvUrl: string;
  order: number;
  recommended?: boolean;
  fast?: boolean;
  ads?: boolean;
  isActive: boolean;
}

export interface ServerFormData {
  title: string;
  movieUrl: string;
  tvUrl: string;
  order: number;
  recommended: boolean;
  fast: boolean;
  ads: boolean;
  isActive: boolean;
}

interface ServerFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ManagedServerItem | null;
  defaultOrder?: number;
  onSave: (data: ServerFormData) => Promise<void>;
}

interface ServerFormInnerProps {
  initialData?: ManagedServerItem | null;
  defaultOrder: number;
  onClose: () => void;
  onSave: (data: ServerFormData) => Promise<void>;
}

function ServerFormInner({
  initialData,
  defaultOrder,
  onClose,
  onSave,
}: ServerFormInnerProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [movieUrl, setMovieUrl] = useState(initialData?.movieUrl ?? "");
  const [tvUrl, setTvUrl] = useState(initialData?.tvUrl ?? "");
  const [order, setOrder] = useState(initialData?.order ?? defaultOrder);
  const [recommended, setRecommended] = useState(Boolean(initialData?.recommended));
  const [fast, setFast] = useState(Boolean(initialData?.fast));
  const [ads, setAds] = useState(
    initialData?.ads !== undefined ? Boolean(initialData?.ads) : true,
  );
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedMovieUrl = movieUrl.trim();
    const trimmedTvUrl = tvUrl.trim();

    if (!trimmedTitle) {
      toast.error("Server name is required");
      return;
    }

    if (!trimmedMovieUrl && !trimmedTvUrl) {
      toast.error("Please provide at least one URL template (Movie or TV)");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        title: trimmedTitle,
        movieUrl: trimmedMovieUrl,
        tvUrl: trimmedTvUrl,
        order: Number(order) || 1,
        recommended,
        fast,
        ads,
        isActive,
      });
      toast.success(
        initialData ? "Server updated successfully" : "Server added successfully",
      );
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save server";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pt-3">
      {/* Helper tags banner */}
      <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 p-3.5 text-xs text-sky-200">
        <div className="flex items-center gap-2 font-semibold">
          <Info className="h-4 w-4 shrink-0 text-sky-400" />
          <span>Available Dynamic Placeholders</span>
        </div>
        <p className="mt-1 text-zinc-300">
          Use{" "}
          <code className="rounded bg-sky-950/80 px-1.5 py-0.5 font-mono text-sky-300">
            {"{id}"}
          </code>{" "}
          for TMDB Media ID,{" "}
          <code className="rounded bg-sky-950/80 px-1.5 py-0.5 font-mono text-sky-300">
            {"{season}"}
          </code>{" "}
          for TV season, and{" "}
          <code className="rounded bg-sky-950/80 px-1.5 py-0.5 font-mono text-sky-300">
            {"{episode}"}
          </code>{" "}
          for TV episode.
        </p>
      </div>

      {/* Server Title & Order */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="server-title" className="text-xs font-semibold text-zinc-300">
            Server Name <span className="text-rose-400">*</span>
          </Label>
          <Input
            id="server-title"
            placeholder="e.g. VidLink, AutoEmbed"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="rounded-xl border-zinc-800 bg-zinc-900/80 text-white placeholder:text-zinc-600 focus-visible:ring-primary"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="server-order" className="text-xs font-semibold text-zinc-300">
            Priority Order
          </Label>
          <Input
            id="server-order"
            type="number"
            min={1}
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value, 10) || 1)}
            className="rounded-xl border-zinc-800 bg-zinc-900/80 text-white focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Movie URL Template */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="movie-url" className="text-xs font-semibold text-zinc-300">
            Movie Embed URL Template
          </Label>
          <span className="font-mono text-[11px] text-zinc-500">{"{id}"}</span>
        </div>
        <Input
          id="movie-url"
          placeholder="https://example.com/movie/{id}?autoplay=false"
          value={movieUrl}
          onChange={(e) => setMovieUrl(e.target.value)}
          className="rounded-xl border-zinc-800 bg-zinc-900/80 font-mono text-xs text-white placeholder:text-zinc-600 focus-visible:ring-primary"
        />
      </div>

      {/* TV URL Template */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="tv-url" className="text-xs font-semibold text-zinc-300">
            TV Embed URL Template
          </Label>
          <span className="font-mono text-[11px] text-zinc-500">
            {"{id}"}, {"{season}"}, {"{episode}"}
          </span>
        </div>
        <Input
          id="tv-url"
          placeholder="https://example.com/tv/{id}/{season}/{episode}"
          value={tvUrl}
          onChange={(e) => setTvUrl(e.target.value)}
          className="rounded-xl border-zinc-800 bg-zinc-900/80 font-mono text-xs text-white placeholder:text-zinc-600 focus-visible:ring-primary"
        />
      </div>

      {/* Flags & Toggles */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-zinc-300">
          Server Settings & Badges
        </Label>
        <div className="grid grid-cols-1 gap-2.5">
          {/* Active Status */}
          <div
            onClick={() => setIsActive(!isActive)}
            className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-3 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <div
                className={`shrink-0 rounded-xl p-2 ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-xs font-bold text-white">Active Status</span>
                <span className="truncate text-[11px] text-zinc-400">
                  {isActive ? "Visible in player" : "Hidden from player"}
                </span>
              </div>
            </div>
            <Switch
              id="toggle-active"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Recommended */}
          <div
            onClick={() => setRecommended(!recommended)}
            className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-3 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <div
                className={`shrink-0 rounded-xl p-2 ${
                  recommended
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-xs font-bold text-white">Recommended</span>
                <span className="truncate text-[11px] text-zinc-400">
                  Highlight badge
                </span>
              </div>
            </div>
            <Switch
              id="toggle-recommended"
              checked={recommended}
              onCheckedChange={(checked) => setRecommended(checked)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Fast Server */}
          <div
            onClick={() => setFast(!fast)}
            className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-3 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <div
                className={`shrink-0 rounded-xl p-2 ${
                  fast
                    ? "bg-sky-500/10 text-sky-400"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                <Zap className="h-4 w-4" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-xs font-bold text-white">Fast Server</span>
                <span className="truncate text-[11px] text-zinc-400">
                  Low latency badge
                </span>
              </div>
            </div>
            <Switch
              id="toggle-fast"
              checked={fast}
              onCheckedChange={(checked) => setFast(checked)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Has Ads */}
          <div
            onClick={() => setAds(!ads)}
            className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-3 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <div
                className={`shrink-0 rounded-xl p-2 ${
                  ads
                    ? "bg-rose-500/10 text-rose-400"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-xs font-bold text-white">Has Ads</span>
                <span className="truncate text-[11px] text-zinc-400">
                  Ads notice badge
                </span>
              </div>
            </div>
            <Switch
              id="toggle-ads"
              checked={ads}
              onCheckedChange={(checked) => setAds(checked)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>

      <DialogFooter className="flex flex-col-reverse gap-2 pt-3 sm:flex-row sm:items-center sm:justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={onClose}
          className="w-full rounded-xl border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary/90 w-full rounded-xl px-5 font-bold text-white shadow-lg sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : initialData ? (
            "Save Changes"
          ) : (
            "Create Server"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function ServerFormDialog({
  isOpen,
  onOpenChange,
  initialData,
  defaultOrder = 1,
  onSave,
}: ServerFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-xl overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 p-4 text-white shadow-2xl sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            {initialData ? "Edit Streaming Server" : "Add New Streaming Server"}
          </DialogTitle>
        </DialogHeader>

        {isOpen && (
          <ServerFormInner
            key={initialData?._id ?? "new-server-form"}
            initialData={initialData}
            defaultOrder={defaultOrder}
            onClose={() => onOpenChange(false)}
            onSave={onSave}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
