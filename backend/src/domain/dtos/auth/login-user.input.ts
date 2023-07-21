import { InputType, Field } from "@nestjs/graphql";
import { IsEnum, IsNotEmpty } from "class-validator";
import { USER_TYPE } from "src/common/enums/user-type";

@InputType()
export class LoginUserInput {

  @Field()
  @IsNotEmpty()
  readonly userId: string;

  @Field()
  @IsNotEmpty()
  readonly password: string;

  @Field({ nullable: false })
  @IsNotEmpty({ message: "Empresa o portal es requerido" })
  readonly tenantId: string;

  @Field({ nullable: false })
  @IsNotEmpty()
  @Field(() => USER_TYPE, { nullable: false, defaultValue: USER_TYPE.COMPANY_USER })
  @IsEnum(USER_TYPE)
  readonly domain: USER_TYPE
}
