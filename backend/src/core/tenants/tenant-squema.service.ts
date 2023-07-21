import { Injectable, Logger } from "@nestjs/common";
import { QueryFailedError, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { getTenantConnection } from 'src/core/tenancy/tenancy.utils';
import { TenantEntity } from "@entities/public/tenant.entity";
import { PgCredentialResult, RunMigrationResult, SchemaResult } from "src/domain/dtos/tenant/create.dto";
import { generateCodeFromUUID, generatePgKey } from "src/common/security/password-hasher";


@Injectable()
export class TenantSchemaService {

    constructor(
        @InjectRepository(TenantEntity)
        private readonly tenantRepository: Repository<TenantEntity>,
    ) { }

    async runMigrations(): Promise<RunMigrationResult[]> {

        const tenants = await this.tenantRepository.find();
        const result: RunMigrationResult[] = new Array<RunMigrationResult>();

        for (const tenant of tenants) {
            try {

                const connection = await getTenantConnection(tenant.id);
                await connection.runMigrations()
                connection.destroy();

                result.push({
                    tenantId: tenant.id,
                    tenantName: tenant.name,
                    success: true,
                    message: 'Migrations run successfully',
                    query: ''
                });
            }
            catch (error) {

                let query = '';
                if (error instanceof QueryFailedError)
                    query = error.query;

                Logger.error(error);
                result.push({
                    tenantId: tenant.id,
                    tenantName: tenant.name,
                    success: false,
                    message: error instanceof Error ? error.message : 'Error running migrations',
                    query
                });
            }
        }

        return result;
    }

    async runMigrationsByTenantId(tenantId: string): Promise<RunMigrationResult> {

        try {

            const connection = await getTenantConnection(tenantId);
            await connection.runMigrations()
            connection.destroy();

            return {
                tenantId: tenantId,
                tenantName: '',
                success: true,
                message: 'Migrations run successfully',
                query: ''
            };
        }
        catch (error) {

            Logger.error(error);

            let query = '';
            if (error instanceof QueryFailedError)
                query = error.query;

            return {
                tenantId: tenantId,
                tenantName: '',
                success: false,
                message: error instanceof Error ? error.message : 'Error running migrations',
                query
            };
        }
    }

    PgCredentialResult(tenantId: string): PgCredentialResult {

        const schemaName = `tenant_${tenantId}`;
        const pgUser = `tnt_${generateCodeFromUUID(tenantId)}`;
        const pgPw = generatePgKey(tenantId, pgUser);

        return {
            password: pgPw,
            username: pgUser,
            squema: schemaName
        };
    }

    async createSquema(tenantId: string): Promise<SchemaResult> {

        try {
            const manager = this.tenantRepository.manager;

            const { squema, username, password } = this.PgCredentialResult(tenantId)

            const sql = `
                CREATE SCHEMA IF NOT EXISTS "${squema}";
                do
                $$
                begin
                    if not exists (select * from pg_user where usename = '${username}') then
                        CREATE USER "${username}" WITH PASSWORD '${password}';
                    end if;
                end;
                $$
                ;
                GRANT ALL PRIVILEGES ON SCHEMA "${squema}" TO "${username}";
                GRANT ALL PRIVILEGES ON SCHEMA "public" TO "${username}";
                grant usage on schema public to "${username}";
                ALTER TABLE base OWNER TO "${username}";
                ;
            `;

            await manager.query(sql);

            const connection = await getTenantConnection(tenantId);
            await connection.runMigrations({ transaction: 'all' });
            connection.destroy();

            return {
                created: true,
                message: 'Schema created successfully'
            }
        }
        catch (error) {
            Logger.error(error);
            return {
                created: false,
                message: error instanceof Error ? error.message : 'Error creating schema'
            }
        }
    }

    async dropSquema(tenantId: string): Promise<SchemaResult> {

        try {

            const manager = this.tenantRepository.manager;
            const { squema, username } = this.PgCredentialResult(tenantId)

            const sql = `
                DROP SCHEMA IF EXISTS "${squema}" CASCADE;
                DROP USER IF EXISTS "${username}";
            `;
            await manager.query(sql);

            return {
                created: true,
                message: 'Schema dropped successfully'
            }
        }
        catch (error) {
            Logger.error(error);
            return {
                created: false,
                message: error instanceof Error ? error.message : 'Error dropping schema'
            }
        }
    }
}