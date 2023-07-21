import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsNotEmpty, IsString, IsUUID, MinLength, ValidateIf } from "class-validator";
import { NIL } from "uuid";

@InputType()
export class ResetPasswordRequestInput {

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  userId: string;

  @Field(() => String)
  @IsUUID('4')
  @IsNotEmpty()
  @ValidateIf(o => o.tenantId && o.tenantId !== NIL)
  tenantId: string;
}


@InputType()
export class ResetPasswordConfirmInput extends ResetPasswordRequestInput {

  @Field(() => String, { description: "token" })
  @IsString()
  @IsNotEmpty()
  readonly token: string;

  @Field(() => String, { description: "new password" })
  @IsString()
  @IsNotEmpty()
  @MinLength(4, { message: "Su contraseña debe tener al menos 4 caracteres" })
  readonly newPassword: string;
}


@InputType()
export class ChangeUserPasswordInput {

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  userRowId: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(4, { message: "Su contraseña debe tener al menos 4 caracteres" })
  password: string;

  @Field(() => Boolean)
  @IsNotEmpty()
  @IsBoolean()
  pass_change_req: boolean;

  @Field(() => String, { nullable: true, defaultValue: "" })
  @IsString()
  pass_token: string;

  @Field(() => Date, { nullable: true, defaultValue: null })
  pass_link_exp: Date;
}


@InputType()
export class SetUserPasswordInput {

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  userRowId: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(4, { message: "Su contraseña debe tener al menos 4 caracteres" })
  password: string;
}
