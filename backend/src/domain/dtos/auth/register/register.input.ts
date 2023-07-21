import { InputType, Field, OmitType, PartialType } from "@nestjs/graphql";
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsString, IsUUID, IsUrl, ValidateIf } from "class-validator";

import { USER_TYPE } from "src/common/enums/user-type";

@InputType()
export class CreateUserInput {

  @Field({ description: "User id", nullable: false })
  @IsString()
  readonly user_id: string;

  @IsEmail()
  @Field({ description: "Email", nullable: true })
  @ValidateIf(o => o.email)
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Field({ description: "Clear password", nullable: false })
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @Field({ nullable: false })
  readonly first_name: string;

  @IsString()
  @IsNotEmpty()
  @Field({ nullable: false })
  readonly last_name: string;

  @Field({ nullable: true })
  @IsUrl({}, { message: "Image must be a valid url" })
  image_url: string;

  @IsUUID()
  @Field({ nullable: true })
  @ValidateIf(o => (o.type || USER_TYPE.COMPANY_USER) === USER_TYPE.COMPANY_USER, { message: "Tenant id is required for company user" })
  readonly tenant_id: string;

  @IsEnum(USER_TYPE)
  @IsNotEmpty()
  @Field(() => USER_TYPE, { nullable: true, defaultValue: USER_TYPE.COMPANY_USER })
  readonly type: USER_TYPE;

  @Field(() => [ String ], { nullable: true, defaultValue: [] })
  @IsArray()
  @IsUUID("4", { each: true })
  readonly roles: string[];
}


@InputType()
export class UpdateUserInput extends PartialType(OmitType(CreateUserInput, [ "password" ])) {

  @Field({ nullable: false })
  @IsUUID()
  id: string;
}