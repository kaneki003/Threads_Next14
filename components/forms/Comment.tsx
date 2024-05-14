"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ThreadValidation } from "@/lib/validations/thread";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createReply } from "@/lib/actions/thread.action";

interface Props {
  threadId: string;
  currentUserImage: string;
  currentUserId: string;
}

export default function Comment({
  threadId,
  currentUserImage,
  currentUserId,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: currentUserId,
    },
  });

  const onSubmit = async () => {
    createReply({
      content: form.getValues("thread"),
      author: JSON.parse(currentUserId),
      parent: threadId,
      communityId: null,
      path: pathname,
    });

    router.push("/");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-row items-center justify-between gap-10 mt-10 comment-form"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full flex-row items-center gap-3">
              <FormLabel >
                <Image
                  src={currentUserImage}
                  alt="profile_photo"
                  width={44}
                  height={44}
                  className="rounded-full object-contain"
                  priority
                />
              </FormLabel>
              <FormControl className=" border-none bg-transparent">
                <Input className="no-focus text-light-1 outline-1" placeholder="Comment..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="comment-form_btn"
        >
          Reply
        </Button>
      </form>
    </Form>
  );
}
