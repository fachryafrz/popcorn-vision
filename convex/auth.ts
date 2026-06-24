import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { betterAuth } from "better-auth/minimal";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import authConfig from "./auth.config";
import { username } from "better-auth/plugins";
import { siteConfig } from "@/config/site";
import { getResetPasswordEmailHtml } from "./emails";

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    database: authComponent.adapter(ctx),
    secret:
      process.env.BETTER_AUTH_SECRET ||
      "default_local_dev_secret_for_popcorn_vision_32_chars_long",
    trustedOrigins: [process.env.SITE_URL || "http://localhost:3000"],
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 days
    },
    plugins: [convex({ authConfig }), username()],
    user: {
      deleteUser: {
        enabled: true,
      },
    },
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async (data) => {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
          console.log(
            `\n========================================\n[RESET PASSWORD - DEV MODE] Link for ${data.user.email}:\n${data.url}\n========================================\n`,
          );
          return;
        }

        try {
          const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              from: `${siteConfig.name} <noreply@fachryafrz.com>`,
              to: data.user.email,
              subject: `Reset your ${siteConfig.name} Password`,
              html: getResetPasswordEmailHtml(data.user.name, data.url),
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
              `Resend API error: ${response.status} - ${errorText}`,
            );
          }
          console.log(
            `Password reset email sent successfully to ${data.user.email} via Resend.`,
          );
        } catch (error) {
          console.error(
            "Failed to send password reset email via Resend:",
            error,
          );
          console.log(
            `\n================[FALLBACK RESET PASSWORD]================\nLink for ${data.user.email}:\n${data.url}\n=========================================================\n`,
          );
        }
      },
    },
  });
};
