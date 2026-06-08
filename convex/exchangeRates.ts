import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const getRates = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("exchangeRates")
      .withIndex("by_base", (q) => q.eq("base", "USD"))
      .first();
  },
});

export const updateRates = mutation({
  args: {
    rates: v.record(v.string(), v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("exchangeRates")
      .withIndex("by_base", (q) => q.eq("base", "USD"))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        rates: args.rates,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      return await ctx.db.insert("exchangeRates", {
        base: "USD",
        rates: args.rates,
        updatedAt: Date.now(),
      });
    }
  },
});

export const fetchAndStoreRates = action({
  args: {},
  handler: async (ctx) => {
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/USD");
      if (!response.ok) {
        throw new Error(
          `Failed to fetch exchange rates: ${response.statusText}`,
        );
      }
      const data = (await response.json()) as {
        rates?: Record<string, number>;
      };

      if (data && data.rates) {
        const rates: Record<string, number> = {};
        for (const [key, val] of Object.entries(data.rates)) {
          if (typeof val === "number") {
            rates[key] = val;
          }
        }

        await ctx.runMutation(api.exchangeRates.updateRates, { rates });
        return { success: true, rates };
      } else {
        throw new Error("Invalid response format from exchange rate API");
      }
    } catch (error) {
      console.error("Error in fetchAndStoreRates:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
});
