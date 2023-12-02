import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { logger } from "./utils/logger";
import * as dotenv from "dotenv";
import { createEnv, Env } from "./config/env";

const app: Application = express();

dotenv.config();

export const config: Env = createEnv(process.env);

if (!config) {
  logger.error("Error:Creating a environment config failed");
  throw new Error("Error:Creating a environment config failed.");
}

// Enable CORS for specific URIs
const corsOptions = {
  origin: config.CORS_HOSTS,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.all("/api/status", (req: Request, res: Response) => {
  res.sendStatus(200);
});

app.listen(config.BACKEND_PORT, () => {
  logger.info(`Server has started on http://localhost:${config.BACKEND_PORT}`);
  logger.info(
    `Check server status on http://localhost:${config.BACKEND_PORT}/api/status`
  );
});
