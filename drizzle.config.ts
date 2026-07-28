import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local", quiet: true });
config({ quiet: true });

const databaseUrl =
  process.env.playincode_db_DATABASE_URL ?? process.env.DATABASE_URL;
const isMigrationCommand = process.argv.includes("migrate");

if (!databaseUrl && isMigrationCommand) {
  throw new Error(
    "playincode_db_DATABASE_URL and DATABASE_URL are missing. Connect Neon or add DATABASE_URL to .env.local before running npm run db:migrate.",
  );
}

const commonConfig = {
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  strict: true,
  verbose: true,
} as const;

export default defineConfig(
  databaseUrl?.startsWith("file:")
    ? {
        ...commonConfig,
        driver: "pglite",
        dbCredentials: { url: databaseUrl },
      }
    : {
        ...commonConfig,
        dbCredentials: {
          // `generate` only reads the schema; a real URL is required for `migrate`.
          url:
            databaseUrl ??
            "postgresql://placeholder:placeholder@localhost:5432/placeholder",
        },
      },
);
