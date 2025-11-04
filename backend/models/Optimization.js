import mongoose from "mongoose";

const { Schema, model } = mongoose;

const OptimizationSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    video_url: { type: String, required: true },
    video_title: { type: String },
    original_title: { type: String, default: null },
    optimized_title: { type: String, default: null },
    original_description: { type: String, default: null },
    optimized_description: { type: String, default: null },
    tags: { type: [String], default: [] },
    status: { type: String, default: "completed" },
    views: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 },
    click_rate: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: "created_at" } }
);

export default model("Optimization", OptimizationSchema);
