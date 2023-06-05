import express, { Application, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

interface Item {
  id: string;
  title: string;
  description: string;
  dueDate?: number;
  createdAt: number;
}

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/alive", (req: Request, res: Response) => {
  res.send("Hello, World!").status(200);
});

// DATABASE SIMULATION

const items: Item[] = [];

//POST

app.post("/api/v1/items", (req: Request, res: Response) => {
  const {
    title,
    description,
    dueDate,
  }: { title: string; description: string; dueDate?: number } = req.body;
  const id = uuidv4();

  const newItem: Item = {
    id,
    title,
    description,
    dueDate,
    createdAt: Math.floor(Date.now() / 1000),
  };

  items.push(newItem);
  res.status(201).json(newItem);
});

app.get("/api/v1/items/:id", (req: Request, res: Response) => {
  const itemId: string = req.params.id;
  const item: Item | undefined = items.find((item) => item.id === itemId);

  if (!item) {
    return res.status(404).json({ message: "Resource not found" });
  }

  res.json(item);
});

export { app };
