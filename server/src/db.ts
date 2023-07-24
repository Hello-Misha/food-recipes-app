import { Db, MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.DB_URI;
const dbName = process.env.DB_NAME;

export async function connectToDb(): Promise<Db> {
  if (!uri || !dbName) {
    throw new Error("DB_URI or DB_NAME environment variable is not set.");
  }
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    return db;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}
