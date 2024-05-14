import { fetchPosts } from "@/lib/actions/thread.action";
import "../globals.css";
import { currentUser } from "@clerk/nextjs/server";
import ThreadCard from "@/components/cards/ThreadCard";

export default async function Home() {
  const result = await fetchPosts(1, 30);
  const user = await currentUser();

  // console.log(result);
  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="flex flex-col mt-9 gap-10">
        {result?.posts.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {result?.posts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ""}
                parentId={post.parentId}
                author={post.author}
                content={post.content}
                createdAt={post.createdAt}
                comments={post.children}
                communityId={post.communityId}
                isComment={false}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
}
