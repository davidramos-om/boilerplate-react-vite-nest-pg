import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class BaseModel {

    @Field({ description: "row indentifier", nullable: false })
    id: string;

    @Field({ description: "Name", nullable: true })
    name: string;

    @Field({ description: "slug", nullable: true })
    slug: string;

    @Field({ nullable: true, description: "Date the record was updated" })
    created_at: Date;

    @Field({ nullable: true, description: "User created the record" })
    created_by: string;

    @Field({ nullable: true, description: "Date the record was updated" })
    updated_at: Date;

    @Field({ nullable: true, description: "User updated the record" })
    updated_by: string;
}
