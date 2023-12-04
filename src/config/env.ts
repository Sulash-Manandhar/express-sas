import { checkEnvObject, pluck } from 'valid-env';

export type Env = ReturnType<typeof createEnv>;

export function createEnv(env = process.env) {
    const CORS_HOSTS = env.CORS_HOSTS?.split(',') ?? [];

    return checkEnvObject({
        ...pluck(
            env,
            'DATABASE_URL',
            'BACKEND_PORT',
            'NODEMAILER_EMAIL',
            'NODEMAILER_PASS',
            'FRONTEND_URL',
            'ACCESS_TOKEN_SECRET',
            'REFRESH_TOKEN_SECRET',
            'VERIFY_USER_SECRET',
            'RESET_PASSWORD_SECRET',
        ),
        CORS_HOSTS,
    });
}
