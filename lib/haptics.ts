/**
 * Universal Haptic Feedback utility using Web Vibration API.
 * Safely checks for browser/hardware support and falls back gracefully.
 */

export type HapticPreset = "light" | "medium" | "heavy" | "success" | "warning" | "selection";

const HAPTIC_PATTERNS: Record<HapticPreset, number | number[]> = {
  selection: 5,
  light: 10,
  medium: 25,
  heavy: 40,
  success: [15, 40, 15],
  warning: [30, 50, 30],
};

export const triggerHaptic = (preset: HapticPreset = "light"): boolean => {
  if (typeof window === "undefined" || !("navigator" in window) || !("vibrate" in navigator)) {
    return false;
  }

  try {
    const pattern = HAPTIC_PATTERNS[preset];
    return navigator.vibrate(pattern);
  } catch {
    return false;
  }
};

export const haptics = {
  selection: () => triggerHaptic("selection"),
  light: () => triggerHaptic("light"),
  medium: () => triggerHaptic("medium"),
  heavy: () => triggerHaptic("heavy"),
  success: () => triggerHaptic("success"),
  warning: () => triggerHaptic("warning"),
  custom: (pattern: number | number[]): boolean => {
    if (typeof window === "undefined" || !("navigator" in window) || !("vibrate" in navigator)) {
      return false;
    }
    try {
      return navigator.vibrate(pattern);
    } catch {
      return false;
    }
  },
};
