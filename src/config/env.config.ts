import { cleanEnv, makeValidator, port, str } from 'envalid';

const nonEmptyStr = makeValidator<string>((val) => {
    if (typeof val === 'string' && val.length > 0) return val;
    throw new Error('Cannot be empty');
});

export const env = cleanEnv(process.env, {
    PORT: port({ default: 3000 }),
    SESSION_SECRET: nonEmptyStr(),
    DB_HOST: str(),
    DB_USER: str(),
    DB_PASSWORD: str(),
    DB_NAME: str(),
});
