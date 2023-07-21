
import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsString, MaxLength, } from "class-validator";

@InputType()
export class CreateOnboardingRequestInput {

    @Field({ nullable: false })
    @IsString({ message: "Name must be a string" })
    @MaxLength(100, { message: "Name must be less than 100 characters" })
    first_name: string;

    @Field({ nullable: false })
    @IsString({ message: "Name must be a string" })
    @MaxLength(100, { message: "Name must be less than 100 characters" })
    last_name: string;

    @Field({ nullable: false })
    @IsString({ message: "Name must be a string" })
    @MaxLength(100, { message: "Name must be less than 100 characters" })
    company: string;

    @Field({ nullable: false })
    @IsEmail()
    @MaxLength(100, { message: "Email must be less than 100 characters" })
    email: string;

    @Field({ nullable: true })
    @IsString()
    phone: string;

    @Field({ nullable: true })
    @IsString()
    address: string;

    @Field({ nullable: true })
    @IsString()
    message: string;
}
