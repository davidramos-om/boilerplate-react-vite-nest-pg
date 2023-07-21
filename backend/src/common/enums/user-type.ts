import { registerEnumType } from "@nestjs/graphql";

export enum USER_TYPE {
  PORTAL_ROOT = "portal_root",
  COMPANY_USER = "company_user",
}

registerEnumType(USER_TYPE, {
  name: "USER_TYPE",
  description: "Type of users",
});
