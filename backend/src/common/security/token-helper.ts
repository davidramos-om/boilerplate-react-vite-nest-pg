import jwt_decode from "jwt-decode";

import { JwtPayloadDto } from "src/domain/dtos/auth/payload.dto";
import { USER_TYPE } from "../enums/user-type";

export const parseBearerToken = (token: string): string => {

    if (!token)
        return "";

    let jwt = token;
    if (jwt.startsWith("Bearer"))
        jwt = jwt.split(" ")[ 1 ];

    return jwt;
}

export const decodeToken = (data: any): JwtPayloadDto & { exp: number, accessToken: string } | null => {

    if (!data)
        return null;

    const jwt = parseBearerToken(data);

    const decode = jwt_decode(jwt);
    if (!decode)
        return null;

    const _userType = decode[ "userType" ];
    const isValidUserType = _userType && Object.values(USER_TYPE).includes(_userType);

    return {
        userRowId: decode[ "userRowId" ],
        userId: decode[ "userId" ],
        tenantId: decode[ "tenantId" ],
        tenantLogo: decode[ "tenantLogo" ],
        tenantSlug: decode[ "tenantSlug" ],
        email: decode[ "email" ],
        picture: decode[ "picture" ],
        userType: isValidUserType ? _userType as USER_TYPE : USER_TYPE.COMPANY_USER,
        exp: decode[ "exp" ] ? decode[ "exp" ] : 0,
        accessToken: jwt,
    };
}
