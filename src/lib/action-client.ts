import { createSafeActionClient } from "next-safe-action";
import { validateRequest } from "./validate-request";

export class ActionError extends Error {}

export const actionClient = createSafeActionClient({
  handleServerError: (error) => {
    if (error instanceof ActionError) {
      return error.message;
    }

    return "Something went wrong while executing the operation.";
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const { session, user } = await validateRequest();

  if (!session) {
    throw new ActionError("You are not logged in.");
  }

  if (!user) {
    throw new ActionError("You are not authorized to perform this action.");
  }

  return next({ ctx: { session, user } });
});