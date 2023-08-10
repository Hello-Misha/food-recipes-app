import Joi, { ValidationResult, string } from "joi";
import { Request, Response, NextFunction } from "express";
// import { ObjectId } from "mongodb";

export function recipeBodyValidator(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);

    if (!error) {
      return next();
    }

    const { details } = error;
    const message = details.map((i) => i.message).join(",");

    console.log("error", message);
    res.status(422).json({ error: message });
  };
}

export function recipeIdValidator(schema: Joi.StringSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.params.id);
    if (!error) {
      next();
    } else {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      console.error("Invalid recipe ID:", errorMessage);
      res.status(422).json({ error: errorMessage });
    }
  };
}
