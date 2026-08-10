"use client";

import { authClient } from "@/lib/auth-client";
import NotificationPromptModal from "./notification-prompt-modal";

export function NotificationProvider() {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;

  return <NotificationPromptModal isLoggedIn={isLoggedIn} />;
}
