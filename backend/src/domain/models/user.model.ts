import { Field, ObjectType } from "@nestjs/graphql";
import { IsEnum } from "class-validator";

import { SYSTEM_STATUS } from "src/common/enums/status";
import { USER_TYPE } from "src/common/enums/user-type";
import { BaseModel } from "./base.model";
import { TenantModel } from "./tenant.model";

@ObjectType()
export class UserRoleModel {
    @Field({ nullable: true })
    id: string;

    @Field({ nullable: true })
    role_id: string;

    @Field({ nullable: true })
    name: string;
}

@ObjectType()
export class UserModel extends BaseModel {

    @Field({ nullable: true })
    user_id: string;

    @Field({ nullable: true })
    first_name: string;

    @Field({ nullable: true })
    last_name: string;

    @Field({ nullable: false })
    email: string;

    @Field({ nullable: true })
    image_url: string;

    @Field(() => USER_TYPE, { nullable: false, defaultValue: USER_TYPE.COMPANY_USER, description: "Default access will be given in accordance to the user type" })
    type: USER_TYPE;

    @Field(() => SYSTEM_STATUS, { nullable: false, defaultValue: SYSTEM_STATUS.UNREAD })
    @IsEnum(SYSTEM_STATUS)
    status: SYSTEM_STATUS;

    @Field(() => TenantModel, { nullable: true })
    tenant: TenantModel;

    @Field(() => [ UserRoleModel ], { nullable: true })
    roles: UserRoleModel[];

    @Field(() => String, { nullable: true })
    get fullName() {
        return `${this.first_name} ${this.last_name}`;
    }
}

