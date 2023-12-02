import { pluck, checkEnvObject } from "valid-env";

export type Env = ReturnType<typeof createEnv>;

export function createEnv(env = process.env) {
  const CORS_HOSTS = env.CORS_HOSTS?.split(",") ?? [];

  return checkEnvObject({
    DATABASE_URL: "",
    ...pluck(
      env,
      "BACKEND_PORT",
      "NODEMAILER_EMAIL",
      "NODEMAILER_PASS",
      "FRONTEND_URL"
    ),
    CORS_HOSTS,
  });
}
