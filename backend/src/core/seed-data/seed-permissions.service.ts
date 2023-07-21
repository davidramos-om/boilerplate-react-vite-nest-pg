import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

import { PermissionEntity } from 'src/domain/entities';
import { getPermissions } from './data-permission';

@Injectable()
export class SeedPermissionService {

    constructor(
        @InjectRepository(PermissionEntity)
        private readonly permissionRepository: Repository<PermissionEntity>,
    ) { }

    async runPermissionsSeeder(): Promise<number> {

        const permissions = getPermissions();
        const existingPermissions = await this.permissionRepository.find();
        let rowsToCreate: PermissionEntity[] = [];

        for (const dto of permissions) {

            const existingRow = existingPermissions.find(r => r.code === dto.code);
            if (!existingRow) {

                const newRow = this.permissionRepository.create(dto);
                rowsToCreate = [ ...rowsToCreate, newRow ];
            }
        }

        if (rowsToCreate.length > 0)
            await this.permissionRepository.save(rowsToCreate);

        return rowsToCreate.length;
    }
}