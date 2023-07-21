import { registerEnumType } from "@nestjs/graphql";

export enum ROLE_TYPE {
  FULL_ACCESS = "FULL_ACCESS",
  CUSTOM = "CUSTOM",
}

registerEnumType(ROLE_TYPE, {
  name: "ROLE_TYPE",
  description: "The type of roles in the system"
});


