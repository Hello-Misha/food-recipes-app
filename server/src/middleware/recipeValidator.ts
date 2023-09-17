import Joi from "joi";
import { Request, Response, NextFunction } from "express";

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

export function recipePathParamsValidator(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.params);
    if (!error) {
      next();
    } else {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      console.error("Invalid path parameters:", errorMessage);
      res.status(422).json({ error: errorMessage });
    }
  };
}
