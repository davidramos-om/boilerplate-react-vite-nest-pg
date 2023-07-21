import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTables1688703983162 implements MigrationInterface {
    name = 'UpdateTables1688703983162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."sec_roles_role_type_enum" AS ENUM('FULL_ACCESS', 'CUSTOM')`);
        await queryRunner.query(`ALTER TABLE "sec_roles" ADD "role_type" "public"."sec_roles_role_type_enum" NOT NULL DEFAULT 'CUSTOM'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sec_roles" DROP COLUMN "role_type"`);
        await queryRunner.query(`DROP TYPE "public"."sec_roles_role_type_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('none', 'guest', 'guard', 'supervisor', 'admin', 'root')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'none'`);
    }

}
