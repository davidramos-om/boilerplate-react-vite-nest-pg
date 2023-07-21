
import { Field, ObjectType } from "@nestjs/graphql";
import graphqlTypeJson from "graphql-type-json";
import { TenantModel } from "./tenant.model";
import { ROLE_TYPE } from "src/common/enums/roles";

@ObjectType()
export class RoleModel {

    @Field({ description: "row indentifier", nullable: false })
    id: string;

    @Field({ nullable: true, defaultValue: "" })
    name: string;

    @Field({ nullable: true, defaultValue: "" })
    description: string;

    @Field(() => ROLE_TYPE, { nullable: false, defaultValue: ROLE_TYPE.CUSTOM })
    role_type: ROLE_TYPE;

    @Field(() => TenantModel, { nullable: true })
    tenant: TenantModel;

    @Field(() => [ PermissionModel ], { nullable: true, defaultValue: [] })
    permissions: PermissionModel[];
}

@ObjectType()
export class PermissionModel {

    @Field({ description: "row indentifier", nullable: false })
    id: string;

    @Field({ nullable: false, defaultValue: "" })
    name: string;

    @Field({ nullable: false, defaultValue: "" })
    code: string;

    @Field({ nullable: true, defaultValue: "" })
    action: string;

    @Field({ nullable: true, defaultValue: "" })
    module: string;

    @Field({ nullable: true, defaultValue: "" })
    resource: string;

    @Field({ nullable: true, defaultValue: "" })
    description: string;

    @Field({ nullable: true, defaultValue: "" })
    group: string;

    @Field({ nullable: true, defaultValue: 1 })
    order: number

    @Field({ nullable: true, defaultValue: 1 })
    resource_order: number;

    @Field(() => graphqlTypeJson, { nullable: true })
    conditions: object;
}
