import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  coaches: defineTable({
    name: v.string(),
    persona: v.string(),
    description: v.string(),
    avatar: v.string(),
    systemPrompt: v.string(),
    tone: v.string(),
    specialty: v.string(),
    creatorId: v.id("users"),
    isPublic: v.boolean(),
    shareCode: v.optional(v.string()),
    usageCount: v.number(),
    createdAt: v.number(),
  })
    .index("by_creator", ["creatorId"])
    .index("by_public", ["isPublic"])
    .index("by_share_code", ["shareCode"]),

  conversations: defineTable({
    coachId: v.id("coaches"),
    userId: v.id("users"),
    title: v.string(),
    lastMessageAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_coach", ["coachId"])
    .index("by_user_and_coach", ["userId", "coachId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_conversation", ["conversationId"]),
});
