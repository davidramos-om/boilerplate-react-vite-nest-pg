import { Field, ObjectType } from "@nestjs/graphql";
import { IsEnum } from "class-validator";

import { SYSTEM_STATUS } from "src/common/enums/status";
import { BaseModel } from "./base.model";
import { AddressModel } from "./address.model";

@ObjectType()
export class TenantModel extends BaseModel {

    @Field({ nullable: true })
    code: string;

    @Field({ nullable: true })
    description: string;

    @Field({ nullable: true })
    address: string;

    @Field({ nullable: true })
    contact_name: string;

    @Field({ nullable: true })
    contact_email: string;

    @Field({ nullable: true })
    contact_phone: string;

    @Field({ nullable: false, defaultValue: 0 })
    subscription_cost: number;

    @Field({ nullable: false, defaultValue: 0 })
    additional_cost: number;

    @Field({ nullable: false, defaultValue: 0 })
    get total_cost(): number {
        return Number(this.subscription_cost || 0) + Number(this.additional_cost || 0);
    }

    @Field({ nullable: true })
    access_enabled: boolean;

    @Field({ nullable: true })
    logo_url: string;

    @Field({ nullable: true })
    schema_populated: boolean;

    @Field({ nullable: true })
    schema_error: string;

    @Field({ nullable: true })
    last_active: Date;

    @Field(() => AddressModel, { nullable: true, defaultValue: null })
    billing_address: AddressModel;

    @Field(() => SYSTEM_STATUS, { nullable: false, defaultValue: SYSTEM_STATUS.UNREAD })
    @IsEnum(SYSTEM_STATUS)
    status: SYSTEM_STATUS;
}

@ObjectType()
export class TenantAuthModel {

    @Field({ nullable: true })
    id: string;

    @Field({ nullable: true })
    code: string;

    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    logo_url: string;

    @Field({ nullable: true })
    slug: string;
}