import { APP_CONFIG } from 'src/config-global';

export function getErrorFromGQL(error: any): string {

    return (error?.message || '')
        .replace('GraphQL error:', '')
        .replace('Network error:', '')
        .replace('Received status code 400', '');
}

function canUseLogger() {

    const env = String(APP_CONFIG.ENVIROMENT).toLowerCase();
    if (env === 'prod' || env === 'production' || env === 'live')
        return false;

    return true;
}

export function consoleLog(value: any, ...optionalParams: any[]) {

    if (!canUseLogger()) return;
    console.log(value, optionalParams);
}

export function consoleInfo(value: any, ...optionalParams: any[]) {

    if (!canUseLogger()) return;
    console.info(value, optionalParams);
}

export function consoleWaring(value: any, ...optionalParams: any[]) {

    if (!canUseLogger()) return;
    console.warn(value, optionalParams);
}

export function consoleError(value: any, ...optionalParams: any[]) {

    if (!canUseLogger()) return;
    console.error(value, optionalParams);
}

export function consoleTable(value: any, ...optionalParams: any[]) {

    if (!canUseLogger()) return;
    console.table(value, optionalParams);
}