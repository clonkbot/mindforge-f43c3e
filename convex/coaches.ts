import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const myCoaches = await ctx.db
      .query("coaches")
      .withIndex("by_creator", (q) => q.eq("creatorId", userId))
      .collect();

    const publicCoaches = await ctx.db
      .query("coaches")
      .withIndex("by_public", (q) => q.eq("isPublic", true))
      .collect();

    const allCoaches = [...myCoaches];
    for (const coach of publicCoaches) {
      if (!allCoaches.find(c => c._id === coach._id)) {
        allCoaches.push(coach);
      }
    }

    return allCoaches.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getByShareCode = query({
  args: { shareCode: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("coaches")
      .withIndex("by_share_code", (q) => q.eq("shareCode", args.shareCode))
      .first();
  },
});

export const get = query({
  args: { id: v.id("coaches") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    persona: v.string(),
    description: v.string(),
    avatar: v.string(),
    systemPrompt: v.string(),
    tone: v.string(),
    specialty: v.string(),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const shareCode = Math.random().toString(36).substring(2, 10);

    return await ctx.db.insert("coaches", {
      ...args,
      creatorId: userId,
      shareCode,
      usageCount: 0,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("coaches"),
    name: v.string(),
    persona: v.string(),
    description: v.string(),
    avatar: v.string(),
    systemPrompt: v.string(),
    tone: v.string(),
    specialty: v.string(),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const coach = await ctx.db.get(args.id);
    if (!coach || coach.creatorId !== userId) {
      throw new Error("Not authorized");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("coaches") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const coach = await ctx.db.get(args.id);
    if (!coach || coach.creatorId !== userId) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.id);
  },
});

export const incrementUsage = mutation({
  args: { id: v.id("coaches") },
  handler: async (ctx, args) => {
    const coach = await ctx.db.get(args.id);
    if (!coach) throw new Error("Coach not found");

    await ctx.db.patch(args.id, {
      usageCount: coach.usageCount + 1,
    });
  },
});

export const cloneCoach = mutation({
  args: { shareCode: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const original = await ctx.db
      .query("coaches")
      .withIndex("by_share_code", (q) => q.eq("shareCode", args.shareCode))
      .first();

    if (!original) throw new Error("Coach not found");

    const newShareCode = Math.random().toString(36).substring(2, 10);

    return await ctx.db.insert("coaches", {
      name: original.name,
      persona: original.persona,
      description: original.description,
      avatar: original.avatar,
      systemPrompt: original.systemPrompt,
      tone: original.tone,
      specialty: original.specialty,
      creatorId: userId,
      isPublic: false,
      shareCode: newShareCode,
      usageCount: 0,
      createdAt: Date.now(),
    });
  },
});
