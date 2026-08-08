import { useQueryState, parseAsBoolean, parseAsInteger, createParser } from "nuqs";
import { QUERY_PARAMS } from "@/lib/constants";

export interface MediaRef {
  id: string;
  media_type: "movie" | "tv";
}

export const parseAsMediaRef = createParser<MediaRef>({
  parse(value) {
    const [type, id] = value.split("-");
    if (!type || !id || (type !== "movie" && type !== "tv")) return null;
    return { id, media_type: type as "movie" | "tv" };
  },
  serialize(value) {
    return `${value.media_type}-${value.id}`;
  }
});

export function useQuickViewMediaState() {
  return useQueryState(
    QUERY_PARAMS.QUICK_VIEW,
    parseAsMediaRef.withOptions({ history: "push" })
  );
}

export function useQuickViewPersonState() {
  return useQueryState(
    QUERY_PARAMS.PERSON,
    parseAsInteger.withOptions({ history: "push" })
  );
}

export function useAuthQueryState() {
  return useQueryState(
    QUERY_PARAMS.AUTH,
    parseAsBoolean.withDefault(false).withOptions({ history: "push" })
  );
}
