import { Db, Collection, InsertOneResult, ObjectId } from "mongodb";
import {
  RecipePayload,
  Recipe,
  RecipePatchPayload,
  RecipeCreateRequestPayload,
} from "../interfaces/Recipe";
import { RecipeRepository } from "./RecipeRepository";
export class RecipeMongoRepository implements RecipeRepository {
  private collection: Collection;

  constructor(private db: Db) {
    this.collection = db.collection("recipes");
  }

  async createRecipe(
    recipeData: RecipeCreateRequestPayload
  ): Promise<ObjectId> {
    const newRecipe: RecipePayload = {
      ...recipeData,
      createdAt: Math.floor(Date.now() / 1000),
    };
    const result: InsertOneResult<any> = await this.collection.insertOne(
      newRecipe
    );
    return result.insertedId as ObjectId;
  }

  async getAllRecipes(): Promise<Recipe[]> {
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
  }

  async getRecipeById(id: string | ObjectId): Promise<Recipe | null> {
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
  }

  async updateRecipe(
    id: string | ObjectId,
    updatedRecipe: RecipePatchPayload
  ): Promise<boolean> {
    const objectId = new ObjectId(id);
    const existingRecipe = await this.collection.findOne({
      _id: objectId,
    });
    if (!existingRecipe) {
      return false;
    }
    const updateResult = await this.collection.updateOne(
      { _id: objectId },
      { $set: updatedRecipe }
    );
    return updateResult.modifiedCount === 1;
  }

  async deleteRecipeById(id: string | ObjectId): Promise<boolean> {
    const objectId = new ObjectId(id);
    const deleteResult = await this.collection.deleteOne({
      _id: objectId,
    });
    return deleteResult.deletedCount === 1;
  }
}
