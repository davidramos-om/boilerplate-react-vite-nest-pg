
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class FileModel {

    @Field({ description: "row indentifier", nullable: false })
    id: string;

    @Field({ nullable: true, defaultValue: "" })
    public url: string;

    @Field({ nullable: true, defaultValue: "" })
    public key: string;
}
