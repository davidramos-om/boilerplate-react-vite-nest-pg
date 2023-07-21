import { Field, ObjectType } from "@nestjs/graphql";

import { BaseModel } from "./base.model";
import { SYSTEM_STATUS } from "src/common/enums/status";
import { IsEnum } from "class-validator";

@ObjectType()
export class OnboardingRequetModel extends BaseModel {

    @Field({ nullable: true })
    code: string;

    @Field({ nullable: true })
    first_name: string;

    @Field({ nullable: true })
    last_name: string;

    @Field({ nullable: true })
    company: string;

    @Field({ nullable: true })
    email: string;

    @Field({ nullable: true })
    phone: string;

    @Field({ nullable: true })
    address: string;

    @Field({ nullable: true })
    message: string;

    @Field(() => SYSTEM_STATUS, { nullable: false, defaultValue: SYSTEM_STATUS.UNREAD })
    @IsEnum(SYSTEM_STATUS)
    status: SYSTEM_STATUS;

    @Field({ nullable: true })
    get fullName(): string {
        return `${this.first_name} ${this.last_name}`;
    }
}

