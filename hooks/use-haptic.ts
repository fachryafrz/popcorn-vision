"use client";

import { useCallback } from "react";
import { haptics, triggerHaptic, type HapticPreset } from "@/lib/haptics";

export function useHaptic() {
  const trigger = useCallback((preset: HapticPreset = "light") => {
    return triggerHaptic(preset);
  }, []);

  return {
    trigger,
    selection: haptics.selection,
    light: haptics.light,
    medium: haptics.medium,
    heavy: haptics.heavy,
    success: haptics.success,
    warning: haptics.warning,
    custom: haptics.custom,
  };
}
