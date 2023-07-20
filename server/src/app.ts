import express, { Application, Request, Response } from "express";
import { connectToDb } from "./db";
import { Db, InsertOneResult, ObjectId } from "mongodb";
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

    app.get("/api/v1/items", (req: Request, res: Response) => {
      res.json({ items: Array.from(items.values()) });
    });

    app.get("/api/v1/items/:id", (req: Request, res: Response) => {
      const itemId: string = req.params.id;
      const item: Item | undefined = items.get(itemId);

      if (!item) {
        return res.status(404).json({ message: "Resource not found" });
      }

      res.json(item);
    });

    //DELETE

    app.delete("/api/v1/items/:id", (req: Request, res: Response) => {
      const itemId: string = req.params.id;
      const wasDeleted = items.delete(itemId);

      if (!wasDeleted) {
        return res.status(404).json({ message: "Resource not found" });
      }

      res.sendStatus(204);
    });

    // PATCH

    app.patch("/api/v1/items/:id", (req: Request, res: Response) => {
      const itemId: string = req.params.id;
      const item: Item | undefined = items.get(itemId);
      if (!item) {
        return res.status(404).json({ message: "Resource not found" });
      }

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

      if (title) {
        item.title = title;
      }
      if (description) {
        item.description = description;
      }
      if (categories) {
        item.categories = categories;
      }
      if (ingredients) {
        item.ingredients = ingredients;
      }
      if (steps) {
        item.steps = steps;
      }

      res.sendStatus(200).json(item);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    // Handle the error or exit the application gracefully
  }
}
startServer();

export { app };
