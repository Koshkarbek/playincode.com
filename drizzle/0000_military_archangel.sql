CREATE TABLE "answers" (
	"invitation_id" text NOT NULL,
	"question_id" integer NOT NULL,
	"choice_index" integer NOT NULL,
	"base_type" text NOT NULL,
	"created_at" bigint NOT NULL,
	CONSTRAINT "answers_invitation_id_question_id_pk" PRIMARY KEY("invitation_id","question_id")
);
--> statement-breakpoint
CREATE TABLE "batches" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" bigint NOT NULL,
	"quantity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" text PRIMARY KEY NOT NULL,
	"batch_id" text NOT NULL,
	"code" text NOT NULL,
	"token_hash" text NOT NULL,
	"token_ciphertext" text,
	"locale" text,
	"status" text DEFAULT 'ready' NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"score_a" integer,
	"score_b" integer,
	"score_c" integer,
	"score_d" integer,
	"profile_key" text,
	"created_at" bigint NOT NULL,
	"completed_at" bigint,
	"first_sent_at" bigint,
	"last_sent_at" bigint,
	"send_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "login_attempts" (
	"key" text PRIMARY KEY NOT NULL,
	"failures" integer NOT NULL,
	"window_started_at" bigint NOT NULL,
	"blocked_until" bigint DEFAULT 0 NOT NULL,
	"updated_at" bigint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "invitations_code_unique" ON "invitations" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "invitations_token_hash_unique" ON "invitations" USING btree ("token_hash");