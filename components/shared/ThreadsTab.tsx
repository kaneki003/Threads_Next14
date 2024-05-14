import fetchUserThreads from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

export default async function ThreadsTab({
  currentUserId,
  accountId,
  accountType,
}: Props) {
  const result = await fetchUserThreads({ userId: accountId });

  if (!result) {
    redirect("/");
  }

  return (
    <section className="mt-9 flex flex-col gap-10">
      ThreadsTab
      {result.threads?.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.content}
          author={
            accountType === "User"
              ? {
                  username: result.username,
                  image: result.image,
                  id: result.id,
                }
              : {
                  username: thread.author.username,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
          communityId={thread.communityId}
          createdAt={thread.createdAt}
          comments={thread.children}
          isComment={false}
        />
      ))}
    </section>
  );
}
