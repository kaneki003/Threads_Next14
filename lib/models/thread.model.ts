import mongoose from "mongoose";

//Can add likes also

const threadSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  communityId: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Thread" },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema);

export default Thread;
