"use client";

import { useSyncExternalStore } from "react";

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isEnded: boolean;
  isImminent: boolean; // within 24 hours
  isMounted: boolean;
  formattedText: string;
}

// Global clock tick subscriber for all countdown timers (super efficient, single interval!)
let currentTime = Date.now();
const listeners = new Set<() => void>();
let intervalId: ReturnType<typeof setInterval> | null = null;

function subscribe(callback: () => void) {
  listeners.add(callback);
  if (listeners.size === 1 && typeof window !== "undefined") {
    intervalId = setInterval(() => {
      currentTime = Date.now();
      listeners.forEach((listener) => listener());
    }, 1000);
  }
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0 && intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
}

function getSnapshot() {
  return currentTime;
}

function getServerSnapshot() {
  return 0;
}

export function useCountdown(
  targetDate: string | number | Date | null | undefined,
): CountdownResult {
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isMounted = now > 0;

  if (!targetDate || !isMounted) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isEnded: false,
      isImminent: false,
      isMounted,
      formattedText: "",
    };
  }

  const targetTime = new Date(targetDate).getTime();
  if (isNaN(targetTime)) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isEnded: false,
      isImminent: false,
      isMounted: true,
      formattedText: "",
    };
  }

  const timeRemaining = Math.max(0, Math.floor((targetTime - now) / 1000));
  const days = Math.floor(timeRemaining / (3600 * 24));
  const hours = Math.floor((timeRemaining % (3600 * 24)) / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = Math.floor(timeRemaining % 60);

  const isEnded = timeRemaining <= 0;
  const isImminent = !isEnded && timeRemaining < 3600 * 24;

  let formattedText = "";
  if (isEnded) {
    formattedText = "Released / Airing now";
  } else if (days > 0) {
    formattedText = `${days}d ${hours}h left`;
  } else if (hours > 0) {
    formattedText = `${hours}h ${minutes}m left`;
  } else if (minutes > 0) {
    formattedText = `${minutes}m ${seconds}s left`;
  } else {
    formattedText = `${seconds}s left`;
  }

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds: timeRemaining,
    isEnded,
    isImminent,
    isMounted: true,
    formattedText,
  };
}
