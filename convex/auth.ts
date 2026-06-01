import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { betterAuth } from "better-auth/minimal";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import authConfig from "./auth.config";
import { username } from "better-auth/plugins";

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    database: authComponent.adapter(ctx),
    secret: process.env.BETTER_AUTH_SECRET || "default_local_dev_secret_for_popcorn_vision_32_chars_long",
    trustedOrigins: [process.env.SITE_URL || "http://localhost:3000"],
    plugins: [
      convex({ authConfig }),
      username()
    ],
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
          console.log(`\n========================================\n[RESET PASSWORD - DEV MODE] Link for ${data.user.email}:\n${data.url}\n========================================\n`);
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
              from: "Popcorn Vision <onboarding@resend.dev>",
              to: data.user.email,
              subject: "Reset your Popcorn Vision Password",
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1f2937;">
                  <h2 style="font-size: 24px; font-weight: bold; color: #111827; margin-bottom: 16px;">Reset your Popcorn Vision Password</h2>
                  <p style="margin-bottom: 24px;">Hello ${data.user.name || "there"},</p>
                  <p style="margin-bottom: 24px;">We received a request to reset the password for your Popcorn Vision account. Click the button below to set a new password:</p>
                  <div style="margin-bottom: 32px;">
                    <a href="${data.url}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 12px; font-weight: 600; text-decoration: none;">Reset Password</a>
                  </div>
                  <p style="margin-bottom: 12px;">Or copy and paste this URL into your browser:</p>
                  <p style="word-break: break-all; color: #4b5563; font-size: 14px; background-color: #f3f4f6; padding: 12px; border-radius: 8px;">${data.url}</p>
                  <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
                  <p style="font-size: 12px; color: #9ca3af;">If you did not request a password reset, you can safely ignore this email.</p>
                </div>
              `,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Resend API error: ${response.status} - ${errorText}`);
          }
          console.log(`Password reset email sent successfully to ${data.user.email} via Resend.`);
        } catch (error) {
          console.error("Failed to send password reset email via Resend:", error);
          console.log(`\n================[FALLBACK RESET PASSWORD]================\nLink for ${data.user.email}:\n${data.url}\n=========================================================\n`);
        }
      },
    },
  });
};
