import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

let client: ReturnType<typeof drizzle<typeof schema>> | undefined;

/**
 * Pooled `DATABASE_URL` (Neon pooler) for runtime queries from Server Components and Server Actions.
 */
export const getDb = () => {
  if (client !== undefined) {
    return client;
  }
  const url = process.env.DATABASE_URL;
  if (url === undefined || url === "") {
    throw new Error("DATABASE_URL is not set. Add it in .env.local (Neon connection string).");
  }
  const sql = neon(url);
  client = drizzle(sql, { schema });
  return client;
};

export type Db = ReturnType<typeof getDb>;
