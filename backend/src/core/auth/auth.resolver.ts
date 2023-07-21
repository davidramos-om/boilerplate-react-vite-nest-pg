import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { plainToClass } from "class-transformer";

import { TenantsService } from "src/core/tenants/tenants.service";
import { JwtAuthGuard } from "src/core/auth/auth.guard";
import { UserModel } from "src/domain/models/user.model";
import { TenantAuthModel } from "src/domain/models/tenant.model";
import { UserSession } from "src/core/authorization/session.decorator";
import { LoginUserInput, LoginStatusDto, SessionDto, ResetPasswordRequestInput, ResetPasswordConfirmInput } from "src/domain/dtos/auth";

import { AuthService } from "./auth.service";
import { AuthPasswordResetService } from "./auth-password.service";

@Resolver()
export class AuthResolver {

  constructor(
    private readonly authService: AuthService,
    private readonly tenantService: TenantsService,
    private readonly passwordResetService: AuthPasswordResetService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Query(() => UserModel, { name: "me", nullable: true })
  me(@UserSession() session: SessionDto): Promise<UserModel> {
    return this.authService.validateUser(session?.accessToken)
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => LoginStatusDto, { name: "session", nullable: true })
  sessionInfo(@UserSession() session: SessionDto): Promise<LoginStatusDto> {
    return this.authService.session(session.userId, session.tenantId);
  }

  @Query(() => TenantAuthModel, { nullable: true })
  async authTenantData(@Args("slug", { type: () => String }) slug: string): Promise<TenantAuthModel> {
    const tenant = await this.tenantService.findBySlugOrId(slug);
    return plainToClass(TenantAuthModel, tenant)
  }

  @Mutation(() => LoginStatusDto, { name: "signIn", nullable: false })
  signIn(@Args("loginUserInput") input: LoginUserInput): Promise<LoginStatusDto> {
    return this.authService.signIn(input)
  }

  @Mutation(() => Boolean, { name: "logout", nullable: true })
  logout(@UserSession() session: SessionDto): Promise<Boolean> {
    return this.authService.logout(session.accessToken);
  }

  @Mutation(() => Boolean)
  forgotPassword(@Args("input") input: ResetPasswordRequestInput): Promise<Boolean> {
    return this.passwordResetService.resetPasswordRequest(input);
  }

  @Mutation(() => Boolean)
  resetPassword(@Args("input") input: ResetPasswordConfirmInput): Promise<Boolean> {
    return this.passwordResetService.confirmPasswordChange(input);
  }
}
