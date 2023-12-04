import boom from "@hapi/boom";
import { NextFunction, Request, Response } from "express";

const apiTimeOut = (_req: Request, res: Response, next: NextFunction) => {
  const timeoutMillis = 60000;
  const timeout = setTimeout(() => {
    next(boom.clientTimeout("API call timeout"));
  }, timeoutMillis);

  res.on("finish", () => {
    clearTimeout(timeout);
  });

  next();
};

export default apiTimeOut;
