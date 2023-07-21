import { Field, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

@ObjectType()
export class CreatePermissionDto {

    @Field({ nullable: true, defaultValue: "" })
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field({ nullable: true, defaultValue: "" })
    @IsString()
    @IsNotEmpty()
    code: string;

    @Field({ nullable: true, defaultValue: "" })
    @IsString()
    @IsNotEmpty()
    action: string;

    @Field({ nullable: true, defaultValue: "" })
    @IsString()
    @IsNotEmpty()
    module: string;

    @Field({ nullable: true, defaultValue: "" })
    @IsString()
    @IsNotEmpty()
    resource: string;

    @Field({ nullable: true, defaultValue: "" })
    @IsString()
    @IsNotEmpty()
    description: string;

    @Field({ nullable: true, defaultValue: "" })
    @IsString()
    @IsNotEmpty()
    group: string;

    @Field({ nullable: true, defaultValue: 1 })
    @IsNumber()
    @IsPositive()
    order: number;

    @Field({ nullable: true, defaultValue: 1 })
    @IsNumber()
    @IsPositive()
    resource_order: number;
}
