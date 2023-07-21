import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEnums1688935330070 implements MigrationInterface {
    name = 'UpdateEnums1688935330070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."tenants_status_enum" RENAME TO "tenants_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."tenants_status_enum" AS ENUM('active', 'inactive', 'disabled', 'blocked', 'deleted', 'banned', 'draft', 'pending', 'read', 'unread', 'revision', 'suspended', 'rejected', 'processing', 'completed', 'cancelled', 'closed', 'approved')`);
        await queryRunner.query(`ALTER TABLE "tenants" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tenants" ALTER COLUMN "status" TYPE "public"."tenants_status_enum" USING "status"::"text"::"public"."tenants_status_enum"`);
        await queryRunner.query(`ALTER TABLE "tenants" ALTER COLUMN "status" SET DEFAULT 'active'`);
        await queryRunner.query(`DROP TYPE "public"."tenants_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."onboarding_requests_status_enum" RENAME TO "onboarding_requests_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."onboarding_requests_status_enum" AS ENUM('active', 'inactive', 'disabled', 'blocked', 'deleted', 'banned', 'draft', 'pending', 'read', 'unread', 'revision', 'suspended', 'rejected', 'processing', 'completed', 'cancelled', 'closed', 'approved')`);
        await queryRunner.query(`ALTER TABLE "onboarding_requests" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "onboarding_requests" ALTER COLUMN "status" TYPE "public"."onboarding_requests_status_enum" USING "status"::"text"::"public"."onboarding_requests_status_enum"`);
        await queryRunner.query(`ALTER TABLE "onboarding_requests" ALTER COLUMN "status" SET DEFAULT 'unread'`);
        await queryRunner.query(`DROP TYPE "public"."onboarding_requests_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."users_status_enum" RENAME TO "users_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'inactive', 'disabled', 'blocked', 'deleted', 'banned', 'draft', 'pending', 'read', 'unread', 'revision', 'suspended', 'rejected', 'processing', 'completed', 'cancelled', 'closed', 'approved')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "status" TYPE "public"."users_status_enum" USING "status"::"text"::"public"."users_status_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'active'`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum_old" AS ENUM('active', 'deleted', 'banned', 'draft', 'pending', 'read', 'unread', 'revision', 'suspended', 'rejected', 'processing', 'completed', 'cancelled', 'closed', 'approved')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "status" TYPE "public"."users_status_enum_old" USING "status"::"text"::"public"."users_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'active'`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."users_status_enum_old" RENAME TO "users_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."onboarding_requests_status_enum_old" AS ENUM('active', 'deleted', 'banned', 'draft', 'pending', 'read', 'unread', 'revision', 'suspended', 'rejected', 'processing', 'completed', 'cancelled', 'closed', 'approved')`);
        await queryRunner.query(`ALTER TABLE "onboarding_requests" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "onboarding_requests" ALTER COLUMN "status" TYPE "public"."onboarding_requests_status_enum_old" USING "status"::"text"::"public"."onboarding_requests_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "onboarding_requests" ALTER COLUMN "status" SET DEFAULT 'unread'`);
        await queryRunner.query(`DROP TYPE "public"."onboarding_requests_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."onboarding_requests_status_enum_old" RENAME TO "onboarding_requests_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."tenants_status_enum_old" AS ENUM('active', 'deleted', 'banned', 'draft', 'pending', 'read', 'unread', 'revision', 'suspended', 'rejected', 'processing', 'completed', 'cancelled', 'closed', 'approved')`);
        await queryRunner.query(`ALTER TABLE "tenants" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tenants" ALTER COLUMN "status" TYPE "public"."tenants_status_enum_old" USING "status"::"text"::"public"."tenants_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "tenants" ALTER COLUMN "status" SET DEFAULT 'active'`);
        await queryRunner.query(`DROP TYPE "public"."tenants_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."tenants_status_enum_old" RENAME TO "tenants_status_enum"`);
    }

}
