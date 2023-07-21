import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, In, Not, Repository } from "typeorm";
import { plainToClass } from "class-transformer";
import { validate } from "uuid";

import config from "src/config";
import { UsersService } from "src/core/users/users.service";
import { MailService } from "src/core/mail/mail.service";
import { TenantEntity } from "src/domain/entities";
import { TenantModel } from "src/domain/models/tenant.model";
import { SessionDto } from "src/domain/dtos/auth/session.dto";
import { CreateTenantInput, SchemaResult, UpdateTenantInput } from "src/domain/dtos/tenant/create.dto";
import { CustomException } from "src/common/exceptions/custom.exception";

import { USER_TYPE } from "src/common/enums/user-type";
import { SYSTEM_STATUS } from "src/common/enums/status";

import { TenantSchemaService } from "./tenant-squema.service"

@Injectable()
export class TenantsService {

    private readonly cf = config();

    constructor(
        @InjectRepository(TenantEntity)
        private readonly tenantRepository: Repository<TenantEntity>,
        private readonly tenantSchemaService: TenantSchemaService,
        private readonly usersService: UsersService,
        private readonly emailService: MailService,
    ) { }


    async findAll() {
        const users = await this.tenantRepository.find({ where: { deleted: false } });
        return users.map(user => plainToClass(TenantModel, user));
    }

    async findByRowId(id: string) {
        if (!id)
            return null;

        const user = this.tenantRepository.findOneBy({ id, deleted: false });
        return plainToClass(TenantModel, user);
    }

    async getRowByIdAsEntity(id: string) {
        if (!id)
            return null;

        return this.tenantRepository.findOneBy({ id: id, deleted: false });
    }

    async findByCode(code: string) {
        if (!code)
            return null;

        const tenant = await this.tenantRepository.findOneBy({ code, deleted: false });
        return plainToClass(TenantModel, tenant);
    }

    async findBySlugOrId(slugOrId: string) {
        if (!slugOrId)
            return null;

        let where: FindOptionsWhere<TenantEntity> = {
            slug: slugOrId.toLowerCase(),
            access_enabled: true,
            status: SYSTEM_STATUS.ACTIVE,
            deleted: false,
        };

        if (validate(slugOrId))
            where = { id: slugOrId, deleted: false };


        const tenant = await this.tenantRepository.findOneBy(where);
        return plainToClass(TenantModel, tenant);
    }

    async findByIds(ids: string[], relations: string[] = []) {
        const users = await this.tenantRepository.find({
            where: {
                id: In(ids),
                deleted: false
            },
            relations
        });

        return users.map(user => plainToClass(TenantModel, user));
    }

    async updateAvatar(ssn: SessionDto, tenantId: string, url: string): Promise<Boolean> {

        const result = await this.tenantRepository.update(
            { id: tenantId },
            { logo_url: url, updated_by: ssn.userId, updated_at: new Date() });

        return result.affected > 0;
    }


    async create(input: CreateTenantInput, ssn: SessionDto): Promise<TenantModel> {

        const codeExists = await this.tenantRepository.findOneBy({ code: input.code, deleted: false });
        if (codeExists)
            throw new CustomException(null, "El código de empresa ya existe", true);

        const tenant = this.tenantRepository.create({
            ...input,
            access_enabled: input.access_enabled,
            status: SYSTEM_STATUS.ACTIVE,
            updated_by: ssn.userId,
        });

        const saved = await this.tenantRepository.save(tenant);
        const schemaResult = await this.tenantSchemaService.createSquema(saved.id);

        if (schemaResult.created) {
            saved.schema_populated = true;
            saved.schema_error = null;
            await this.tenantRepository.save(saved);
        }
        else {
            saved.schema_populated = false;
            saved.schema_error = schemaResult.message;
            await this.tenantRepository.save(saved);
            await this.tenantSchemaService.dropSquema(saved.id);
        }

        //* Create user for tenant
        try {
            await this.usersService.createUser({
                email: input.contact_email,
                first_name: input.contact_name,
                last_name: input.contact_name.split(" ")[ 1 ] || "",
                password: input.password,
                image_url: input.logo_url,
                tenant_id: saved.id,
                type: USER_TYPE.COMPANY_USER,
                user_id: input.user_id,
                roles: [],
            }, ssn);

            this.emailService.onboardTenant({
                name: saved.contact_name?.split(" ")[ 0 ] || input.user_id,
                code: saved.code,
                company: saved.name,
                loginLink: this.cf.links.tenantLogin(saved.slug),
                password: input.password,
                to: input.contact_email,
                userId: input.user_id,
            });
        }
        catch (error) {
            Logger.error("Error creating user for tenant " + saved.name, error);
        }


        return plainToClass(TenantModel, saved);
    }

    async update(input: UpdateTenantInput, ssn: SessionDto): Promise<TenantModel> {

        const codeExists = await this.tenantRepository.findOneBy({ id: Not(input.id), code: input.code, deleted: false });
        if (codeExists)
            throw new CustomException(null, "El código de empresa ya está en uso", true);

        const tenant = await this.tenantRepository.findOne({ where: { id: input.id, deleted: false } });
        if (!tenant)
            throw new CustomException(null, "Empresa no encontrada", true);

        let changes: { attribute: string; old: string; new: string; }[] = this.getChanges(tenant, input);

        const updated = this.tenantRepository.merge(tenant, input);
        updated.name = input.name;
        updated.access_enabled = input.access_enabled;
        updated.updated_by = ssn.userId;

        const saved = await this.tenantRepository.save(updated);

        if (changes.length > 0) {
            this.emailService.tenantInformationUpdated({
                to: saved.contact_email,
                name: saved.contact_name?.split(" ")[ 0 ] || "",
                urlChanged: changes.find(c => c.attribute === "Código") ? true : false,
                changes,
                loginLink: this.cf.links.tenantLogin(saved.slug),
            });
        }

        return plainToClass(TenantModel, saved);
    }

    private getChanges(tenant: TenantEntity, input: UpdateTenantInput) {

        const attributes = [
            { field: 'code', label: 'Código' },
            { field: 'name', label: 'Nombre' },
            { field: 'contact_email', label: 'Correo electrónico' },
            { field: 'contact_name', label: 'Nombre de contacto' }
        ];

        const changes = [];

        for (const attribute of attributes) {
            const oldValue = tenant[ attribute.field ];
            const newValue = input[ attribute.field ];

            if (oldValue !== newValue)
                changes.push({ attribute: attribute.label, old: oldValue, new: newValue });
        }

        return changes;
    }

    async createTenantSchema(tenantId: string): Promise<SchemaResult> {

        const tenant = await this.getRowByIdAsEntity(tenantId);
        if (!tenant)
            throw new CustomException(null, "Empresa no encontrada", true);

        const schemaResult = await this.tenantSchemaService.createSquema(tenantId);

        if (schemaResult.created) {
            tenant.schema_populated = true;
            tenant.schema_error = null;
            await this.tenantRepository.save(tenant);
        }

        return schemaResult;
    }
}
