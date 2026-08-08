import { useQueryState, parseAsBoolean } from "nuqs";
import { QUERY_PARAMS } from "@/lib/constants";

export function useAuthModalStore<T = { isOpen: boolean; open: () => void; close: () => void }>(
  selector?: (state: { isOpen: boolean; open: () => void; close: () => void }) => T
): T {
  const [isOpenState, setIsOpenState] = useQueryState(
    QUERY_PARAMS.AUTH,
    parseAsBoolean.withDefault(false).withOptions({ history: "push" })
  );

  const state = {
    isOpen: isOpenState,
    open: () => {
      setIsOpenState(true);
    },
    close: () => {
      setIsOpenState(false);
    },
  };

  if (selector) {
    return selector(state);
  }
  return state as unknown as T;
}
