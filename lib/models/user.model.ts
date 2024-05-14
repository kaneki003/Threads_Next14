import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
  onboarded: { type: Boolean, default: false },
});

const User = mongoose.models.User || mongoose.model("User", userSchema); //if the model is already created, use it, else create a new one

export default User;
