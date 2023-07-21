import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStatusOnEntities1688015815468 implements MigrationInterface {
    name = 'UpdateStatusOnEntities1688015815468'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tenants_status_enum" AS ENUM('active', 'deleted', 'banned', 'draft', 'pending', 'read', 'unread', 'revision', 'suspended', 'rejected', 'processing', 'completed', 'cancelled', 'closed', 'approved')`);
        await queryRunner.query(`ALTER TABLE "tenants" ADD "status" "public"."tenants_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'deleted', 'banned', 'draft', 'pending', 'read', 'unread', 'revision', 'suspended', 'rejected', 'processing', 'completed', 'cancelled', 'closed', 'approved')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "status" "public"."users_status_enum" NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."tenants_status_enum"`);
    }

}
