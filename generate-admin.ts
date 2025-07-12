import { randomBytes } from "crypto";
import { hash } from "@node-rs/argon2";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const username = "admin";
  if (!username) {
    console.error("No USER_NAME!");
    process.exit(-1);
  }

  const existingUser = await db.query.user.findFirst({
    where: eq(user.username, username),
  });

  if (existingUser) {
    console.error("Duplicate na teh :( Ibahin mo username!");
    process.exit(-1);
  }

  const password = "admin";
  if (!password) {
    console.error("No PASS_WORD!");
    process.exit(-1);
  }

  const userId = crypto.randomUUID();
  const salt = randomBytes(16);
  const hashed = await hash(password, {
    // Minimum requirments for hashing password
    salt: salt,
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  console.log("-------------------------------");
  console.log("Username:", username);
  console.log("Password:", password);
  console.log("User id:", userId);
  console.log("Salt:", salt.toString("base64"));
  console.log("Hashed:", hashed);
  console.log("-------------------------------");

  await db.insert(user).values({
    id: userId,
    username: username,
    hashedPassword: hashed,
    salt: salt.toString("base64"),
  });
}

main()