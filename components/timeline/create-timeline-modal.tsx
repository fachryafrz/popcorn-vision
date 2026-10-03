"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Layers, Globe, Lock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLOR_PRESETS = [
  { name: "Marvel Red", value: "#E50914" },
  { name: "Star Wars Blue", value: "#3B82F6" },
  { name: "TVA Amber", value: "#F59E0B" },
  { name: "Multiverse Purple", value: "#8B5CF6" },
  { name: "Matrix Emerald", value: "#10B981" },
  { name: "Cyberpunk Pink", value: "#EC4899" },
  { name: "Golden Lore", value: "#EAB308" },
];

export function CreateTimelineModal({ isOpen, onClose }: CreateTimelineModalProps) {
  const router = useRouter();
  const createTimelineMutation = useMutation(api.timelines.createTimeline);

  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [accentColor, setAccentColor] = useState(COLOR_PRESETS[0].value);
  const [privacy, setPrivacy] = useState<"public" | "private">("public");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!shortName || shortName === name.slice(0, 15)) {
      setShortName(val.slice(0, 15));
    }
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setSlug(autoSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a timeline name");
      return;
    }
    if (!slug.trim()) {
      toast.error("Please enter a unique slug identifier");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await createTimelineMutation({
        name: name.trim(),
        shortName: (shortName || name).trim(),
        slug: slug.trim(),
        description: description.trim() || `Explore the chronological and branching timeline of ${name}.`,
        accentColor,
        privacy,
      });

      toast.success(`Timeline "${name}" created successfully!`);
      onClose();
      // Reset form
      setName("");
      setShortName("");
      setSlug("");
      setDescription("");
      router.push(`/timeline/${res.id}`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to create timeline";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg bg-zinc-950 border-zinc-800 text-zinc-100 rounded-3xl p-6 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Layers className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Timeline Builder</span>
          </div>
          <DialogTitle className="text-xl font-black text-white">
            Create Custom Franchise Timeline
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-300">
            Build your own interactive universe timeline with chronological media order, custom multiverse branches, and share it with the community.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          {/* Timeline Title */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="timeline-name" className="text-xs font-bold text-zinc-200">
              Universe / Franchise Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="timeline-name"
              placeholder="e.g. MonsterVerse, DC Extended Universe, Studio Ghibli"
              value={name}
              onChange={handleNameChange}
              required
              className="bg-zinc-900 border-zinc-700 focus:border-primary text-white text-sm rounded-xl h-10 focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          {/* Short Name & Slug Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="timeline-shortname" className="text-xs font-bold text-zinc-200">
                Short Name / Acronym
              </Label>
              <Input
                id="timeline-shortname"
                placeholder="e.g. MonsterVerse, DCEU"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                className="bg-zinc-900 border-zinc-700 focus:border-primary text-white text-sm rounded-xl h-10 focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="timeline-slug" className="text-xs font-bold text-zinc-200">
                URL Identifier <span className="text-red-400">*</span>
              </Label>
              <Input
                id="timeline-slug"
                placeholder="e.g. monsterverse"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                required
                className="bg-zinc-900 border-zinc-700 focus:border-primary text-white text-sm rounded-xl h-10 font-mono focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="timeline-desc" className="text-xs font-bold text-zinc-200">
              Description / Synopsis
            </Label>
            <Textarea
              id="timeline-desc"
              placeholder="Tell viewers about this franchise, what era it covers, and why the timeline was structured this way..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="bg-zinc-900 border-zinc-700 focus:border-primary text-white text-xs rounded-xl resize-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          {/* Accent Color Picker */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-bold text-zinc-200">Accent Theme Color</Label>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {COLOR_PRESETS.map((c) => {
                const isSelected = accentColor === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setAccentColor(c.value)}
                    aria-label={`Color preset ${c.name}`}
                    title={c.name}
                    className={cn(
                      "h-8 w-8 rounded-full transition-transform cursor-pointer border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                      isSelected
                        ? "scale-110 border-white ring-2 ring-primary/50 shadow-md"
                        : "border-transparent opacity-80 hover:opacity-100 hover:scale-105",
                    )}
                    style={{ backgroundColor: c.value }}
                  />
                );
              })}
            </div>
          </div>

          {/* Privacy Toggle */}
          <div className="flex flex-col gap-1.5 pt-1">
            <Label className="text-xs font-bold text-zinc-200">Privacy & Visibility</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPrivacy("public")}
                className={cn(
                  "flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  privacy === "public"
                    ? "bg-zinc-800/90 border-primary text-white font-bold"
                    : "bg-zinc-900/60 border-zinc-700 text-zinc-300 hover:text-white",
                )}
              >
                <Globe className="h-4 w-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="leading-none text-zinc-100 font-bold">Public</p>
                  <p className="text-[10px] text-zinc-300 font-normal mt-0.5">Discoverable by community</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPrivacy("private")}
                className={cn(
                  "flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  privacy === "private"
                    ? "bg-zinc-800/90 border-primary text-white font-bold"
                    : "bg-zinc-900/60 border-zinc-700 text-zinc-300 hover:text-white",
                )}
              >
                <Lock className="h-4 w-4 text-amber-400 shrink-0" />
                <div>
                  <p className="leading-none text-zinc-100 font-bold">Private</p>
                  <p className="text-[10px] text-zinc-300 font-normal mt-0.5">Visible only to you</p>
                </div>
              </button>
            </div>
          </div>

          <DialogFooter className="mt-4 flex sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 rounded-full text-xs h-9 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-white font-bold rounded-full text-xs h-9 px-5 cursor-pointer shadow-lg shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Creating Universe...
                </>
              ) : (
                "Create & Open Canvas"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
