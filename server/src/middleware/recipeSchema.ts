import Joi from "joi";
import { ObjectId } from "mongodb";

export const recipeSchemas = {
  recipePOST: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    categories: Joi.array().items(Joi.string()).required(),
    ingredients: Joi.array().items(Joi.string()).required(),
    steps: Joi.array().items(Joi.string()).required(),
  }),
  recipePATCH: Joi.object().keys({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    categories: Joi.array().items(Joi.string()).optional(),
    ingredients: Joi.array().items(Joi.string()).optional(),
    steps: Joi.array().items(Joi.string()).optional(),
  }),
  recipeDetails: Joi.object({
    id: Joi.string().custom((value, helpers) => {
      if (!ObjectId.isValid(value)) {
        return helpers.message({ custom: "ObjectId Validation" });
      }
      return value;
    }),
  }),
};
