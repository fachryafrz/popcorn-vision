import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { betterAuth } from "better-auth/minimal";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import authConfig from "./auth.config";

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    database: authComponent.adapter(ctx),
    secret: process.env.BETTER_AUTH_SECRET || "default_local_dev_secret_for_popcorn_vision_32_chars_long",
    trustedOrigins: [process.env.SITE_URL || "http://localhost:3000"],
    plugins: [convex({ authConfig })],
    emailAndPassword: {
      enabled: true,
    },
  });
};
