import mongoose from "mongoose";
import User from "../models/User.js";
import Optimization from "../models/Optimization.js";
import Settings from "../models/Settings.js";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/vidoptimize_temp";

mongoose.set("strictQuery", false);

// Connect to MongoDB with basic error handling
try {
  await mongoose.connect(MONGODB_URI);
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });
} catch (err) {
  console.error("Failed to connect to MongoDB:", err);
  throw new Error("Database connection failed");
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function sanitizeUserOutput(userObj) {
  if (!userObj) return null;
  const obj = {
    ...(typeof userObj.toObject === "function" ? userObj.toObject() : userObj),
  };
  if (obj._id) obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  delete obj.password; // never expose password
  return obj;
}

function validateEmail(email) {
  // simple email validation; do not rely solely on this for security
  return typeof email === "string" && /\S+@\S+\.\S+/.test(email);
}

export const dbService = {
  createUser: async (userData) => {
    try {
      const { name, email, password, plan, quota_limit } = userData || {};

      if (!name || !email || !password) {
        throw new Error("Missing required user fields");
      }
      if (!validateEmail(email)) {
        throw new Error("Invalid email format");
      }

      // Whitelist fields to prevent mass-assignment vulnerabilities
      const safeData = {
        name: String(name),
        email: String(email).toLowerCase(),
        password: String(password),
        plan: plan ? String(plan) : undefined,
        quota_limit: typeof quota_limit === "number" ? quota_limit : undefined,
      };

      const user = await User.create(safeData);
      return sanitizeUserOutput(user);
    } catch (err) {
      console.error("createUser error:", err);
      throw new Error("Failed to create user");
    }
  },

  findUserByEmail: async (email) => {
    try {
      if (!email || !validateEmail(email)) return null;
      // For authentication we need the password so return full document (not sanitized)
      return await User.findOne({ email: String(email).toLowerCase() }).lean();
    } catch (err) {
      console.error("findUserByEmail error:", err);
      throw new Error("Failed to query user");
    }
  },

  getUserById: async (userId) => {
    try {
      if (!isValidObjectId(userId)) return null;
      const user = await User.findById(userId).lean();
      return sanitizeUserOutput(user);
    } catch (err) {
      console.error("getUserById error:", err);
      throw new Error("Failed to get user");
    }
  },

  updateUser: async (userId, updates) => {
    try {
      if (!isValidObjectId(userId)) return null;
      const safeUpdates = { ...(updates || {}) };
      // Prevent updating protected fields
      delete safeUpdates._id;
      delete safeUpdates.__v;
      delete safeUpdates.password; // password should be updated via a dedicated flow

      const user = await User.findByIdAndUpdate(userId, safeUpdates, {
        new: true,
      }).lean();
      return sanitizeUserOutput(user);
    } catch (err) {
      console.error("updateUser error:", err);
      throw new Error("Failed to update user");
    }
  },

  createOptimization: async (userId, data) => {
    try {
      if (!isValidObjectId(userId)) throw new Error("Invalid user id");

      const userExists = await User.exists({ _id: userId });
      if (!userExists) throw new Error("User not found");

      const optData = {
        user_id: userId,
        video_url: String(data.videoUrl || ""),
        video_title: data.videoTitle ? String(data.videoTitle) : undefined,
        original_title: data.originalTitle || null,
        optimized_title: data.optimizedTitle || null,
        original_description: data.originalDescription || null,
        optimized_description: data.optimizedDescription || null,
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        status: data.status ? String(data.status) : "completed",
        views: Number(data.metrics?.views || 0),
        engagement: Number(data.metrics?.engagement || 0),
        click_rate: Number(data.metrics?.clickRate || 0),
      };

      const optimization = await Optimization.create(optData);

      // update user quota (atomic)
      await User.updateOne({ _id: userId }, { $inc: { quota_used: 1 } });

      const optObj = optimization.toObject();
      optObj.metrics = {
        views: optObj.views,
        engagement: optObj.engagement,
        clickRate: optObj.click_rate,
      };
      // remove internal props
      delete optObj.__v;
      return optObj;
    } catch (err) {
      console.error("createOptimization error:", err);
      throw new Error("Failed to create optimization");
    }
  },

  getOptimizationsByUser: async (userId, filters = {}) => {
    try {
      if (!isValidObjectId(userId)) return [];
      const query = { user_id: userId };
      if (filters.status) query.status = String(filters.status);

      if (filters.search) {
        query.video_title = { $regex: String(filters.search), $options: "i" };
      }

      const opts = await Optimization.find(query)
        .sort({ created_at: -1 })
        .lean();
      return opts.map((opt) => ({
        ...opt,
        metrics: {
          views: opt.views,
          engagement: opt.engagement,
          clickRate: opt.click_rate,
        },
      }));
    } catch (err) {
      console.error("getOptimizationsByUser error:", err);
      throw new Error("Failed to fetch optimizations");
    }
  },

  getRecentOptimizations: async (userId, limit = 5) => {
    try {
      if (!isValidObjectId(userId)) return [];
      const opts = await Optimization.find({ user_id: userId })
        .sort({ created_at: -1 })
        .limit(Number(limit))
        .lean();
      return opts.map((opt) => ({
        ...opt,
        metrics: {
          views: opt.views,
          engagement: opt.engagement,
          clickRate: opt.click_rate,
        },
      }));
    } catch (err) {
      console.error("getRecentOptimizations error:", err);
      throw new Error("Failed to fetch recent optimizations");
    }
  },

  getUserSettings: async (userId) => {
    try {
      if (!isValidObjectId(userId))
        return {
          notifications: { email: true, push: false, sms: false },
          privacy: { showProfile: true, showActivity: false },
        };

      let settings = await Settings.findOne({ user_id: userId }).lean();
      if (!settings) {
        const created = await Settings.create({ user_id: userId });
        settings = created.toObject();
      }

      return {
        notifications: {
          email: settings.email_notifications,
          push: settings.push_notifications,
          sms: settings.sms_notifications,
        },
        privacy: {
          showProfile: settings.show_profile,
          showActivity: settings.show_activity,
        },
      };
    } catch (err) {
      console.error("getUserSettings error:", err);
      throw new Error("Failed to get user settings");
    }
  },

  updateUserSettings: async (userId, settingsData) => {
    try {
      if (!isValidObjectId(userId)) throw new Error("Invalid user id");

      const updates = {};
      if (settingsData.notifications) {
        if (settingsData.notifications.email !== undefined)
          updates.email_notifications = Boolean(
            settingsData.notifications.email
          );
        if (settingsData.notifications.push !== undefined)
          updates.push_notifications = Boolean(settingsData.notifications.push);
        if (settingsData.notifications.sms !== undefined)
          updates.sms_notifications = Boolean(settingsData.notifications.sms);
      }
      if (settingsData.privacy) {
        if (settingsData.privacy.showProfile !== undefined)
          updates.show_profile = Boolean(settingsData.privacy.showProfile);
        if (settingsData.privacy.showActivity !== undefined)
          updates.show_activity = Boolean(settingsData.privacy.showActivity);
      }

      // Use upsert to ensure settings exist
      const settings = await Settings.findOneAndUpdate(
        { user_id: userId },
        { $set: updates },
        { new: true, upsert: true }
      ).lean();

      return {
        notifications: {
          email: settings.email_notifications,
          push: settings.push_notifications,
          sms: settings.sms_notifications,
        },
        privacy: {
          showProfile: settings.show_profile,
          showActivity: settings.show_activity,
        },
      };
    } catch (err) {
      console.error("updateUserSettings error:", err);
      throw new Error("Failed to update user settings");
    }
  },
};

export default dbService;
