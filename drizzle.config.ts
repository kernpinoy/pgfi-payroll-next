import { env } from "@/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  breakpoints: true,
  strict: true,
  verbose: true,
});
