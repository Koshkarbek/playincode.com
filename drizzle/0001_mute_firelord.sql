ALTER TABLE "invitations" ADD COLUMN IF NOT EXISTS "admin_note" text;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN IF NOT EXISTS "admin_note_updated_at" bigint;
