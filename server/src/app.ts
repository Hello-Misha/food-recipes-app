import express, { Application, Request, Response } from "express";
import { connectToDb } from "./db";
import { Db, InsertOneResult, Collection, ObjectId } from "mongodb";

import { RecipeMongoRepository } from "./repos/RecipeMongoRepository";

import { recipeSchemas } from "./middleware/recipeSchema";
import {
  recipeBodyValidator,
  recipePathParamsValidator,
} from "./middleware/recipeValidator";
import { RecipesController } from "./controllers/recipesController";
import { RecipeMapRepository } from "./repos/RecipeMapRepository";

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
    const recipesMongoRepository = new RecipeMongoRepository(db);
    const recipesMapRepository = new RecipeMapRepository();
    let recipesController: RecipesController;
    switch (process.env.DB_TYPE) {
      case "mongo": {
        recipesController = new RecipesController(recipesMongoRepository);
        break;
      }
      case "map": {
        recipesController = new RecipesController(recipesMapRepository);
        break;
      }
      default: {
        throw new Error(`unknown db type provided: ${process.env.DB_TYPE}`);
      }
    }

    //POST

    app.post(
      "/api/v1/recipes",
      recipeBodyValidator(recipeSchemas.recipePOST),
      recipesController.create
    );

    //GET

    app.get("/api/v1/recipes", recipesController.getAll);

    app.get(
      "/api/v1/recipes/:id",
      recipePathParamsValidator(recipeSchemas.recipeDetails),
      recipesController.getOne
    );

    //DELETE

    app.delete(
      "/api/v1/recipes/:id",
      recipePathParamsValidator(recipeSchemas.recipeDetails),
      recipesController.deleteOne
    );

    // PATCH

    app.patch(
      "/api/v1/recipes/:id",
      recipePathParamsValidator(recipeSchemas.recipeDetails),
      recipeBodyValidator(recipeSchemas.recipePATCH),
      recipesController.update
    );
  } catch (error) {
    console.error("Error connecting to the database:", process.exit(1));
  }
}
startServer();

export { app };
