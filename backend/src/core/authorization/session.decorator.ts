import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { NIL } from "uuid";

import { SessionDto } from "src/domain/dtos/auth/session.dto";
import { UserContextDto } from "src/domain/dtos/auth";
import { decodeToken } from "src/common/security/token-helper";
import { USER_TYPE } from "src/common/enums/user-type";

const emptySession: SessionDto = {
    userRowId: NIL,
    userId: NIL,
    accessToken: "",
    screenName: "",
    tenantId: NIL,
    tenantLogo: "",
    tenantSlug: "",
    email: "",
    picture: "",
    userType: USER_TYPE.COMPANY_USER,
    exp: 0,
}

export const GenerateSessionDto = (user: UserContextDto, token: string): SessionDto => {

    if (!token || token === "Bearer null")
        return emptySession;

    const status = decodeToken(token);
    if (!status) return emptySession;

    return {
        userRowId: status.userRowId,
        userId: status.userId,
        tenantId: status.tenantId,
        tenantLogo: status.tenantLogo || "",
        tenantSlug: status.tenantSlug || "",
        email: user?.email || status.email,
        picture: status.picture,
        userType: user?.type || status.userType,
        screenName: user?.name || "",
        exp: status.exp,
        accessToken: status.accessToken,
    };
}

export const UserSession = createParamDecorator((data: unknown, ctx: ExecutionContext): SessionDto => {

    const gqlCtx = GqlExecutionContext.create(ctx);
    const request = gqlCtx.getContext().req;
    const user = request.user as UserContextDto;

    return GenerateSessionDto(user, request?.headers?.authorization || "");
});
