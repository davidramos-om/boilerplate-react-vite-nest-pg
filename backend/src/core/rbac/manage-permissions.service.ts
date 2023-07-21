import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import { PermissionEntity } from 'src/domain/entities';
import { PermissionModel } from "src/domain/models/role.model";

@Injectable()
export class ManagePermissionsService {

    constructor(
        @InjectRepository(PermissionEntity)
        private readonly permissionRepository: Repository<PermissionEntity>,
    ) { }

    async getPermissions(): Promise<PermissionModel[]> {
        const permission = await this.permissionRepository.find({
            order: {
                resource_order: "ASC",
                order: "ASC"
            }
        });

        return permission.map(permission => plainToClass(PermissionModel, permission));
    }
}
