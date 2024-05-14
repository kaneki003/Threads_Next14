import { fetchUser, getActivity } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { get } from "http";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const userInfo = await fetchUser({ userId: user.id });

  if (!userInfo?.onboarded) {
    //if the user is not onboarded, redirect to the onboarding page.If userinfo is null, onboarded is false
    redirect("/onboarding");
  }

  const activity = await getActivity({ userId: userInfo._id });

//   console.log(activity);

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">{

        activity.length > 0 ?
        
        (activity?.map((reply) => {
          return (
            <Link
            key={reply._id}
            href={`/thread/${reply.parent}`}>

                <article className="activity-card">
                    <Image
                    src={reply.author.image}
                    alt="Profile_Photo"
                    width={30}
                    height={30}
                    className="rounded-full object-contain" />
                    <p className="text-light-1 !text-small-regular">
                    <span className="mr-1 text-primary-500">
                        {reply.author.name}
                    </span>
                    replied to your thread
                </p>
                </article>

                
            </Link>
          );
        })) : (
          <p className="text-light-3 !text-base-regular">No activity yet</p>
        )

      }</section>
    </section>
  );
}
