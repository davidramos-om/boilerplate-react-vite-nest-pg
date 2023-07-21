import { Field, InputType, ObjectType, OmitType, PartialType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsBoolean, IsEmail, IsNumber, IsString, IsUUID, IsUrl, MaxLength, ValidateIf, } from "class-validator";
import { AddressModel } from "src/domain/models/address.model";

@InputType()
export class CreateTenantInput {

    @Field({ nullable: false })
    @IsString()
    @MaxLength(25, { message: "El código debe ser menor a 25 caracteres" })
    code: string;

    @Field({ nullable: false })
    @IsString({ message: "Name must be a string" })
    @MaxLength(200, { message: "El nombre debe ser menor a 200 caracteres" })
    name: string;

    @Field({ nullable: true })
    @IsString()
    description: string;

    @Field({ nullable: true })
    @IsString()
    address: string;

    @Field({ nullable: true })
    @IsString()
    @MaxLength(100, { message: "Nombre del contacto debe ser menor a 100 caracteres" })
    contact_name: string;

    @Field({ nullable: false })
    @IsEmail()
    @MaxLength(100, { message: "El email del contacto debe ser menor a 100 caracteres" })
    contact_email: string;

    @Field({ nullable: true })
    @IsString()
    @MaxLength(100, { message: "El telefono del contacto debe ser menor a 100 caracteres" })
    contact_phone: string;

    @Field({ nullable: true })
    @IsNumber()
    subscription_cost: number;

    @Field({ nullable: true })
    @IsNumber()
    additional_cost: number;

    @Field({ nullable: true })
    @IsBoolean()
    access_enabled: boolean;

    @Field({ nullable: true })
    @IsUrl({}, { message: "Logo URL must be a valid URL" })
    logo_url: string;

    @Field(() => AddressModel, { nullable: true })
    @Type(() => AddressModel)
    @ValidateIf(o => o.billing_address)
    billing_address: AddressModel;

    @Field({ nullable: false })
    @IsString()
    user_id: string;

    @Field({ nullable: true })
    @IsString()
    password: string;
}


//* Extend from CreateInput to reuse the fiels but  make them optional with PartialType and omit the db_schema field with OmitType
@InputType()
export class UpdateTenantInput extends OmitType(PartialType(CreateTenantInput), [ "user_id", "password" ]) {

    @Field({ nullable: false })
    @IsUUID()
    id: string;
}

@ObjectType()
export class RunMigrationResult {

    @Field({ nullable: false })
    success: boolean;

    @Field({ nullable: false })
    message: string;

    @Field({ nullable: true })
    tenantId: string;

    @Field({ nullable: true })
    tenantName: string;

    @Field({ nullable: true })
    query: string;
}

@ObjectType()
export class PgCredentialResult {

    @Field({ nullable: false })
    username: string;

    @Field({ nullable: false })
    password: string;

    @Field({ nullable: false })
    squema: string;
}

@ObjectType()
export class SchemaResult {

    @Field({ nullable: false })
    created: boolean;

    @Field({ nullable: false })
    message: string;
}