import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRoleEntity1688338726029 implements MigrationInterface {
    name = 'UpdateRoleEntity1688338726029'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sec_permissions" ADD "name" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sec_permissions" DROP COLUMN "name"`);
    }

}
