import { ArgsType } from "@nestjs/graphql";
import { USER_TYPE } from "src/common/enums/user-type";

export class JwtPayloadDto {
  userRowId: string;
  userId: string;
  email: string;
  picture: string;
  userType: USER_TYPE;
  tenantId: string;
  tenantLogo: string;
  tenantSlug: string;
}

@ArgsType()
export class AccessToken {
  accessToken: any;
  expiresIn: string;
}
