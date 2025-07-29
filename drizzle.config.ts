import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_XgSudWpryj32@ep-withered-paper-ae6mln3t.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require",
  },
});
