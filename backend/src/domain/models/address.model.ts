import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString, IsNotEmpty } from "class-validator";

@InputType("AddressInput")
@ObjectType("AddressType")
export class AddressModel {

    @Field({ nullable: false })
    @IsString()
    @IsNotEmpty()
    address_line_1: string;

    @Field({ nullable: true, defaultValue: "" })
    @IsString()
    address_line_2: string;

    @Field({ nullable: false })
    @IsString()
    @IsNotEmpty()
    city: string;

    @Field({ nullable: false })
    @IsString()
    @IsNotEmpty()
    state: string;

    @Field({ nullable: false })
    @IsString()
    @IsNotEmpty()
    zip_code: string;

    @Field({ nullable: false })
    @IsString()
    @IsNotEmpty()
    country: string;
}
