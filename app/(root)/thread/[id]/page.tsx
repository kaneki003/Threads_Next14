import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThread } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  //to take id from url in form of params
  if (!params.id) return null;
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser({ userId: user.id });
  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  const Thread = await fetchThread(params.id);

  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={Thread._id}
          id={Thread._id}
          currentUserId={user?.id || ""}
          parentId={Thread.parentId}
          author={Thread.author}
          content={Thread.content}
          createdAt={Thread.createdAt}
          comments={Thread.children}
          communityId={Thread.communityId}
          isComment={false}
        />
      </div>

      <div className="mt-7">
        <Comment
          threadId={Thread.id}
          currentUserImage={userInfo.image} //try adding userInfo.image
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className="mt-10">
        {Thread.children.map((Comment: any) => (
          <ThreadCard
            key={Comment._id}
            id={Comment._id}
            currentUserId={user?.id || ""}
            parentId={Comment.parentId}
            author={Comment.author}
            content={Comment.content}
            createdAt={Comment.createdAt}
            comments={Comment.children}
            communityId={Comment.communityId}
            isComment
          />
        ))}
      </div>
    </section>
  );
}
