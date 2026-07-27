import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let database: NeonHttpDatabase<typeof schema> | null = null;
let databaseUrl: string | null = null;
let databasePromise: Promise<NeonHttpDatabase<typeof schema>> | null = null;

type Database = NeonHttpDatabase<typeof schema>;
type Statement = PromiseLike<unknown>;
type StatementList = readonly [Statement, ...Statement[]];

async function createDatabase(
  url: string,
): Promise<NeonHttpDatabase<typeof schema>> {
  if (url.startsWith("file:")) {
    const [{ PGlite }, { drizzle: drizzlePglite }] = await Promise.all([
      import("@electric-sql/pglite"),
      import("drizzle-orm/pglite"),
    ]);
    const client = new PGlite(url.slice("file:".length));
    await client.waitReady;
    return drizzlePglite(client, { schema }) as unknown as NeonHttpDatabase<
      typeof schema
    >;
  }

  return drizzle(neon(url), { schema });
}

export async function getDb(): Promise<NeonHttpDatabase<typeof schema>> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "Missing DATABASE_URL. Connect Neon to this Vercel project or add DATABASE_URL to .env.local.",
    );
  }

  if (database && databaseUrl === url) {
    return database;
  }

  if (!databasePromise || databaseUrl !== url) {
    databaseUrl = url;
    databasePromise = createDatabase(url).then((created) => {
      database = created;
      return created;
    });
  }

  return databasePromise;
}

export async function runDbBatch(
  buildStatements: (db: Database) => StatementList,
): Promise<unknown[]> {
  const db = await getDb();
  if (databaseUrl?.startsWith("file:")) {
    const localDb = db as unknown as {
      transaction: <T>(
        callback: (transaction: unknown) => Promise<T>,
      ) => Promise<T>;
    };
    return localDb.transaction(async (transaction) => {
      const statements = buildStatements(transaction as Database);
      const results: unknown[] = [];
      for (const statement of statements) {
        results.push(await statement);
      }
      return results;
    });
  }

  const neonDb = db as unknown as {
    batch: (statements: StatementList) => Promise<unknown[]>;
  };
  return neonDb.batch(buildStatements(db));
}
