import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRoleEntity1688331961273 implements MigrationInterface {
    name = 'UpdateRoleEntity1688331961273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sec_roles" ADD "code" text`);
        await queryRunner.query(`ALTER TABLE "tenants" ALTER COLUMN "status" SET DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "tenants" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "sec_roles" DROP COLUMN "code"`);
    }

}
