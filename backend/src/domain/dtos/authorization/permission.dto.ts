import { Field, ObjectType } from "@nestjs/graphql";
import graphqlTypeJson from "graphql-type-json";

@ObjectType()
export class PermissionDto {

  @Field(() => graphqlTypeJson, { nullable: true })
  menu: object;

  @Field(() => graphqlTypeJson, { nullable: true })
  actions: object;
}
