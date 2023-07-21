import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

import { RoleEntity } from 'src/domain/entities';
import { roles } from './data-roles';

@Injectable()
export class SeedRolesService {

    constructor(
        @InjectRepository(RoleEntity)
        private readonly roleRepository: Repository<RoleEntity>,
    ) { }

    async runRolesSeeder(): Promise<number> {

        const existingRoles = await this.roleRepository.find();
        let rolesToCreate: RoleEntity[] = [];

        for (const roleDto of roles) {

            const existingRole = existingRoles.find(r => r.code === roleDto.code);
            if (!existingRole) {

                const role = this.roleRepository.create(roleDto);
                role.updated_at = new Date();
                role.updated_by = 'SYSTEM';
                role.tenant = null;

                rolesToCreate = [ ...rolesToCreate, role ];
            }
        }

        if (rolesToCreate.length > 0)
            await this.roleRepository.save(rolesToCreate);

        return rolesToCreate.length;
    }
}