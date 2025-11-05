import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    password: { type: String, required: true },
    youtube_channel: { type: String, default: null },
    bio: { type: String, default: null },
    avatar: { type: String, default: null },
    plan: { type: String, default: "free" },
    quota_used: { type: Number, default: 0 },
    quota_limit: { type: Number, default: 10 },
    refresh_token: { type: String, default: null }, // store current refresh token for rotation
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default model("User", UserSchema);
