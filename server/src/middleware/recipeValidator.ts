import Joi, { ValidationResult } from "joi";
import { Request, Response, NextFunction } from "express";

export function recipeValidator(schema: Joi.ObjectSchema) {
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
