"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";

interface AvatarCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File | null;
  onCropSave: (croppedBlob: Blob) => Promise<void>;
}

export default function AvatarCropModal({
  isOpen,
  onClose,
  imageFile,
  onCropSave,
}: AvatarCropModalProps) {
  const [imgSrc, setImgSrc] = useState("");
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [saving, setSaving] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Viewport and crop dimensions
  const viewportSize = 220;
  const cropSize = 256;

  // Track original dimensions
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, scale: 1 });

  // Read file on load
  useEffect(() => {
    if (!imageFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImgSrc(src);

      // Load image to compute base fit scale
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        // Base scale: fill viewport
        const baseScale = Math.max(viewportSize / w, viewportSize / h);
        setDimensions({ width: w, height: h, scale: baseScale });
        setZoom(1);
        setOffsetX(0);
        setOffsetY(0);
      };
      img.src = src;
    };
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    e.preventDefault();
    containerRef.current.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offsetX, y: e.clientY - offsetY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;

    // Constrain panning so the image stays within viewport bounds
    const maxPanX = Math.max(0, (dimensions.width * dimensions.scale * zoom - viewportSize) / 2);
    const maxPanY = Math.max(0, (dimensions.height * dimensions.scale * zoom - viewportSize) / 2);

    setOffsetX(Math.max(-maxPanX, Math.min(maxPanX, newX)));
    setOffsetY(Math.max(-maxPanY, Math.min(maxPanY, newY)));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleSave = async () => {
    if (!imgSrc || !dimensions.width) return;
    setSaving(true);

    try {
      const img = new Image();
      img.src = imgSrc;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = document.createElement("canvas");
      canvas.width = cropSize;
      canvas.height = cropSize;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Draw black background or clear
        ctx.clearRect(0, 0, cropSize, cropSize);

        // Map dimensions from viewport coords to canvas coords
        const renderScale = cropSize / viewportSize;
        const s = dimensions.scale * zoom * renderScale;
        const dw = dimensions.width * s;
        const dh = dimensions.height * s;
        const dx = (cropSize - dw) / 2 + offsetX * renderScale;
        const dy = (cropSize - dh) / 2 + offsetY * renderScale;

        ctx.drawImage(img, dx, dy, dw, dh);
      }

      // Convert canvas to Blob
      canvas.toBlob(
        async (blob) => {
          if (blob) {
            await onCropSave(blob);
            onClose();
          }
          setSaving(false);
        },
        "image/jpeg",
        0.9
      );
    } catch (err) {
      console.error("Cropping failed:", err);
      setSaving(false);
    }
  };

  const w = dimensions.width * dimensions.scale;
  const h = dimensions.height * dimensions.scale;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !saving && onClose()}>
      <DialogContent className="max-w-sm rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-300">
        <DialogTitle className="text-lg font-bold text-center tracking-tight bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Crop Your Avatar
        </DialogTitle>
        <DialogDescription className="text-xs text-zinc-500 text-center mt-1">
          Drag to pan and use the slider below to zoom your image.
        </DialogDescription>

        <div className="flex flex-col items-center justify-center my-6 gap-6">
          {/* Crop Viewport Window */}
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{ width: viewportSize, height: viewportSize }}
            className="rounded-full overflow-hidden relative border-2 border-blue-500/70 bg-zinc-900 shadow-inner cursor-move select-none touch-none"
          >
            {imgSrc && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                ref={imageRef}
                src={imgSrc}
                alt="Crop preview"
                style={{
                  position: "absolute",
                  width: w,
                  height: h,
                  left: "50%",
                  top: "50%",
                  transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
                  transformOrigin: "center",
                  pointerEvents: "none",
                  maxWidth: "none",
                }}
              />
            )}
            {/* Guide overlay ring */}
            <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none" />
          </div>

          {/* Zoom Slider */}
          <div className="w-full space-y-2 px-2">
            <div className="flex justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              <span>Zoom</span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <Slider
              value={[zoom]}
              onValueChange={(val) => {
                const singleVal = Array.isArray(val) ? val[0] : val;
                if (typeof singleVal === "number") {
                  setZoom(singleVal);
                }
              }}
              min={1}
              max={3}
              step={0.05}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-4">
          <Button
            variant="ghost"
            disabled={saving}
            onClick={onClose}
            className="rounded-xl border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer px-4"
          >
            Cancel
          </Button>
          <Button
            disabled={saving}
            onClick={handleSave}
            className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer px-5"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Avatar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
