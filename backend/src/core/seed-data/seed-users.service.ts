import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

import { UserEntity } from 'src/domain/entities';
import { users } from './data-users';

@Injectable()
export class SeedUsersService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }

    async runUsersSeeder(): Promise<number> {

        const existingRoles = await this.userRepository.find();
        let usersToCreate: UserEntity[] = [];

        for (const dto of users) {

            const existingRole = existingRoles.find(r => r.user_id === dto.user_id);
            if (!existingRole) {

                const user = this.userRepository.create(dto);
                user.name = `${user.first_name} ${user.last_name}`;
                user.updated_at = new Date();
                user.updated_by = 'SYSTEM';
                user.tenant = null;

                usersToCreate = [ ...usersToCreate, user ];
            }
        }

        if (usersToCreate.length > 0)
            await this.userRepository.save(usersToCreate);

        return usersToCreate.length;
    }
}