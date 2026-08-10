"use node";

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import webpush from "web-push";

// Action to send push notification to user's registered devices
export const sendPushNotification = internalAction({
  args: {
    recipientUserId: v.string(),
    title: v.string(),
    body: v.string(),
    url: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const subject = process.env.VAPID_SUBJECT;

    if (!publicKey || !privateKey || !subject) {
      console.warn("VAPID keys not configured in Convex environment variables. Skipping push notification.");
      return;
    }

    webpush.setVapidDetails(subject, publicKey, privateKey);

    // Fetch user subscriptions using internal query
    const subscriptions = await ctx.runQuery(
      internal.push.getSubscriptionsByUserIdInternal,
      { userId: args.recipientUserId }
    );

    if (!subscriptions || subscriptions.length === 0) {
      return;
    }

    const payload = JSON.stringify({
      title: args.title,
      body: args.body,
      url: args.url || "/chat",
      icon: args.icon || "/favicon/android-chrome-192x192.png",
    });

    for (const subRecord of subscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: subRecord.subscription.endpoint,
            keys: subRecord.subscription.keys,
          },
          payload
        );
      } catch (err: unknown) {
        const errorObj = err as { statusCode?: number };
        if (errorObj?.statusCode === 404 || errorObj?.statusCode === 410) {
          await ctx.runMutation(internal.push.removeSubscriptionByIdInternal, {
            id: subRecord._id,
          });
        } else {
          console.error("Failed to send push notification:", err);
        }
      }
    }
  },
});
