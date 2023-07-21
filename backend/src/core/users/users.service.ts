import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Not, Repository, FindOneOptions, FindOptionsWhere } from "typeorm";
import { plainToClass } from "class-transformer";
import { NIL } from "uuid";

import config from "src/config";
import { UserEntity, TenantEntity, UserRoleEntity } from "src/domain/entities";
import { SessionDto } from "src/domain/dtos/auth/session.dto";
import { USER_TYPE } from "src/common/enums/user-type"
import { UserModel, UserRoleModel } from "src/domain/models/user.model";
import { CreateUserInput, ChangeUserPasswordInput, UpdateUserInput } from "src/domain/dtos/auth";
import { comparePassword, generatePassword } from "src/common/security/password-hasher";
import { CustomException } from "src/common/exceptions/custom.exception";
import { TenantModel } from "src/domain/models/tenant.model";
import { SYSTEM_STATUS } from "src/common/enums/status";
import { RoleModel } from "src/domain/models/role.model";
import { MailService } from "src/core/mail/mail.service";
import { ManageUserRoleService } from "src/core/rbac/manage-user-roles.service";

type ValidateUserProps = {
  rowId: string,
  userId: string,
  tenantId: string,
  type: USER_TYPE,
  isNew: boolean
}

interface PasswordRequestTokenInfo {
  userRowId: string;
  token: string;
  expiration: Date;
  changeRequired: boolean;
}

@Injectable()
export class UsersService {

  private readonly cf = config();

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepository: Repository<UserRoleEntity>,

    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,

