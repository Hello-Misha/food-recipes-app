import express, { Application, Request, Response } from "express";
import { connectToDb } from "./db";
import { Db, InsertOneResult, Collection, ObjectId } from "mongodb";

import { RecipeMongoRepository } from "./repos/RecipeMongoRepository";

import { recipeSchemas } from "./middleware/recipeSchema";
import { recipeValidator } from "./middleware/recipeValidator";
import { RecipesController } from "./controllers/recipesController";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require("cors");
let bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());

app.get("/alive", (req: Request, res: Response) => {
  res.send("Hello, World!").status(200);
});

async function startServer() {
  try {
    const db: Db = await connectToDb();
    const recipesRepository = new RecipeMongoRepository(db);
    const recipesController = new RecipesController(recipesRepository);

    //POST

    app.post(
      "/api/v1/recipes",
      recipeValidator(recipeSchemas.recipePOST),
      recipesController.create
    );

    //GET

    app.get("/api/v1/recipes", recipesController.getAll);

    app.get("/api/v1/recipes/:id", recipesController.getOne);

    //DELETE

    app.delete("/api/v1/recipes/:id", recipesController.deleteOne);

    // PATCH

    app.patch(
      "/api/v1/recipes/:id",
      recipeValidator(recipeSchemas.recipePATCH),
      recipesController.update
    );
  } catch (error) {
    console.error("Error connecting to the database:", process.exit(1));
  }
}
startServer();

export { app };
