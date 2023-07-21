import express, { Application, Request, Response } from "express";
import { connectToDb } from "./db";
import { Db, InsertOneResult, Collection, ObjectId } from "mongodb";
interface Item {
  title: string;
  description: string;
  categories: string[];
  ingredients: string[];
  steps: string[];
  createdAt: number;
  // updatedAt: number;
}

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/alive", (req: Request, res: Response) => {
  res.send("Hello, World!").status(200);
});

// DATABASE SIMULATION

const items: Map<string, Item> = new Map();

async function startServer() {
  try {
    const db: Db = await connectToDb();

    //POST

    app.post("/api/v1/items", async (req: Request, res: Response) => {
      try {
        const {
          title,
          description,
          categories,
          ingredients,
          steps,
        }: {
          title: string;
          description: string;
          categories: string[];
          ingredients: string[];
          steps: string[];
        } = req.body;

        const newItem: Item = {
          title,
          description,
          categories,
          ingredients,
          steps,
          createdAt: Math.floor(Date.now() / 1000),
        };
        const result: InsertOneResult<any> = await db
          .collection("recipes")
          .insertOne(newItem);
        res
          .status(200)
          .json({ message: "recipe was added", postId: result.insertedId });
      } catch (error) {
        console.error("Error creating item:", error);
        res.status(500).json({ error: "Failed to create item" });
      }
    });

    //GET

    app.get("/api/v1/items", async (req: Request, res: Response) => {
      try {
        const collection: Collection = db.collection("recipes");
        const documents = await collection.find().toArray();

        const recipes: Item[] = documents.map((recipe) => ({
          title: recipe.title,
          description: recipe.description,
          categories: recipe.categories,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          createdAt: recipe.createdAt,
        }));

        res.status(200).json(recipes);
      } catch (error) {
        console.error("Error getting items:", error);
        res.status(500).json({ error: "Failed to get items" });
      }
    });

    app.get("/api/v1/items/:id", async (req: Request, res: Response) => {
      if (ObjectId.isValid(req.params.id)) {
        try {
          const collection: Collection = db.collection("recipes");
          const document = await collection.findOne({
            _id: new ObjectId(req.params.id),
          });
          res.status(200).json(document);
        } catch (error) {
          console.error("Error getting item:", error);
          res.status(500).json({ error: "Failed to get items" });
        }
      } else {
        res.status(500).json({ error: "Not valid document ID" });
      }
    });

    //DELETE

    app.delete("/api/v1/items/:id", async (req: Request, res: Response) => {
      if (ObjectId.isValid(req.params.id)) {
        try {
          const collection: Collection = db.collection("recipes");
          const document = await collection.deleteOne({
            _id: new ObjectId(req.params.id),
          });
          res.status(200).json(document);
        } catch (error) {
          console.error("Error deleting item:", error);
          res.status(500).json({ error: "Failed to delete item" });
        }
      } else {
        res.status(500).json({ error: "Not valid document ID" });
      }
    });

    // PATCH

    app.patch("/api/v1/items/:id", async (req: Request, res: Response) => {
      if (ObjectId.isValid(req.params.id)) {
        try {
          const collection: Collection = db.collection("recipes");
          const existingItem = await collection.findOne({
            _id: new ObjectId(req.params.id),
          });

          if (!existingItem) {
            return res.status(404).json({ error: "Recipe not found" });
          }

          const {
            title,
            description,
            categories,
            ingredients,
            steps,
          }: {
            title?: string;
            description?: string;
            categories?: string[];
            ingredients?: string[];
            steps?: string[];
          } = req.body;

          const updatedFields: { [key: string]: any } = {};
          if (title) {
            updatedFields.title = title;
          }
          if (description) {
            updatedFields.description = description;
          }
          if (categories) {
            updatedFields.categories = categories;
          }
          if (ingredients) {
            updatedFields.ingredients = ingredients;
          }
          if (steps) {
            updatedFields.steps = steps;
          }

          const updateResult = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updatedFields }
          );

          res.status(200).json(updateResult);
        } catch (error) {
          console.error("Error updating item:", error);
          res.status(500).json({ error: "Failed to update items" });
        }
      } else {
        res.status(400).json({ error: "Not valid document ID" });
      }
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}
startServer();

export { app };
