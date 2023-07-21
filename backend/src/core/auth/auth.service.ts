import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NIL } from "uuid";

import { USER_TYPE } from "src/common/enums/user-type";
import { UsersService } from "src/core/users/users.service";
import { UserPrivilegesService } from "src/core/users/user-privileges.service";
import { UserModel } from "src/domain/models/user.model";
import { PermissionModel } from "src/domain/models/role.model";
import { LoginUserInput, LoginStatusDto, SessionDto, UserContextDto, JwtPayloadDto } from "src/domain/dtos/auth";
import { generateSuccinct } from "src/common/security/password-hasher";
import { decodeToken } from "src/common/security/token-helper";
import { CustomException } from "src/common/exceptions/custom.exception";


@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly userPrivilegesService: UserPrivilegesService,
  ) { }

  private getUser(userId: string, tenantId: string): Promise<UserModel> {
    return this.userService.findByUserIdForAuth(userId, tenantId);
  }

  isValidSession(session: SessionDto): boolean {

    if (!session?.accessToken)
      return false;

    const date = new Date(session.exp * 1000);
    if (date < new Date())
      return false

    return true;
  }

  async validateUser(token: string): Promise<UserModel> {

    var info = decodeToken(token);
    if (!info || !info.userId)
      return null;

    const user = await this.getUser(info.userId, info.tenantId);
    return user;
  }

  async getUserContext(userId: string, tenantId: string): Promise<UserContextDto> {

    const user = await this.getUser(userId, tenantId);

    // const userRoles_promise = this.userService.getUserRoles(user.id);
    // const userPrivileges_promise = this.userPrivilegesService.getUserPermissions({
    //   userRowId: user.id,
    //   userType: user.type,
    //   tenantId: user.tenant?.id || ""
    // });

    // const [ userRoles, userPrivileges ] = await Promise.all([ userRoles_promise, userPrivileges_promise ]);
    const { id, name, email, type } = user || {};

    // const roles = userRoles.map(r => ({ id: r.id, name: r.name }));
    // const permissions = userPrivileges.map(p => ({ id: p.id, subject: p.resource, action: p.action }));

    //* Pass only needed params to the guards
    return {
      userRowId: id,
      name,
      email,
      type,
      // roles,
      // permissions,
      tenantId: user.tenant?.id || NIL,
      userId: user.user_id
    };
  }

  private async generatePayload(user: UserModel): Promise<JwtPayloadDto> {

    const { id, user_id, email, image_url, type } = user;

    return {
      email,
      picture: image_url || "",
      tenantId: user.tenant?.id || "",
      tenantLogo: user.tenant?.logo_url || "",
      tenantSlug: user.tenant?.slug || "",
      userRowId: id,
      userId: user_id,
      userType: type,
    }
  }

  private generateLoginStatus(payload: JwtPayloadDto, privileges: PermissionModel[], userRowId: string, token: string, screenName: string): LoginStatusDto {

    const decoded = decodeToken(token);
    const exp = decoded.exp;

    const session: SessionDto = {
      ...payload,
      userRowId,
      screenName,
      accessToken: token,
      exp: exp
    }

    // select distinc p.resource from permissions p
    const uniqueResources = [ ...new Set(privileges.map(p => p.resource)) ];
    const uniqueActions = [ ...new Set(privileges.map(p => p.code)) ];

    return {
      session,
      permissions: {
        menu: uniqueResources,
        actions: uniqueActions,
      }
    };
  }

  async session(userId: string, tenantId: string): Promise<LoginStatusDto> {

    const user = await this.getUser(userId, tenantId);
    if (!user)
      throw new CustomException(null, "Invalid session", true);

    const privileges = await this.userPrivilegesService.getUserPermissions({
      userRowId: user.id,
      tenantId: user.tenant?.id || "",
      userType: user.type
    });

    const payload = await this.generatePayload(user);
    this.userService.updateUserActivity(userId);

    const token = await this.jwtService.signAsync(payload);
    return this.generateLoginStatus(payload, privileges, user.id, token, user.fullName);
  }

  async signIn(input: LoginUserInput): Promise<LoginStatusDto> {
    try {

      const user = await this.getUser(input.userId, input.tenantId);
      if (!user)
        throw new CustomException(null, "Las credenciales son incorrectas, asegurese de estar conectado a la empresa correcta", true);

      const passCombination = generateSuccinct(input.userId, input.password);
      const equals = await this.userService.isValidPassword(user.user_id, passCombination)
      if (!equals)
        throw new CustomException(null, "Las credenciales son incorrectas", true);

      switch (input.domain) {
        case USER_TYPE.COMPANY_USER:
          if (user.type !== USER_TYPE.COMPANY_USER)
            throw new CustomException(null, "Las credenciales son incorrectas para este dominio", true);

          if (!user.tenant?.id)
            throw new CustomException(null, "Las credenciales son incorrectas para este dominio, asegurese de estar conectado a la empresa correcta", true);

          if (user.tenant?.id !== input.tenantId)
            throw new CustomException(null, "Las credenciales son incorrectas para este dominio, asegurese de estar conectado a la empresa correcta", true);
          break;
        case USER_TYPE.PORTAL_ROOT:
          if (user.type !== USER_TYPE.PORTAL_ROOT)
            throw new CustomException(null, "Las credenciales son incorrectas para este dominio", true);

          if (user.tenant?.id) //! If user has a tenant, it means that it is not a root user
            throw new CustomException(null, "Las credenciales son incorrectas para este dominio, asegurese de estar conectado a la empresa correcta", true);

          if (input.tenantId !== NIL)
            throw new CustomException(null, "Las credenciales son incorrectas para este dominio, asegurese de estar conectado a la empresa correcta", true);

          break;
      }

      const privileges = await this.userPrivilegesService.getUserPermissions({
        userRowId: user.id,
        tenantId: user.tenant?.id || "",
        userType: user.type
      });


      const payload = await this.generatePayload(user);
      this.userService.updateUserActivity(payload.userId);

      const token = await this.jwtService.signAsync(payload);

      return this.generateLoginStatus(payload, privileges, user.id, token, user.fullName);
    }
    catch (error) {
      throw new BadRequestException(error, "Failed at login");
    }
  }

  async logout(jwt: string): Promise<Boolean> {
    try {

      if (!jwt)
        return false;

      const decode = decodeToken(jwt);
      if (!decode)
        return false;

      this.userService.updateUserActivity(decode.userId);
      return true;
    }
    catch (error) {
      throw new BadRequestException(error, "Error at logout");
    }
  }
}
