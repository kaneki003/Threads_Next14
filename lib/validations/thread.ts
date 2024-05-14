import * as z from "zod";

export const ThreadValidation = z.object({
  thread: z.string().min(3 , "Thread must have atleast 3 characters").max(1000),
  accountId: z.string().min(1),
});