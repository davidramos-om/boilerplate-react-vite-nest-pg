import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRoleEntity1688363958500 implements MigrationInterface {
    name = 'UpdateRoleEntity1688363958500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sec_permissions" ADD "resource_order" integer DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sec_permissions" DROP COLUMN "resource_order"`);
    }

}
