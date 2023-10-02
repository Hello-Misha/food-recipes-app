import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.DB_URI;
const dbName = process.env.DB_NAME;

if (!uri || !dbName) {
  throw new Error("DB_URI or DB_NAME environment variable is not set.");
}
mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
    throw error;
  });

export default mongoose;
