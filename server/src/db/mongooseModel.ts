import mongoose, { Document, Schema } from "mongoose";

const recipeSchema = new Schema<RecipeDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  categories: [{ type: String, required: true }],
  ingredients: [{ type: String, required: true }],
  steps: [{ type: String, required: true }],
  createdAt: { type: Number, required: true },
  updatedAt: { type: Number },
});
export const RecipeModel = mongoose.model<RecipeDocument>(
  "Recipe",
  recipeSchema
);

// Define a Document interface for type checking
export interface RecipeDocument extends Recipe, Document {}

// Export the RecipeModel for use in other parts of your application
export default RecipeModel;
