import { cleanEnv, makeValidator, port, str, bool } from 'envalid';

const isTest = process.env.NODE_ENV === 'test';
const nonEmptyStr = makeValidator<string>((val) => {
    if (typeof val === 'string' && val.length > 0) return val;
    throw new Error('Cannot be empty');
});

export const env = cleanEnv(process.env, {
    IN_DOCKER: bool({ default: false }),
    NODE_ENV: str({
        choices: ['development', 'test', 'production'],
        default: 'development'
    }),
    PORT: port({ default: 3000 }),
    SESSION_SECRET: isTest ? str({ default: 'your-secret-here' }) : nonEmptyStr(),
    DB_HOST: str({ default: isTest ? '127.0.0.1' : undefined }),
    DB_USER: str({ default: isTest ? 'root' : undefined }),
    DB_PASSWORD: str({ default: isTest ? 'pass' : undefined }),
    DB_NAME: str({ default: isTest ? 'lineage_remastered' : undefined }),
});
