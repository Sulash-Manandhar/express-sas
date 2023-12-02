import pino from "pino";
import pretty from "pino-pretty";

const stream = pretty({
  colorize: true,
  timestampKey: "time",
  translateTime: true,
});

export const logger = pino(stream);
