import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTables1688773355017 implements MigrationInterface {
    name = 'UpdateTables1688773355017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenants" ADD CONSTRAINT "UQ_d549e4ce75d23035ebc5db766ce" UNIQUE ("slug", "deleted")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenants" DROP CONSTRAINT "UQ_d549e4ce75d23035ebc5db766ce"`);
    }

}
