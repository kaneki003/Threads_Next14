"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import { connectToDB } from "../mongoose";
import { model } from "mongoose";
import User from "../models/user.model";
import path from "path";

interface Params {
  content: string;
  author: string;
  communityId: string | null;
  path: string;
  parent?: string;
}

export async function createThread({
  content,
  author,
  communityId,
  path,
}: Params) {
  connectToDB();

  try {
    const createdThread = await Thread.create({
      content,
      author,
      communityId,
    });

    await User.findByIdAndUpdate(
      { _id: author },
      {
        $push: { threads: createdThread._id },
      }
    );

    revalidatePath(path);
  } catch (error) {
    console.log("Error creating thread: ", error);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  const skipAmount = (pageNumber - 1) * pageSize;

  try {
    //Threads with no parents
    const postQuery = Thread.find({
      parent: { $in: [null, undefined] },
    })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({
        path: "children", //populate the children of the thread which is in thread model
        populate: {
          path: "author", //populate the author of the children with the user model containg the name, image and parentId
          model: User,
          select: "_id name parentId image", //parentId?? not in the user model
        },
      });

    const totalPostCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const posts = await postQuery.exec();

    const isNext = totalPostCount > pageNumber * pageSize; //if more pages are there
    return { posts, isNext };
  } catch (error) {
    console.log("Error finding posts: ", error);
  }
}

export async function fetchThread(id: string) {
  connectToDB();

  try {
    // console.log(thread);

    const thread_data = Thread.findById(id)
      .populate({ path: "author", model: User, select: "_id name id image" })
      .populate({
        path: "children",
        populate: [
          {
            path: "author", //populating the author of all comments
            model: User,
            // select: "id name parentId image",
          },
          {
            path: "children", //populating the children of the comments recusively
            model: Thread,
            populate: {
              path: "author",
              model: User,
              // select: "_id id name parentId image",
            },
          },
        ],
      });

    const thread = await thread_data.exec();
    // console.log(thread);
    return thread;
  } catch (error) {
    console.log("Error finding thread: ", error);
  }
}

export async function createReply({
  content,
  author,
  communityId,
  path,
  parent,
}: Params) {
  connectToDB();

  try {
    const createdThread = await Thread.create({
      content,
      author,
      communityId,
      parent,
    });

    await User.findByIdAndUpdate(
      { _id: author },
      {
        $push: { threads: createdThread._id },
      }
    );

    await Thread.findByIdAndUpdate({_id: parent}, {
      $push: { children: createdThread._id },
    })

    revalidatePath(path);
  } catch (error) {
    console.log("Error creating thread: ", error);
  }
}



  