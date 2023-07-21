import { paths } from 'src/routes/paths';
import { LS_TOKEN_KEY } from "./constants";

export function getAccessToken(): string {
    return localStorage.getItem(LS_TOKEN_KEY) || '';
}

function jwtDecode(token: string) {

    const base64Url = token.split('.')[ 1 ];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split('')
            .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
            .join('')
    );

    return JSON.parse(jsonPayload);
}


export const isValidToken = (accessToken: string) => {

    if (!accessToken)
        return false;

    const decoded = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
};


export const tokenExpired = (exp: number) => {

    // eslint-disable-next-line prefer-const
    let expiredTimer;

    // Token expire in 7 days
    const timeLeft7Days = 7 * 24 * 60 * 60 * 1000;

    clearTimeout(expiredTimer);

    expiredTimer = setTimeout(() => {
        alert('Token expired');

        // sessionStorage.removeItem(LS_TOKEN_KEY);
        clearSession();

        window.location.href = paths.auth.portal;
    }, timeLeft7Days);
};


export const setSession = (accessToken: string) => {

    if (!accessToken)
        throw new Error('Access token must be provided');

    localStorage.setItem(LS_TOKEN_KEY, accessToken);

    // This function below will handle when token is expired
    const { exp } = jwtDecode(accessToken); // ~7 days by server
    tokenExpired(exp);
};

export const clearSession = () => {
    localStorage.removeItem(LS_TOKEN_KEY);
}

