import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true },
  name: { type: String },
  bio: { type: String },
  image: { type: String },
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  createdBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  members:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
  ]
});

const Community = mongoose.models.Community || mongoose.model("Community", communitySchema); //if the model is already created, use it, else create a new one

export default Community;
