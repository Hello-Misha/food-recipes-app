import { ObjectId } from "mongodb";

export interface Recipe {
  id: string | ObjectId;
  title: string;
  description: string;
  categories: string[];
  ingredients: string[];
  steps: string[];
  createdAt: number;
  updatedAt?: number;
}

export interface RecipeCreateRequestPayload
  extends Omit<Recipe, "id" | "updatedAt" | "createdAt"> {}

export interface RecipePayload extends Omit<Recipe, "id" | "updatedAt"> {}

export interface RecipePatchPayload
  extends Partial<RecipeCreateRequestPayload> {}
