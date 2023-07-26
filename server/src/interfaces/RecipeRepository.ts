import { Db, Collection, InsertOneResult, ObjectId } from "mongodb";
import {
  RecipePayload,
  Recipe,
  RecipePatchPayload,
  RecipeCreateRequestPayload,
} from "./Recipe";

export interface RecipeRepositoryInterface {
  createRecipe(recipeData: RecipeCreateRequestPayload): Promise<ObjectId>;
  getAllRecipes(): Promise<Recipe[]>;
  getRecipeById(id: string | ObjectId): Promise<Recipe | null>;
  updateRecipe(
    id: string | ObjectId,
    updatedRecipe: RecipePatchPayload
  ): Promise<boolean>;
  deleteRecipeById(id: string | ObjectId): Promise<boolean>;
}

export class RecipesRepository implements RecipeRepositoryInterface {
  private collection: Collection;

  constructor(private db: Db) {
    this.collection = db.collection("recipes");
  }

  async createRecipe(
    recipeData: RecipeCreateRequestPayload
  ): Promise<ObjectId> {
    try {
      const newRecipe: RecipePayload = {
        title: recipeData.title,
        description: recipeData.description,
        categories: recipeData.categories,
        ingredients: recipeData.ingredients,
        steps: recipeData.steps,
        createdAt: Math.floor(Date.now() / 1000),
      };
      const result: InsertOneResult<any> = await this.collection.insertOne(
        newRecipe
      );
      return result.insertedId as ObjectId;
    } catch (error) {
      console.error("Error creating recipe:", error);
      throw error;
    }
  }

  async getAllRecipes(): Promise<Recipe[]> {
    try {
      const documents = await this.collection.find().toArray();

      const recipes: Recipe[] = documents.map((recipe) => ({
        id: recipe._id,
        title: recipe.title,
        description: recipe.description,
        categories: recipe.categories,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        createdAt: recipe.createdAt,
      }));
      return recipes;
    } catch (error) {
      console.error("Error getting recipes:", error);
      throw error;
    }
  }

  async getRecipeById(id: string | ObjectId): Promise<Recipe | null> {
    try {
      const objectId = new ObjectId(id);
      const recipe = await this.collection.findOne({
        _id: objectId,
      });
      return recipe
        ? {
            id: recipe._id,
            title: recipe.title,
            description: recipe.description,
            categories: recipe.categories,
            ingredients: recipe.ingredients,
            steps: recipe.steps,
            createdAt: recipe.createdAt,
          }
        : null;
    } catch (error) {
      console.error("Error getting recipe:", error);
      throw error;
    }
  }

  async updateRecipe(
    id: string | ObjectId,
    updatedRecipe: RecipePatchPayload
  ): Promise<boolean> {
    try {
      const objectId = new ObjectId(id);
      const existingRecipe = await this.collection.findOne({
        _id: objectId,
      });
      if (!existingRecipe) {
        return false;
      }
      const updatedFields: { [key: string]: any } = {};
      if (updatedRecipe.title) {
        updatedFields.title = updatedRecipe.title;
      }
      if (updatedRecipe.description) {
        updatedFields.description = updatedRecipe.description;
      }
      if (updatedRecipe.categories) {
        updatedFields.categories = updatedRecipe.categories;
      }
      if (updatedRecipe.ingredients) {
        updatedFields.ingredients = updatedRecipe.ingredients;
      }
      if (updatedRecipe.steps) {
        updatedFields.steps = updatedRecipe.steps;
      }

      const updateResult = await this.collection.updateOne(
        { _id: objectId },
        { $set: updatedFields }
      );
      return updateResult.modifiedCount === 1;
    } catch (error) {
      console.error("Error updating recipe:", error);
      throw error;
    }
  }

  async deleteRecipeById(id: string | ObjectId): Promise<boolean> {
    try {
      const objectId = new ObjectId(id);
      const deleteResult = await this.collection.deleteOne({
        _id: objectId,
      });
      if (deleteResult.deletedCount === 1) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      throw error;
    }
  }
}
