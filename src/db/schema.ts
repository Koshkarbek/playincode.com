import {
  bigint,
  integer,
  pgTable,
  primaryKey,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type {
  BaseType,
  Locale,
  ProfileKey,
} from "@/features/profile-test/types";

export const batches = pgTable("batches", {
  id: text("id").primaryKey(),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
  quantity: integer("quantity").notNull(),
});

export const invitations = pgTable(
  "invitations",
  {
    id: text("id").primaryKey(),
    batchId: text("batch_id")
      .notNull()
      .references(() => batches.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    tokenHash: text("token_hash").notNull(),
    tokenCiphertext: text("token_ciphertext"),
    locale: text("locale").$type<Locale>(),
    status: text("status")
      .$type<"ready" | "in_progress" | "completed">()
      .notNull()
      .default("ready"),
    progress: integer("progress").notNull().default(0),
    scoreA: integer("score_a"),
    scoreB: integer("score_b"),
    scoreC: integer("score_c"),
    scoreD: integer("score_d"),
    profileKey: text("profile_key").$type<ProfileKey>(),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
    completedAt: bigint("completed_at", { mode: "number" }),
    firstSentAt: bigint("first_sent_at", { mode: "number" }),
    lastSentAt: bigint("last_sent_at", { mode: "number" }),
    sendCount: integer("send_count").notNull().default(0),
  },
  (table) => [
    uniqueIndex("invitations_code_unique").on(table.code),
    uniqueIndex("invitations_token_hash_unique").on(table.tokenHash),
  ],
);

export const answers = pgTable(
  "answers",
  {
    invitationId: text("invitation_id")
      .notNull()
      .references(() => invitations.id, { onDelete: "cascade" }),
    questionId: integer("question_id").notNull(),
    choiceIndex: integer("choice_index").notNull(),
    baseType: text("base_type").$type<BaseType>().notNull(),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.invitationId, table.questionId] }),
  ],
);

export const loginAttempts = pgTable("login_attempts", {
  key: text("key").primaryKey(),
  failures: integer("failures").notNull(),
  windowStartedAt: bigint("window_started_at", { mode: "number" }).notNull(),
  blockedUntil: bigint("blocked_until", { mode: "number" })
    .notNull()
    .default(0),
  updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
});
