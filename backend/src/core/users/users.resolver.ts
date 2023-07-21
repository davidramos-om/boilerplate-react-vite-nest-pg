import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";

import { UserSession, SessionDto, JwtAuthGuard, PermissionsGuard, CheckPermissions } from "src/core/authorization";
import { CreateUserInput, SetUserPasswordInput, UpdateUserInput } from "src/domain/dtos/auth";
import { UserModel } from "src/domain/models/user.model";
import { USER_TYPE } from "src/common/enums/user-type";
import { UsersService } from "./users.service";


@Resolver(() => UserModel)
@UseGuards(JwtAuthGuard)
export class UsersResolver {

  constructor(
    private readonly usersService: UsersService,
  ) { }


  @Query(() => [ UserModel ], { name: "users" })
  @UseGuards(PermissionsGuard)
  @CheckPermissions([ 'READ', 'USERS' ])
  findAll(@UserSession() ssn: SessionDto) {
    return this.usersService.findAll(ssn);
  }

  @Query(() => UserModel, { name: "user", nullable: true })
  @UseGuards(PermissionsGuard)
  @CheckPermissions([ 'READ', 'USERS' ])
  findById(@Args("id", { type: () => String }) id: string, @UserSession() ssn: SessionDto) {
    return this.usersService.findByRowId(id, ssn);
  }

  @Query(() => UserModel, { name: "findUserByEmail", nullable: true })
  @UseGuards(PermissionsGuard)
  @CheckPermissions([ 'READ', 'USERS' ])
  findByEmail(@Args("email", { type: () => String }) email: string) {
    return this.usersService.findByEmail(email);
  }

  @Query(() => [ USER_TYPE ], { name: "userEnums", nullable: false })
  getTypes() {
    return this.usersService.userTypes();
  }

  @Mutation(() => UserModel)
  @UseGuards(PermissionsGuard)
  @CheckPermissions([ 'CREATE', 'USERS' ])
  async createUser(@Args("input") input: CreateUserInput, @UserSession() ssn: SessionDto) {
    return this.usersService.createUser(input, ssn);
  }

  @Mutation(() => UserModel)
  @UseGuards(PermissionsGuard)
  @CheckPermissions([ 'UPDATE', 'USERS' ])
  async updateUser(@Args("input") input: UpdateUserInput, @UserSession() ssn: SessionDto) {
    return this.usersService.updateUser(input, ssn);
  }

  @Mutation(() => Boolean)
  @UseGuards(PermissionsGuard)
  @CheckPermissions([ 'UPDATE', 'RESET_USER_PASSWORD' ])
  async assignUserPassword(@Args("input") input: SetUserPasswordInput, @UserSession() ssn: SessionDto) {

    return this.usersService.changePasswordParams({
      ...input,
      pass_change_req: false,
      pass_link_exp: null,
      pass_token: null,
    },
      ssn
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(PermissionsGuard)
  @CheckPermissions([ 'UPDATE', 'DEACTIVATE_USER' ])
  async deactivateUser(@Args("id", { type: () => String }) id: string, @UserSession() ssn: SessionDto) {
    return this.usersService.disableUser(id, ssn);
  }

  @Mutation(() => Boolean)
  @UseGuards(PermissionsGuard)
  @CheckPermissions([ 'UPDATE', 'ACTIVATE_USER' ])
  async reactivateUser(@Args("id", { type: () => String }) id: string, @UserSession() ssn: SessionDto) {
    return this.usersService.enableUser(id, ssn);
  }
}
