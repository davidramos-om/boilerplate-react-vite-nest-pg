import { Field, InputType } from "@nestjs/graphql";
import { IsArray, IsEnum, IsUUID, MaxLength, ValidateIf } from "class-validator";
import { ROLE_TYPE } from "src/common/enums/roles";

@InputType()
export class CreateRoleInput {

    @Field({ nullable: false })
    @MaxLength(100, { message: "Name must be less than 100 characters" })
    name: string;


    @Field({ nullable: true })
    @MaxLength(20, { message: "Code must be less than 20 characters" })
    code: string;

    @Field({ nullable: true })
    @MaxLength(400, { message: "Description must be less than 400 characters" })
    description: string;

    @Field({ nullable: true })
    @IsUUID()
    @ValidateIf(o => o.tenant_id)
    tenant_id: string;

    @Field(() => [ String ], { nullable: false, defaultValue: [] })
    @IsUUID("4", { each: true })
    @IsArray()
    permissions: string[];

    @IsEnum(ROLE_TYPE)
    @Field(() => ROLE_TYPE, { nullable: true, defaultValue: ROLE_TYPE.CUSTOM })
    readonly type: ROLE_TYPE;
}

@InputType()
export class UpdateRoleInput extends CreateRoleInput {

    @Field({ nullable: false })
    @IsUUID()
    id: string;
}


@InputType()
export class AssignRolesToUserInput {

    @Field({ nullable: false })
    @IsUUID()
    userRowId: string;

    @Field(() => [ String ], { nullable: false })
    @IsUUID("4", { each: true })
    @IsArray()
    roles: string[];
}