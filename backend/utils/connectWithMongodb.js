import mongoose from "mongoose";

/**
 * Connect to MongoDB using mongoose.
 * @param {string} uri - MongoDB connection string
 * @returns {Promise<mongoose.Mongoose>} - the mongoose instance
 */
export default async function connectWithMongodb(uri) {
  const MONGODB_URI = uri || "mongodb://127.0.0.1:27017/vidoptimize_temp";

  mongoose.set("strictQuery", false);

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Connected to MongoDB: ${MONGODB_URI}`);

    // Graceful shutdown
    const cleanUp = async (signal) => {
      try {
        console.log(`Received ${signal}. Closing MongoDB connection...`);
        await mongoose.connection.close(false);
        console.log("MongoDB connection closed.");
        process.exit(0);
      } catch (err) {
        console.error("Error during MongoDB disconnection", err);
        process.exit(1);
      }
    };

    process.on("SIGINT", () => cleanUp("SIGINT"));
    process.on("SIGTERM", () => cleanUp("SIGTERM"));

    return mongoose;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}
