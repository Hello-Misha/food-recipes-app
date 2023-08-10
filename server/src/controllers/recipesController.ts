import { Request, Response } from "express";
import { RecipeMongoRepository } from "../repos/RecipeMongoRepository";

export class RecipesController {
  constructor(private readonly recipesRepository: RecipeMongoRepository) {}

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const newRecipeId = await this.recipesRepository.createRecipe(req.body);

      res
        .status(201)
        .json({ message: "Recipe created successfully", id: newRecipeId });
    } catch (error) {
      console.error("Error creating recipe:", error);
      res.status(500).json({ error: "Failed to create recipe" });
    }
  };
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const allRecipes = await this.recipesRepository.getAllRecipes();
      res.status(200).json(allRecipes);
    } catch (error) {
      console.error("Error getting recipes:", error);
      res.status(500).json({ error: "Failed to get recipes" });
    }
  };
  getOne = async (req: Request, res: Response) => {
    try {
      const recipe = await this.recipesRepository.getRecipeById(req.params.id);
      res.status(200).json(recipe);
    } catch (error) {
      console.error("Error getting recipe:", error);
      res.status(400).json({ error: "Failed to get recipe" });
    }
  };
  deleteOne = async (req: Request, res: Response) => {
    try {
      const recipeDeleted = await this.recipesRepository.deleteRecipeById(
        req.params.id
      );
      res.status(200).json(recipeDeleted);
    } catch (error) {
      console.error("Error deleting recipe:", error);
      res.status(400).json({ error: "Failed to delete recipe" });
    }
  };
  update = async (req: Request, res: Response) => {
    try {
      const updateResult = await this.recipesRepository.updateRecipe(
        req.params.id,
        req.body
      );

      res.status(200).json(updateResult);
    } catch (error) {
      console.error("Error updating recipe:", error);
      res.status(500).json({ error: "Failed to update recipe" });
    }
  };
}
