export const LS_TOKEN_KEY = 'accessToken';
export const CODE_REGEX_PATTERN = '^(?!-/)(?!.*--)^[A-Za-z0-9-_.]+(?=#|$)';
export const NIL_UUID = '00000000-0000-0000-0000-000000000000';

export const REGEX_CODE = new RegExp(CODE_REGEX_PATTERN);
export const MSG_REGEX_CODE_PATTERN = 'Solo puede contener letras en mayúscula, números, guiones medios y bajos';