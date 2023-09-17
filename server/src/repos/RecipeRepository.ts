import { ObjectId } from "mongodb";
import {
  RecipeCreateRequestPayload,
  Recipe,
  RecipePatchPayload,
} from "../interfaces/Recipe";

export interface RecipeRepository {
  createRecipe(recipeData: RecipeCreateRequestPayload): Promise<ObjectId>;
  getAllRecipes(): Promise<Recipe[]>;
  getRecipeById(id: string | ObjectId): Promise<Recipe | null>;
  updateRecipe(
    id: string | ObjectId,
    updatedRecipe: RecipePatchPayload
  ): Promise<boolean>;
  deleteRecipeById(id: string | ObjectId): Promise<boolean>;
}
