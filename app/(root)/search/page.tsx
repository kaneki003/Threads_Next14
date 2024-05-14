import UserCard from "@/components/cards/UserCard";
import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser, fetchUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Page () {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const userInfo = await fetchUser({ userId: user.id });

  if (!userInfo?.onboarded) {
    //if the user is not onboarded, redirect to the onboarding page.If userinfo is null, onboarded is false
    redirect("/onboarding");
  }

  const result = await fetchUsers({
    userId: user.id,
    pageNumber: 1,
    pageSize: 10,
    sortBy: "desc",
    searchString: "",
  });

  return (
    <section>
      <h1 className="head-text">Search Page</h1>

      <div className="mt-14 flex flex-col gap-9">{
        result?.users.length === 0?(
            <p className="no-result">No Users</p>
        ):(
            <> 
                {result?.users.map((person)=>(
                    <UserCard
                    key={person.id}
                    id={person.id}
                    name={person.name}
                    username={person.username}
                    imgUrl={person.image}
                    personType='User'  />
                ))}
            </>
        )
      }</div>
    </section>
  );
}
