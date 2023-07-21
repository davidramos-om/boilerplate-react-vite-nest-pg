import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

import { RoleEntity, UserEntity, UserRoleEntity } from "@entities/index";
import { AssignRolesToUserInput } from "src/domain/dtos/rbac/roles.dto";

@Injectable()
export class ManageUserRoleService {

    constructor(
        @InjectRepository(RoleEntity)
        private readonly roleRepository: Repository<RoleEntity>,

        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        @InjectRepository(UserRoleEntity)
        private readonly userRoleRepository: Repository<UserRoleEntity>,
    ) { }


    async assignRolesToUser(dto: AssignRolesToUserInput) {

        const { userRowId, roles } = dto;

        const user = await this.userRepository.findOne({ where: { id: userRowId } });
        if (!user)
            throw new Error("User not found");

        const roleIds = roles;
        const roleEntities = await this.roleRepository.find({ where: { id: In(roleIds), deleted: false } });

        //* merge the roles, if roles are not in the list, delete them
        const userRoles = await this.userRoleRepository.find({ where: { user: { id: userRowId }, }, relations: [ 'role' ] });

        const rolesToDelete = userRoles.filter(userRole => !roleIds.includes(userRole.role.id));
        const rolesToAdd = roleEntities.filter(role => !userRoles.map(userRole => userRole.role.id).includes(role.id));

        await this.userRoleRepository.remove(rolesToDelete);

        const userRolesToAdd = rolesToAdd.map(role => {
            const userRole = this.userRoleRepository.create({
                user: user,
                role: role
            });

            return userRole;
        });

        await this.userRoleRepository.save(userRolesToAdd);
    }
}