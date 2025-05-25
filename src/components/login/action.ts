"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { actionClient, ActionError } from "@/lib/action-client";
import { lucia } from "@/lib/auth";
import { tryCatch } from "@/lib/try-catch";
import loginFormSchema from "@/validation/login-form";
import { verify } from "@node-rs/argon2";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

// throw ActionError for custom error message
export const loginAccountAction = actionClient
  .schema(loginFormSchema)
  .action(async ({ parsedInput: { username, password } }) => {
    // check for existing user
    const { data: existingUser, error } = await tryCatch(
      db.query.user.findFirst({
        where: eq(user.username, username),
      })
    );

    // If smth's wrong with query or db or smth
    if (error) throw new ActionError(error.message);

    // user don't exist no more
    if (!existingUser) {
      throw new ActionError("User does not exist.");
    }

    // check password hash
    const validPass = await verify(existingUser.hashedPassword, password, {
      salt: Buffer.from(existingUser.salt),
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    // throw error if invalid
    if (!validPass)
      throw new ActionError("Invalid username / password. Try again.");

    // create session
    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return {
      success: true,
      message: "Logged in successfully.",
    };
  });