    private readonly manageUserRoles: ManageUserRoleService,
    private readonly mailService: MailService,
  ) { }

  userTypes() {
    const arr = Object.values(USER_TYPE);
    return arr;
  }

  getFindOptionsWhere(ssn: SessionDto): FindOptionsWhere<UserEntity> {

    if (ssn.userType !== USER_TYPE.PORTAL_ROOT) {
      return {
        deleted: false,
        tenant: { id: ssn.tenantId || NIL }
      };
    }

    return {
      deleted: false
    };
  }

  async findAll(ssn: SessionDto) {

    const where = this.getFindOptionsWhere(ssn);

    const users = await this.userRepository.find({ where, relations: [ 'tenant' ] });
    return users.map(user => plainToClass(UserModel, user));
  }

  async findByEmail(email: string) {
    if (!email)
      return null;

    const user = await this.userRepository.findOne({ where: { email, deleted: false }, relations: [ 'tenant' ] });
    const userModel = plainToClass(UserModel, user);
    userModel.tenant = plainToClass(TenantModel, user.tenant);
    return userModel;
  }

  async findByRowId(id: string, ssn: SessionDto) {
    if (!id)
      return null;

    let where = this.getFindOptionsWhere(ssn);
    where = { ...where, id };

    const user = await this.userRepository.findOne({ where, relations: [ 'tenant', 'user_role_details.role' ] });
    const userModel = plainToClass(UserModel, user);
    userModel.tenant = plainToClass(TenantModel, user.tenant);
    userModel.roles = new Array<UserRoleModel>();

    if (user.user_role_details) {
      userModel.roles = user.user_role_details.filter(ur => ur.role).map((ur) => {
        const roleModel: UserRoleModel = {
          id: ur.id,
          role_id: ur.role.id,
          name: ur.role.name,
        }
        return roleModel;
      });
    }

    return userModel;
  }

  async findByUserIdForAuth(userId: string, tenantId: string): Promise<UserModel> {
    if (!userId)
      return null;

    const conditions: FindOneOptions<UserEntity> = {
      where: {
        user_id: userId,
        deleted: false,
        status: SYSTEM_STATUS.ACTIVE,
        tenant: { id: null }
      },
      relations: [ 'tenant' ]
    };

    if (tenantId && tenantId !== NIL)
      conditions.where = {
        ...conditions.where,
        tenant: {
          id: tenantId,
          deleted: false,
          access_enabled: true,
          status: SYSTEM_STATUS.ACTIVE
        }
      };

    const user = await this.userRepository.findOne(conditions);

    const userModel = plainToClass(UserModel, user);
    if (userModel)
      userModel.tenant = plainToClass(TenantModel, user.tenant);

    return userModel;
  }

  async getPasswordTokenResetInfo(userId: string, tenantId: string): Promise<PasswordRequestTokenInfo> {

    const conditions: FindOneOptions<UserEntity> = {
      where: {
        user_id: userId,
        deleted: false,
        status: SYSTEM_STATUS.ACTIVE,
        tenant: { id: null }
      }
    };

    if (tenantId && tenantId !== NIL) {
      conditions.where = {
        ...conditions.where,
        tenant: {
          id: tenantId,
          deleted: false,
          access_enabled: true,
          status: SYSTEM_STATUS.ACTIVE
        }
      }
    }

    const user = await this.userRepository.findOne(conditions);

    if (!user)
      return null;

    const { pass_token, pass_link_exp, pass_change_req } = user;
    return {
      userRowId: user.id,
      token: pass_token,
      expiration: pass_link_exp,
      changeRequired: pass_change_req
    }
  }

  async getUserRoles(userRowId: string): Promise<RoleModel[]> {

    const roles = await this.userRoleRepository.find({
      where: {
        user: { id: userRowId },
      },
      relations: [ 'role' ]
    });

    const uniqueRoles = roles.map(role => role.role).filter((role, index, self) =>
      index === self.findIndex((t) => (
        t.id === role.id
      ))
    );

    const rolesModel = uniqueRoles.map(role => plainToClass(RoleModel, role));
    return rolesModel;
  }

  // async getUserTenant(userRowId: string) {
  //   if (!userRowId)
  //     return null;

  //   const user = await this.userRepository.findOne({ where: { id: userRowId, deleted: false }, relations: [ 'tenant' ] });
  //   if (!user?.tenant)
  //     return null;

  //   return plainToClass(TenantModel, user.tenant);
  // }

  async isValidPassword(userId: string, clearPasswordtoCompare: string): Promise<boolean> {

    const user = await this.userRepository.findOneBy({ user_id: userId, deleted: false });
    if (!user)
      return false;

    return await comparePassword(user.password, clearPasswordtoCompare);
  }

  async findByIds(ids: string[], relations: string[] = []) {
    const users = await this.userRepository.find({
      where: {
        id: In(ids),
        deleted: false
      },
      relations
    });

    return users.map(user => plainToClass(UserModel, user));
  }

  async updateAvatar(ssn: SessionDto, userId: string, url: string): Promise<Boolean> {

    const result = await this.userRepository.update(
      { id: userId },
      { image_url: url, updated_by: ssn.userId, updated_at: new Date() });

    return result.affected > 0;
  }

  async updateUserActivity(userId: string) {
    try {

      //* this function is also called on the users service
      const result = await this.userRepository.update({ user_id: userId }, { last_active: new Date() });
      return result.affected > 0;
    }
    catch (error) {
      return false;
    }
  }

  private async validateUser(props: ValidateUserProps): Promise<{ user: UserEntity, tenant: TenantEntity }> {

    const { rowId, userId, tenantId, type, isNew } = props;

    const conditions: FindOneOptions<UserEntity> = {
      where: {
        user_id: userId,
        tenant: { id: tenantId || NIL },
        deleted: false
      }
    }

    if (!isNew)
      conditions.where[ "id" ] = rowId

    if (isNew)
      conditions.where[ "id" ] = Not(rowId);

    const user_promise = this.userRepository.findOne(conditions);
    const tenant_promise = this.tenantRepository.findOneBy({ id: tenantId, deleted: false });
    const [ user, tenant ] = await Promise.all([ user_promise, tenant_promise ]);

    if (isNew && user?.id)
      throw new CustomException(null, `Ya existe el nombre de usuario "${userId}" para esta empresa `, true);

    if (!isNew && !user)
      throw new CustomException(null, "No se encontró el usuario", true);

    if (tenantId && !tenant)
      throw new CustomException(null, "No existe la empresa", true);

    if (type === USER_TYPE.COMPANY_USER && !tenantId)
      throw new CustomException(null, "El usuario debe estar asociado a una empresa", true);

    if (type === USER_TYPE.PORTAL_ROOT && tenantId)
      throw new CustomException(null, "El usuario de tipo PortalAdmin no puede estar asociado a una empresa", true);

    return { user, tenant };
  }

  async createUser(input: CreateUserInput, ssn: SessionDto): Promise<UserModel> {

    const { tenant } = await this.validateUser({ rowId: NIL, isNew: true, tenantId: input.tenant_id, type: input.type, userId: input.user_id });

    const newUser = this.userRepository.create({
      ...input,
      user_id: input.user_id,
      email: input.email ? input.email.toLowerCase() : "",
      name: `${input.first_name} ${input.last_name}`,
      tenant: input.type === USER_TYPE.PORTAL_ROOT ? null : { id: input.tenant_id },
      updated_by: ssn.userId,
      status: SYSTEM_STATUS.ACTIVE
    });

    newUser.name = `${input.first_name} ${input.last_name}`;

    const saved = await this.userRepository.save(newUser);

    //* Set user roles
    try {
      if (input.roles?.length > 0) {
        await this.manageUserRoles.assignRolesToUser({
          userRowId: saved.id,
          roles: input.roles,
        });
      }

    }
    catch (error) { }

    if (saved.email) {

      const isTenanted = saved.type === USER_TYPE.COMPANY_USER;
      const loginUrl = isTenanted ? this.cf.links.tenantLogin(tenant.slug) : this.cf.links.portalLogin;

      this.mailService.userOnboard({
        to: saved.email,
        company: tenant?.name,
        isAssociated: input.type === USER_TYPE.COMPANY_USER,
        loginLink: loginUrl,
        name: saved.name.split(' ')[ 0 ],
        password: input.password,
        userId: saved.user_id
      });
    }

    return plainToClass(UserModel, saved);
  }

  async updateUser(input: UpdateUserInput, ssn: SessionDto): Promise<UserModel> {

    const { user, tenant } = await this.validateUser({ rowId: input.id, isNew: false, tenantId: input.tenant_id, type: input.type, userId: input.user_id });

    const updatedUser = this.userRepository.merge(user, input);
    updatedUser.name = `${input.first_name} ${input.last_name}`;

    if (input.type === USER_TYPE.PORTAL_ROOT)
      updatedUser.tenant = null;
    else
      updatedUser.tenant = tenant;

    const result = await this.userRepository.save(updatedUser);

    //* Set user roles
    if (input.roles?.length > 0) {
      await this.manageUserRoles.assignRolesToUser({
        userRowId: updatedUser.id,
        roles: input.roles,
      });
    }

    return plainToClass(UserModel, result);
  }

  async changePasswordParams(input: ChangeUserPasswordInput, ssn: SessionDto): Promise<Boolean> {

    const user = await this.userRepository.findOne({ where: { id: input.userRowId, deleted: false }, relations: [ "tenant" ] });
    if (!user)
      throw new CustomException(null, "No se encontró el usuario", true);

    const password = await generatePassword(user.user_id, input.password);
    const updatedUser = this.userRepository.merge(user, {
      password,
      updated_by: ssn?.userId || NIL,
      updated_at: new Date(),
      pass_token: input.pass_token,
      pass_link_exp: input.pass_link_exp,
      pass_change_req: input.pass_change_req
    });

    await this.userRepository.save(updatedUser);
    if (user.email) {
      this.mailService.passwordChange({
        name: user.first_name,
        to: user.email,
        resetLink: user.type === USER_TYPE.PORTAL_ROOT ? this.cf.links.portalLogin : this.cf.links.tenantLogin(user.tenant.slug)
      })
    }

    return true;
  }

  async setPasswordTokenReset(userRowId: string, token: string, exp: Date,) {

    const user = await this.userRepository.findOne({
      where: { id: userRowId, deleted: false },
      relations: [ "tenant" ]
    });

    if (!user)
      throw new CustomException(null, "No se encontró el usuario", true);

    const updatedUser = this.userRepository.merge(user, {
      pass_token: token,
      pass_link_exp: exp,
      pass_change_req: true
    });

    await this.userRepository.save(updatedUser);

    if (user.email) {
      this.mailService.resetPasswordRequest({
        name: user.first_name,
        to: user.email,
        token: token,
        expiration: exp,
        resetLink: user.type === USER_TYPE.PORTAL_ROOT ? this.cf.links.resetpassword(NIL, token, user.user_id) : this.cf.links.resetpassword(user.tenant.id, token, user.user_id)
      })
    }
  }

  async disableUser(userRowId: string, ssn: SessionDto): Promise<Boolean> {

    const user = await this.userRepository.findOneBy({ id: userRowId, deleted: false });
    if (!user)
      throw new CustomException(null, "No se encontró el usuario", true);

    const updatedUser = this.userRepository.merge(user, {
      status: SYSTEM_STATUS.DISABLED,
      updated_by: ssn.userId,
      updated_at: new Date()
    });

    await this.userRepository.save(updatedUser);

    if (user.email) {
      this.mailService.userDeactivated({
        name: user.first_name,
        to: user.email
      })
    }
    return true;
  }

  async enableUser(userRowId: string, ssn: SessionDto): Promise<Boolean> {

    const user = await this.userRepository.findOneBy({ id: userRowId, deleted: false });
    if (!user)
      throw new CustomException(null, "No se encontró el usuario", true);

    const updatedUser = this.userRepository.merge(user, {
      status: SYSTEM_STATUS.ACTIVE,
      updated_by: ssn.userId,
      updated_at: new Date()
    });

    await this.userRepository.save(updatedUser);

    if (user.email) {
      this.mailService.userEnabled({
        name: user.first_name,
        to: user.email,
        loginLink: user.type === USER_TYPE.PORTAL_ROOT ? this.cf.links.portalLogin : this.cf.links.tenantLogin(user.tenant.id)
      })
    }

    return true;
  }
}
