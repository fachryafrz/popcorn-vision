"use client";

import { useEffect } from "react";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "@/convex/_generated/api";
import {
  ServerTemplate,
  StreamingUrlParams,
  FormattedServerSource,
  formatStreamingServers,
} from "@/lib/streamingProviderList";

export type { ServerTemplate, StreamingUrlParams, FormattedServerSource };

// Global in-memory variable updated in effect
let globalStreamingServers: ServerTemplate[] | null = null;

export function invalidateStreamingServersCache() {
  globalStreamingServers = null;
}

/**
 * Hook to retrieve streaming servers strictly from Convex database.
 * Uses convex-helpers/react/cache to cache results globally in memory
 * and update reactively whenever the database changes.
 */
export function useStreamingServers(
  params: StreamingUrlParams,
): FormattedServerSource[] {
  const dbServers = useQuery(api.streamingServers.getActiveServers);

  useEffect(() => {
    if (dbServers !== undefined) {
      globalStreamingServers = dbServers;
    }
  }, [dbServers]);

  const activeServers = dbServers ?? globalStreamingServers ?? [];

  return formatStreamingServers(activeServers, params);
}
