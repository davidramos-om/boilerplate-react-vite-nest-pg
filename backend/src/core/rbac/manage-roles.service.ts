import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository, DataSource, FindOptionsWhere } from "typeorm";
import { plainToClass } from "class-transformer";

import { RoleEntity, RolePermissionEntity, PermissionEntity, TenantEntity } from 'src/domain/entities';
import { RoleModel, PermissionModel } from "src/domain/models/role.model";
import { SessionDto } from "src/domain/dtos/auth";
import { CreateRoleInput, UpdateRoleInput } from "src/domain/dtos/rbac/roles.dto";
import { USER_TYPE } from "src/common/enums/user-type";
import { NIL } from "uuid";
import { ROLE_TYPE } from "src/common/enums/roles";

@Injectable()
export class ManageRoleService {

    constructor(
        @InjectRepository(RoleEntity)
        private readonly roleRepository: Repository<RoleEntity>,

        @InjectRepository(TenantEntity)
        private readonly tenantRepository: Repository<TenantEntity>,

        @InjectRepository(RolePermissionEntity)
        private readonly rolePermissionRepository: Repository<RolePermissionEntity>,

        @InjectRepository(PermissionEntity)
        private readonly permissionRepository: Repository<PermissionEntity>,

        private readonly dataSource: DataSource,
    ) { }


    getFindOptionsWhere(ssn: SessionDto): FindOptionsWhere<RoleEntity> {

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

    async getRoles(ssn: SessionDto): Promise<RoleModel[]> {

        const where = this.getFindOptionsWhere(ssn);
        const roles = await this.roleRepository.find({ where, relations: [ 'tenant' ] });
        return roles.map(role => plainToClass(RoleModel, role));
    }

    async getRoleById(id: string, ssn: SessionDto): Promise<RoleModel> {

        const where = this.getFindOptionsWhere(ssn);
        where.id = id;

        const role = await this.roleRepository.findOne({ where, relations: [ 'tenant' ] });
        const model = plainToClass(RoleModel, role);

        if (role?.id) {
            const rolePermissions = await this.rolePermissionRepository.find({ where: { role: { id: role.id } }, relations: [ 'permission' ] });
            model.permissions = rolePermissions.map(rolePermission => plainToClass(PermissionModel, rolePermission.permission));
        }

        return model;
    }

    async createRole(input: CreateRoleInput, ssn: SessionDto): Promise<RoleModel> {

        if (input.type === ROLE_TYPE.FULL_ACCESS && input.tenant_id && input.tenant_id !== NIL)
            throw new Error("El acceso total no puede ser asignado a un perfil destinado a un cliente corporativo");

        const tenant = input.tenant_id ? await this.tenantRepository.findOne({ where: { id: input.tenant_id } }) : await Promise.resolve(null);
        if (input.tenant_id && !tenant)
            throw new Error("Tenant not found");

        const role = this.roleRepository.create(input);
        role.updated_at = new Date();
        role.updated_by = ssn.userId;
        role.tenant = tenant;

        await this.roleRepository.save(role);

        const permissionIds = input.permissions;
        const permissions = await this.permissionRepository.find({ where: { id: In(permissionIds) } });

        const rolePermissions = permissions.map(permission => {

            const rolePermission = this.rolePermissionRepository.create({
                permission: permission,
                role: role
            });

            return rolePermission;
        });

        await this.rolePermissionRepository.save(rolePermissions);

        const model = plainToClass(RoleModel, role);
        model.permissions = permissions.map(permission => plainToClass(PermissionModel, permission));

        return model;
    }

    async updateRole(input: UpdateRoleInput, ssn: SessionDto): Promise<RoleModel> {

        if (input.type === ROLE_TYPE.FULL_ACCESS && input.tenant_id && input.tenant_id !== NIL)
            throw new Error("El acceso total no puede ser asignado a un perfil destinado a un cliente corporativo");

        const permissionIds = input.permissions;

        const role_promise = this.roleRepository.findOne({ where: { id: input.id } });
        const tenant_promise = input.tenant_id ? this.tenantRepository.findOne({ where: { id: input.tenant_id } }) : Promise.resolve(null);
        const permissions_promise = this.permissionRepository.find({ where: { id: In(permissionIds) } });

        const [ role, tenant, permissions ] = await Promise.all([ role_promise, tenant_promise, permissions_promise ]);

        if (!role)
            throw new Error("Role not found");

        if (input.tenant_id && !tenant)
            throw new Error("Tenant not found");

        //* merge the permissions, if permissions are not in the list, delete them
        const rolePermissions = await this.rolePermissionRepository.find({ where: { role: { id: role.id } }, relations: [ 'permission' ] });
        const rolePermissionIds = rolePermissions.map(rolePermission => rolePermission.permission.id);

        const permissionsToDelete = rolePermissions.filter(rolePermission => !permissionIds.includes(rolePermission.permission.id));
        const permissionsToAdd = permissions.filter(permission => !rolePermissionIds.includes(permission.id));

        await this.rolePermissionRepository.remove(permissionsToDelete);

        const rolePermissionsToAdd = permissionsToAdd.map(permission => {
            const rolePermission = this.rolePermissionRepository.create({
                permission: permission,
                role: role
            });

            return rolePermission;
        });

        this.roleRepository.merge(role, input);
        this.roleRepository.merge(role, { tenant: tenant });
        role.updated_at = new Date();
        role.updated_by = ssn.userId;

        //* Save roles and permissions in a transaction
        const saved = await this.dataSource.transaction(async transactionalEntityManager => {
            const _saved = await transactionalEntityManager.save(role);
            await transactionalEntityManager.save(rolePermissionsToAdd);

            return _saved;
        });


        const model = plainToClass(RoleModel, saved);
        model.permissions = permissions.map(permission => plainToClass(PermissionModel, permission));
        return model;
    }

    async deleteRole(id: string, ssn: SessionDto): Promise<RoleModel> {

        const role = await this.roleRepository.findOne({ where: { id } });

        this.roleRepository.merge(role, {
            deleted: true,
            updated_at: new Date(),
            updated_by: ssn.userId
        });

        await this.roleRepository.save(role);
        return plainToClass(RoleModel, role);
    }
}
