import { Field, ObjectType } from "@nestjs/graphql";
import { IsEnum } from "class-validator";

import { PermissionDto } from "src/domain/dtos/authorization/permission.dto";
import { USER_TYPE } from "src/common/enums/user-type";

@ObjectType()
export class SessionDto {

  @Field({ nullable: false })
  userRowId: string;

  @Field({ nullable: false })
  userId: string;

  @Field({ nullable: false })
  tenantId: string;

  @Field({ nullable: false })
  email: string;

  @Field({ nullable: true })
  picture: string;

  @Field({ nullable: true })
  tenantLogo: string;

  @Field({ nullable: true })
  tenantSlug: string;

  @Field({ nullable: true })
  screenName: string;

  @Field(() => USER_TYPE, { nullable: false })
  @IsEnum(USER_TYPE)
  userType: USER_TYPE;

  @Field({ nullable: false })
  accessToken: string;

  @Field({ nullable: false })
  exp: number;
}

@ObjectType()
export class LoginStatusDto {
  @Field(() => SessionDto, { nullable: false })
  session: SessionDto;

  @Field(() => PermissionDto, { nullable: false })
  permissions: PermissionDto;
}
