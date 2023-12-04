import { logger } from "./logger";
import { NextFunction, Request, Response } from "express";

export const expressLogger = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  logger.info(`${req.method}:${req.originalUrl}`);
  next();
};
