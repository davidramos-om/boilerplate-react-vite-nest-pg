import { UseGuards } from "@nestjs/common";
import { Resolver, Args, Mutation } from "@nestjs/graphql";

import { JwtAuthGuard, PermissionsGuard, CheckPermissions } from "src/core/authorization";
import { MailService } from "./mail.service";
import { StandarEmailInput } from "./compose/generic-email";
import { TenantDataUpdatedInput } from "./compose/tenant-info-updated";

@Resolver(() => Boolean)
@UseGuards(JwtAuthGuard)
export class MailResolver {

    constructor(
        private readonly mailService: MailService,
    ) { }

    @Mutation(() => Boolean)
    @UseGuards(PermissionsGuard)
    @CheckPermissions([ 'CREATE', 'TEST_EMAIL' ])
    async sendTestEmail(
        @Args("to", { type: () => String }) to: string,
        @Args("subject", { type: () => String }) subject: string,
        @Args("body", { type: () => String }) body: string,
    ) {
        return this.mailService.testEmail({ to, subject, body });
    }

    @Mutation(() => Boolean)
    @UseGuards(PermissionsGuard)
    @CheckPermissions([ 'CREATE', 'TEST_EMAIL' ])
    async passwordChangeEmail(
        @Args("to", { type: () => String }) to: string,
        @Args("userName", { type: () => String }) userName: string,
        @Args("resetLink", { type: () => String }) resetLink: string,
    ) {
        return this.mailService.passwordChange({ to, name: userName, resetLink });
    }


    @Mutation(() => Boolean)
    @UseGuards(PermissionsGuard)
    @CheckPermissions([ 'CREATE', 'TEST_EMAIL' ])
    async resetPasswordRequestEmail(
        @Args("to", { type: () => String }) to: string,
        @Args("userName", { type: () => String }) userName: string,
        @Args("resetLink", { type: () => String }) resetLink: string,
        @Args("token", { type: () => String }) token: string,
    ) {
        return this.mailService.resetPasswordRequest({
            to,
            name: userName,
            resetLink,
            expiration: new Date(Date.now() + 3600000),
            token,
        });
    }

    @Mutation(() => Boolean)
    @UseGuards(PermissionsGuard)
    @CheckPermissions([ 'CREATE', 'TEST_EMAIL' ])
    async userDeactivatedMail(
        @Args("to", { type: () => String }) to: string,
        @Args("name", { type: () => String }) name: string
    ) {
        return this.mailService.userDeactivated({ to, name });
    }

    @Mutation(() => Boolean)
    @UseGuards(PermissionsGuard)
    @CheckPermissions([ 'CREATE', 'TEST_EMAIL' ])
    async userReactivatedMail(
        @Args("to", { type: () => String }) to: string,
        @Args("name", { type: () => String }) name: string,
        @Args("loginLink", { type: () => String }) loginLink: string,
    ) {
        return this.mailService.userEnabled({ to, name, loginLink });
    }

    @Mutation(() => Boolean)
    @UseGuards(PermissionsGuard)
    @CheckPermissions([ 'CREATE', 'TEST_EMAIL' ])
    async onboardTenantEmail(
        @Args("to", { type: () => String }) to: string,
        @Args("name", { type: () => String }) name: string,
        @Args("loginLink", { type: () => String }) loginLink: string,
        @Args("code", { type: () => String }) code: string,
        @Args("company", { type: () => String }) company: string,
        @Args("password", { type: () => String }) password: string,
        @Args("userId", { type: () => String }) userId: string,
    ) {
        return this.mailService.onboardTenant({
            to,
            name,
            code,
            company,
            loginLink,
            password,
            userId,
        });
    }

    @Mutation(() => Boolean)
    @UseGuards(PermissionsGuard)
    @CheckPermissions([ 'CREATE', 'TEST_EMAIL' ])
    async onboardUserEmail(
        @Args("to", { type: () => String }) to: string,
        @Args("name", { type: () => String }) name: string,
        @Args("loginLink", { type: () => String }) loginLink: string,
        @Args("company", { type: () => String }) company: string,
        @Args("password", { type: () => String }) password: string,
        @Args("userId", { type: () => String }) userId: string,
        @Args("isAssociated", { type: () => Boolean }) isAssociated: boolean,
    ) {
        return this.mailService.userOnboard({
            to,
            name,
            company,
            loginLink,
            password,
            userId,
            isAssociated
        });
    }


    @Mutation(() => Boolean)
    @UseGuards(PermissionsGuard)
    @CheckPermissions([ 'CREATE', 'TEST_EMAIL' ])
    async tenantInfoUpdatedMail(@Args("input") input: TenantDataUpdatedInput,) {
        return this.mailService.tenantInformationUpdated(input);
    }

    @Mutation(() => Boolean)
    @UseGuards(PermissionsGuard)
    @CheckPermissions([ 'CREATE', 'TEST_EMAIL' ])
    async genericMail(@Args("input") input: StandarEmailInput,) {
        return this.mailService.genericEmail(input);
    }
}
