"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export interface CanvasTransform {
  x: number;
  y: number;
  scale: number;
}

interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

interface UseCanvasPanZoomOptions {
  minScale?: number;
  maxScale?: number;
  initialScale?: number;
  initialX?: number;
  initialY?: number;
}

export function useCanvasPanZoom({
  minScale = 0.1,
  maxScale = 3.5,
  initialScale = 0.65,
  initialX = 100,
  initialY = 150,
}: UseCanvasPanZoomOptions = {}) {
  const [transform, setTransform] = useState<CanvasTransform>({
    x: initialX,
    y: initialY,
    scale: initialScale,
  });

  const transformRef = useRef<CanvasTransform>(transform);

  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const touchStartDistRef = useRef<number | null>(null);
  const touchStartScaleRef = useRef<number>(initialScale);
  const touchStartMidpointRef = useRef<{ x: number; y: number } | null>(null);

  // Set transform with clamping
  const updateTransform = useCallback(
    (updater: (prev: CanvasTransform) => CanvasTransform) => {
      setTransform((prev) => {
        const next = updater(prev);
        const clampedScale = Math.min(Math.max(next.scale, minScale), maxScale);
        return {
          x: next.x,
          y: next.y,
          scale: clampedScale,
        };
      });
    },
    [minScale, maxScale],
  );

  // Zoom at specific screen coordinates
  const zoomAtPoint = useCallback(
    (screenX: number, screenY: number, factor: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const originX = screenX - rect.left;
      const originY = screenY - rect.top;

      setTransform((prev) => {
        const newScale = Math.min(Math.max(prev.scale * factor, minScale), maxScale);
        const scaleChange = newScale / prev.scale;
        const newX = originX - (originX - prev.x) * scaleChange;
        const newY = originY - (originY - prev.y) * scaleChange;

        return {
          x: newX,
          y: newY,
          scale: newScale,
        };
      });
    },
    [minScale, maxScale],
  );

  // Zoom In / Zoom Out controls
  const zoomIn = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    zoomAtPoint(rect.left + rect.width / 2, rect.top + rect.height / 2, 1.3);
  }, [zoomAtPoint]);

  const zoomOut = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    zoomAtPoint(rect.left + rect.width / 2, rect.top + rect.height / 2, 0.77);
  }, [zoomAtPoint]);

  // Fit View
  const fitView = useCallback(
    (bounds?: Bounds, padding = 80) => {
      const container = containerRef.current;
      if (!container || !bounds) return;

      const rect = container.getBoundingClientRect();
      const contentWidth = Math.max(bounds.maxX - bounds.minX, 100);
      const contentHeight = Math.max(bounds.maxY - bounds.minY, 100);

      const scaleX = (rect.width - padding * 2) / contentWidth;
      const scaleY = (rect.height - padding * 2) / contentHeight;
      const targetScale = Math.min(Math.max(Math.min(scaleX, scaleY), minScale), 1.0);

      const centerX = (bounds.minX + bounds.maxX) / 2;
      const centerY = (bounds.minY + bounds.maxY) / 2;

      const targetX = rect.width / 2 - centerX * targetScale;
      const targetY = rect.height / 2 - centerY * targetScale;

      setTransform({
        x: targetX,
        y: targetY,
        scale: targetScale,
      });
    },
    [minScale],
  );

  // Reset to initial position
  const resetView = useCallback(() => {
    setTransform({
      x: initialX,
      y: initialY,
      scale: initialScale,
    });
  }, [initialX, initialY, initialScale]);

  // Pointer / Mouse Down
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Only left click or middle click
    if (e.button !== 0 && e.button !== 1) return;

    // Do not drag if clicking an interactive element (button, link, input)
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("a") ||
      target.closest("input") ||
      target.closest(".nodrag")
    ) {
      return;
    }

    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  // Pointer Move (Pan)
  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    setTransform((prev) => ({
      ...prev,
      x: prev.x + dx,
      y: prev.y + dy,
    }));
  }, []);

  // Pointer Up
  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if already released
      }
    }
  }, []);

  // Wheel listener with passive: false for seamless Trackpad pinch & pan
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Horizontal trackpad swipe only
      if (Math.abs(e.deltaX) > 0 && Math.abs(e.deltaY) < 2) {
        setTransform((prev) => ({
          ...prev,
          x: prev.x - e.deltaX * 1.2,
        }));
        return;
      }

      // Shift + scroll for horizontal pan
      if (e.shiftKey) {
        setTransform((prev) => ({
          ...prev,
          x: prev.x - (e.deltaY || e.deltaX) * 1.2,
        }));
        return;
      }

      // Mouse scroll & pinch directly zooms in/out centered at mouse pointer (Queuebrick behavior)
      let factor: number;
      if (e.ctrlKey) {
        // Trackpad pinch gesture (browsers send ctrlKey + deltaY)
        factor = Math.exp(-e.deltaY * 0.008);
      } else {
        // Normal mouse wheel scroll (noticeable zoom per scroll notch)
        const clampedDelta = Math.min(Math.max(e.deltaY, -120), 120);
        factor = Math.exp(-clampedDelta * 0.0025);
      }
      zoomAtPoint(e.clientX, e.clientY, factor);
    };

    // Touch gesture handlers for mobile pinch-to-zoom
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        touchStartDistRef.current = dist;
        touchStartScaleRef.current = transformRef.current.scale;
        touchStartMidpointRef.current = {
          x: (t1.clientX + t2.clientX) / 2,
          y: (t1.clientY + t2.clientY) / 2,
        };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchStartDistRef.current !== null) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const factor = currentDist / touchStartDistRef.current;

        const midpoint = touchStartMidpointRef.current ?? {
          x: (t1.clientX + t2.clientX) / 2,
          y: (t1.clientY + t2.clientY) / 2,
        };

        const targetScale = Math.min(
          Math.max(touchStartScaleRef.current * factor, minScale),
          maxScale,
        );

        const containerRect = container.getBoundingClientRect();
        const originX = midpoint.x - containerRect.left;
        const originY = midpoint.y - containerRect.top;

        setTransform((prev) => {
          const scaleRatio = targetScale / prev.scale;
          return {
            x: originX - (originX - prev.x) * scaleRatio,
            y: originY - (originY - prev.y) * scaleRatio,
            scale: targetScale,
          };
        });
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        touchStartDistRef.current = null;
        touchStartMidpointRef.current = null;
      }
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [zoomAtPoint, minScale, maxScale]);

  return {
    transform,
    containerRef,
    zoomIn,
    zoomOut,
    fitView,
    resetView,
    updateTransform,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
}
