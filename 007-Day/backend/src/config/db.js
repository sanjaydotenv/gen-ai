import mongoose from "mongoose";

export async function connectDatabase(uri) {
  if (!uri) {
    throw new Error(process.env.MONGO_URI);
  }

  await mongoose.connect(uri);
  return mongoose.connection;
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
