import { ObjectId } from "mongodb";

import {
  RecipeCreateRequestPayload,
  Recipe,
  RecipePatchPayload,
} from "../interfaces/Recipe";
import { RecipeRepository } from "./RecipeRepository";

export class RecipeMapRepository implements RecipeRepository {
  private recipeMap: Map<string, Recipe> = new Map();

  async createRecipe(
    recipeData: RecipeCreateRequestPayload
  ): Promise<ObjectId> {
    const id = new ObjectId();
    const newRecipe: Recipe = {
      id: id,
      ...recipeData,
      createdAt: Math.floor(Date.now() / 1000),
    };
    this.recipeMap.set(id.toHexString(), newRecipe);
    return id;
  }

  async getAllRecipes(): Promise<Recipe[]> {
    const recipes = Array.from(this.recipeMap.values());
    return recipes;
  }

  async getRecipeById(id: string | ObjectId): Promise<Recipe | null> {
    const recipeId = id instanceof ObjectId ? id.toHexString() : id;
    const recipe = this.recipeMap.get(recipeId);
    return recipe || null;
  }

  async updateRecipe(
    id: string | ObjectId,
    updatedRecipe: RecipePatchPayload
  ): Promise<boolean> {
    const recipeId = id instanceof ObjectId ? id.toHexString() : id;
    const existingRecipe = this.recipeMap.get(recipeId);

    if (!existingRecipe) {
      return false;
    }

    const updatedRecipeData = { ...existingRecipe, ...updatedRecipe };
    this.recipeMap.set(recipeId, updatedRecipeData);
    return true;
  }

  async deleteRecipeById(id: string | ObjectId): Promise<boolean> {
    const recipeId = id instanceof ObjectId ? id.toHexString() : id;
    const deleted = this.recipeMap.delete(recipeId);
    return deleted;
  }
}
