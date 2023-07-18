import express, { Application, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

interface Item {
  id: string;
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

//POST

app.post("/api/v1/items", (req: Request, res: Response) => {
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
  const id = uuidv4();

  const newItem: Item = {
    id,
    title,
    description,
    categories,
    ingredients,
    steps,
    createdAt: Math.floor(Date.now() / 1000),
    // updatedAt: Math.floor(Date.now() / 1000),
  };

  items.set(id, newItem);
  res.status(201).json(newItem);
});
//GET

app.get("/api/v1/items/:id", (req: Request, res: Response) => {
  const itemId: string = req.params.id;
  const item: Item | undefined = items.get(itemId);

  if (!item) {
    return res.status(404).json({ message: "Resource not found" });
  }

  res.json(item);
});

app.get("/api/v1/items", (req: Request, res: Response) => {
  res.json({ items: Array.from(items.values()) });
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

export { app };
