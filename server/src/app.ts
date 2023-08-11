import express, { Application, Request, Response } from "express";
import { connectToDb } from "./db";
import { Db, InsertOneResult, Collection, ObjectId } from "mongodb";
import {
  RecipePayload,
  Recipe,
  RecipePatchPayload,
  RecipeCreateRequestPayload,
} from "./interfaces/Recipe";

import { RecipesRepository } from "./repos/RecipeMongoRepository";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/alive", (req: Request, res: Response) => {
  res.send("Hello, World!").status(200);
});

async function startServer() {
  try {
    const db: Db = await connectToDb();
    const recipesRepository = new RecipesRepository(db);

    //POST

    app.post("/api/v1/recipes", async (req: Request, res: Response) => {
      try {
        const {
          title,
          description,
          categories,
          ingredients,
          steps,
        }: RecipeCreateRequestPayload = req.body;

        const newRecipeId = await recipesRepository.createRecipe({
          title,
          description,
          categories,
          ingredients,
          steps,
        });

        res
          .status(201)
          .json({ message: "Recipe created successfully", id: newRecipeId });
      } catch (error) {
        console.error("Error creating recipe:", error);
        res.status(500).json({ error: "Failed to create recipe" });
      }
    });

    //GET

    app.get("/api/v1/recipes", async (req: Request, res: Response) => {
      try {
        const allRecipes = await recipesRepository.getAllRecipes();
        res.status(200).json(allRecipes);
      } catch (error) {
        console.error("Error getting recipes:", error);
        res.status(500).json({ error: "Failed to get recipes" });
      }
    });

    app.get("/api/v1/recipes/:id", async (req: Request, res: Response) => {
      const recipeId = req.params.id;
      if (!ObjectId.isValid(recipeId)) {
        res.status(400).json({ error: "Not valid document ID" });
      }
      try {
        const recipe = await recipesRepository.getRecipeById(recipeId);
        res.status(200).json(recipe);
      } catch (error) {
        console.error("Error getting recipe:", error);
        res.status(400).json({ error: "Failed to get recipe" });
      }
    });

    //DELETE

    app.delete("/api/v1/recipes/:id", async (req: Request, res: Response) => {
      const recipeId = req.params.id;
      if (!ObjectId.isValid(recipeId)) {
        return res.status(400).json({ error: "Not valid document ID" });
      }
      try {
        const recipeDeleted = await recipesRepository.deleteRecipeById(
          recipeId
        );
        res.status(200).json(recipeDeleted);
      } catch (error) {
        console.error("Error deleting recipe:", error);
        res.status(400).json({ error: "Failed to delete recipe" });
      }
    });

    // PATCH

    app.patch("/api/v1/recipes/:id", async (req: Request, res: Response) => {
      const recipeId = req.params.id;
      if (!ObjectId.isValid(recipeId)) {
        return res.status(400).json({ error: "Not valid document ID" });
      }
      try {
        const {
          title,
          description,
          categories,
          ingredients,
          steps,
        }: RecipePatchPayload = req.body;

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

        const updateResult = await recipesRepository.updateRecipe(
          recipeId,
          updatedFields
        );

        res.status(200).json(updateResult);
      } catch (error) {
        console.error("Error updating recipe:", error);
        res.status(500).json({ error: "Failed to update recipe" });
      }
    });
  } catch (error) {
    console.error("Error connecting to the database:", process.exit(1));
  }
}
startServer();

export { app };
