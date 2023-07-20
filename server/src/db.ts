import { Db, MongoClient } from "mongodb";

const uri = process.env.DB_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "defaultDbName";

export async function connectToDb(): Promise<Db> {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    return db;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}
