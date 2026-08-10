import { isAuthenticated, fetchAuthMutation } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";
import { Id } from "@/convex/_generated/dataModel";

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { chatId, content } = (await req.json()) as {
      chatId?: string;
      content?: string;
    };

    if (!chatId || !content) {
      return NextResponse.json(
        { error: "chatId and content are required" },
        { status: 400 }
      );
    }

    const messageId = await fetchAuthMutation(api.chats.sendMessage, {
      chatId: chatId as Id<"chats">,
      content,
    });

    return NextResponse.json({ success: true, messageId });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to send message";
    console.error("Error in notification reply API:", error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
