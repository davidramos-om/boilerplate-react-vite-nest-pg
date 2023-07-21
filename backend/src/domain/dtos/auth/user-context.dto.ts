import { USER_TYPE } from "src/common/enums/user-type";

export interface UserContextDto {
  userRowId: string;
  userId: string;
  email: string;
  name: string;
  type: USER_TYPE;
  // roles: {
  //   name: string,
  //   id: string,
  // }[],
  // permissions: {
  //   id: string,
  //   subject: string,
  //   action: string,
  // }[],
  tenantId: string;
}
