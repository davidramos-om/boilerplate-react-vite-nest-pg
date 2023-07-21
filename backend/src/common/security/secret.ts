import config from 'src/config';

const cf = config();

export function isValidSecret(secret: string): boolean {
    if (!secret) return false;

    return secret === cf.APP_SECRET_KEY;
}