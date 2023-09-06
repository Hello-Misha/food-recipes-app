import { ObjectId } from "mongodb";
// import { v4 as uuidv4 } from "uuid";

import {
  RecipeCreateRequestPayload,
  Recipe,
  RecipePatchPayload,
} from "../interfaces/Recipe";
import { RecipeRepository } from "./RecipeRepository";

const recipeMap: Map<string, Recipe> = new Map();

export class RecipeMapRepository implements RecipeRepository {
  async createRecipe(
    recipeData: RecipeCreateRequestPayload
  ): Promise<ObjectId> {
    const id = new ObjectId();
    const newRecipe: Recipe = {
      id: id,
      ...recipeData,
      createdAt: Math.floor(Date.now() / 1000),
    };
    recipeMap.set(id.toHexString(), newRecipe);
    return id;
  }

  async getAllRecipes(): Promise<Recipe[]> {
    const recipes = Array.from(recipeMap.values());
    return recipes;
  }

  async getRecipeById(id: string | ObjectId): Promise<Recipe | null> {
    const recipeId = id instanceof ObjectId ? id.toHexString() : id;
    const recipe = recipeMap.get(recipeId);
    return recipe || null;
  }

  async updateRecipe(
    id: string | ObjectId,
    updatedRecipe: RecipePatchPayload
  ): Promise<boolean> {
    const recipeId = id instanceof ObjectId ? id.toHexString() : id;
    const existingRecipe = recipeMap.get(recipeId);

    if (!existingRecipe) {
      return false;
    }

    const updatedRecipeData = { ...existingRecipe, ...updatedRecipe };
    recipeMap.set(recipeId, updatedRecipeData);
    return true;
  }

  async deleteRecipeById(id: string | ObjectId): Promise<boolean> {
    const recipeId = id instanceof ObjectId ? id.toHexString() : id;
    const deleted = recipeMap.delete(recipeId);
    return deleted;
  }
}
