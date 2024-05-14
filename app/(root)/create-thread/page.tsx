import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
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
//   {console.log(userInfo)}

  //***passing the userId to PostThread component which is non -JSON type and will be reconverted to json by json.parse to ensure that non JSON is passed from server side to client side***

  return (
    <main>
      <h1 className="head-text">Create Thread</h1>
      <PostThread userId={JSON.stringify(userInfo._id)} />  
    </main>
  );
}

//Solving userid prop data type from json to string
