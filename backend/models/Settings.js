import mongoose from "mongoose";

const { Schema, model } = mongoose;

const SettingsSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    email_notifications: { type: Boolean, default: true },
    push_notifications: { type: Boolean, default: false },
    sms_notifications: { type: Boolean, default: false },
    show_profile: { type: Boolean, default: true },
    show_activity: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default model("Settings", SettingsSchema);
