"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { FilterQuery, SortOrder, model } from "mongoose";
import Thread from "../models/thread.model";
import path from "path";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  //in ts we have to define the type of the parameters
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  //promise void means that the function will not return anything
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId }, //find the user by id
      {
        username: username.toLowerCase(), //update the user with the new values
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true } //if the user does not exist, create a new one
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error) {
    console.log("Error updating/creating user: ", error);
  }
}

export async function fetchUser({ userId }: { userId: string }) {
  connectToDB();

  try {
    return await User.findOne({ id: userId });
    // .populate{
    //     path: 'communities',
    //     model: 'Community',
    // };
  } catch (error) {
    console.log("Error finding user: ", error);
  }
}

export default async function fetchUserThreads({ userId }: { userId: string }) {
  connectToDB();

  //TODO:Populate communities
  try {
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
        },
      },
    });
    return threads;
  } catch (error) {
    console.log("Error finding user threads: ", error);
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 10,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  connectToDB();

  const skipAmount = (pageNumber - 1) * pageSize;

  const regex = new RegExp(searchString, "i");

  try {
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim()! == "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = totalUsersCount > pageNumber * pageSize;

    return { users, isNext };
  } catch (error) {
    console.log("Error finding users: ", error);
  }
}

export async function getActivity({ userId }: { userId: string }) {
  connectToDB();

  try {
    const userThreads = await Thread.find({ author: userId }); //find all threads created by the user

    const childThreadIds = userThreads.reduce((acc, userThread) => {
      //acc is the accumulator which is the value that is returned by the function
      return acc.concat(userThread.children);
    }, []);

    const replies = await Thread.find({
      _id: { $in: childThreadIds }, //$in means in
      author: { $ne: userId }, //$ne means not equal
    }).populate({ path: "author", model: "User" });

    return replies;
  } catch (error) {
    console.log("Error finding user activity: ", error);
    throw error; //ensure no undefined thing is passed by this function
  }
}
