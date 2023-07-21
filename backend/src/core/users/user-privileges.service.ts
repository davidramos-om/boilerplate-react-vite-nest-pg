import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";
import { NIL } from "uuid";

import { SessionDto } from "src/domain/dtos/auth";
import { UserRoleEntity, PermissionEntity } from 'src/domain/entities'
import { PermissionModel } from 'src/domain/models/role.model'
import { USER_TYPE } from "src/common/enums/user-type";
import { ROLE_TYPE } from "src/common/enums/roles";

@Injectable()
export class UserPrivilegesService {
    constructor(
        @InjectRepository(UserRoleEntity)
        private readonly rolesPerUser: Repository<UserRoleEntity>,

        @InjectRepository(PermissionEntity)
        private readonly permissionsRepository: Repository<PermissionEntity>,
    ) { }

    async findAllPermissionsBySession(ssn: SessionDto): Promise<PermissionModel[]> {

        return this.getUserPermissions({
            userRowId: ssn.userRowId,
            userType: ssn.userType,
            tenantId: ssn.tenantId
        });
    }

    async getUserPermissions({ userRowId, userType, tenantId }: { userRowId: string; userType: USER_TYPE; tenantId: string }) {

        // const query = this.permissionsRepository.createQueryBuilder("p")
        //     .innerJoin("sec_role_permissions", "rp", "rp.permission_id = p.id")
        //     .innerJoin("sec_roles", "r", "r.id = rp.role_id")
        //     .innerJoin("sec_user_roles", "ur", "ur.role_id = r.id")
        //     .innerJoin("users", "u", "u.id = ur.user_id")
        //     .where("u.id = :id and u.deleted = false and u.status = 'active'", { id: userRowId });

        //     let tenantCondition = "";
        //     const strQuery = `
        //   select distinct pe.*
        //     from sec_roles r
        //          inner join sec_user_roles rolesPerUser
        //                  on rolesPerUser.role_id = r.id
        //          inner join users u
        //                  on u.id = rolesPerUser.user_id
        //                 and u.status = 'active'
        //                 and u.deleted = false
        //          inner join sec_role_permissions privilegesPerRole
        //                  on case when r.role_type = 'FULL_ACCESS' then
        //                             privilegesPerRole.id = privilegesPerRole.id /*itself to get all*/
        //                          else
        //                             privilegesPerRole.role_id = r.id /*role configuration*/
        //                          end
        //          inner join sec_permissions pe
        //                 on pe.id = privilegesPerRole.permission_id
        //    where 1 = 1
        //      and u.id = $1
        //      and r.deleted = false
        //      $2
        //     `;

        const rolesPerUser = await this.rolesPerUser.find({
            where: {
                user: { id: userRowId },
                role: { deleted: false }
            },
            relations: [ 'role' ]
        });

        const hasFullAccess = rolesPerUser.some(r => r.role.role_type === ROLE_TYPE.FULL_ACCESS);


        let permissions: PermissionEntity[] = [];

        if (hasFullAccess) {
            permissions = await this.permissionsRepository.find();
        }
        else {

            const query = this.permissionsRepository.createQueryBuilder("p")
                .innerJoin("sec_role_permissions", "privilegesPerRole", "privilegesPerRole.permission_id = p.id")
                .innerJoin("sec_roles", "r", "r.id = privilegesPerRole.role_id")
                .innerJoin("sec_user_roles", "rolesPerUser", "rolesPerUser.role_id = r.id")
                .innerJoin("users", "u", "u.id = rolesPerUser.user_id")
                .where("u.id = :id and u.deleted = false and u.status = 'active'", { id: userRowId });

            if (userType === USER_TYPE.COMPANY_USER)
                query.andWhere("u.tenant_id = :tenantId", { tenantId: tenantId || NIL })

            if (userType === USER_TYPE.PORTAL_ROOT)
                query.andWhere("u.tenant_id is null");

            permissions = await query.getMany();
        }

        // const permissions = await query.getMany();

        if (!permissions || permissions.length === 0)
            return [];

        const permissionModels = permissions.map(permission => plainToClass(PermissionModel, permission));
        return permissionModels;
    }
}