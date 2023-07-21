import { Resolver, Mutation, Args } from "@nestjs/graphql";

import { isValidSecret } from "src/common/security/secret";

import { SeedRolesService } from "./seed-roles.service"
import { SeedPermissionService } from "./seed-permissions.service"
import { SeedUsersService } from "./seed-users.service"

@Resolver(() => Number)
export class SeedDataResolver {

    constructor(
        private readonly seedRoles: SeedRolesService,
        private readonly seedUsers: SeedUsersService,
        private readonly seedPermissions: SeedPermissionService
    ) { }

    @Mutation(() => Number)
    runUsersSeed(@Args("key", { type: () => String }) key: string): Promise<Number> {

        if (!isValidSecret(key))
            throw new Error("Invalid key");

        return this.seedUsers.runUsersSeeder();
    }

    @Mutation(() => Number)
    runRolesSeed(@Args("key", { type: () => String }) key: string): Promise<Number> {

        if (!isValidSecret(key))
            throw new Error("Invalid key");

        return this.seedRoles.runRolesSeeder();
    }

    @Mutation(() => Number)
    runPermissionsSeed(@Args("key", { type: () => String }) key: string): Promise<Number> {

        if (!isValidSecret(key))
            throw new Error("Invalid key");

        return this.seedPermissions.runPermissionsSeeder();
    }
}
