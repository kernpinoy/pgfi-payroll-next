import { Lucia, TimeSpan } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "@/db";
import { user, session } from "@/db/schema";
import { env } from "@/env";

interface DatabaseUserAttributes {
  id: string;
  username: string;
}

declare module "lucia" {
  interface Register {
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

const adapter = new DrizzlePostgreSQLAdapter(db, session, user);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(3, "d"),
  sessionCookie: {
    expires: false,
    attributes: {
      secure: env.NODE_ENV === "production",
    },
  },
  getUserAttributes(attributes) {
    return {
      id: attributes.id,
      username: attributes.username,
    };
  },
});
