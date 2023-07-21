import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTenantEntity1688776541537 implements MigrationInterface {
    name = 'UpdateTenantEntity1688776541537'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenants" ADD "address" character varying(500) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "address"`);
    }

}
