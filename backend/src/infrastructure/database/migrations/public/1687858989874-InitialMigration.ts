import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1687858989874 implements MigrationInterface {
    name = 'InitialMigration1687858989874'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "public"."files_uploads" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "key" character varying NOT NULL, "tenant_id" character varying NOT NULL, CONSTRAINT "PK_7bebf5a0c218396dde9ef88a4c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7bebf5a0c218396dde9ef88a4c" ON "public"."files_uploads" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_dbfb340516e6aad98e9e00d5cb" ON "public"."files_uploads" ("key") `);
        await queryRunner.query(`CREATE TABLE "public"."base" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text, "slug" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying(50) DEFAULT '00000000-0000-0000-0000-000000000000', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" character varying(50), "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" character varying(50), "deleted" boolean NOT NULL DEFAULT false, "version" integer NOT NULL, CONSTRAINT "PK_ee39d2f844e458c187af0e5383f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0396f2543cf55b3c1bf44ab057" ON "public"."base" ("slug", "deleted") `);
        await queryRunner.query(`CREATE INDEX "IDX_a9fec312a0084fd0a5abedd994" ON "public"."base" ("id", "deleted") `);
        await queryRunner.query(`CREATE TABLE "tenants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text, "slug" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying(50) DEFAULT '00000000-0000-0000-0000-000000000000', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" character varying(50), "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" character varying(50), "deleted" boolean NOT NULL DEFAULT false, "version" integer NOT NULL, "code" character varying(25) NOT NULL, "description" text DEFAULT '', "contact_name" character varying(100) NOT NULL DEFAULT '', "contact_email" character varying(100) NOT NULL DEFAULT '', "contact_phone" character varying(100) NOT NULL DEFAULT '', "subscription_cost" numeric NOT NULL DEFAULT '0', "additional_cost" numeric NOT NULL DEFAULT '0', "access_enabled" boolean NOT NULL DEFAULT false, "logo_url" character varying(1000), "billing_address" jsonb, "schema_populated" boolean NOT NULL DEFAULT false, "schema_error" text, "last_active" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d549e4ce75d23035ebc5db766c" ON "public"."tenants" ("slug", "deleted") `);
        await queryRunner.query(`CREATE INDEX "IDX_25b7efafaed03a5446394e5b10" ON "public"."tenants" ("id", "deleted") `);
        await queryRunner.query(`CREATE INDEX "IDX_3cb4cfcbd6c6a538ae7e59125f" ON "public"."tenants" ("code", "deleted") `);
        await queryRunner.query(`CREATE TABLE "public"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text, "slug" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying(50) DEFAULT '00000000-0000-0000-0000-000000000000', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" character varying(50), "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" character varying(50), "deleted" boolean NOT NULL DEFAULT false, "version" integer NOT NULL, "user_id" character varying(200), "first_name" character varying(200), "last_name" character varying(200), "email" character varying(400) NOT NULL, "password" character varying(1400) NOT NULL DEFAULT '', "image_url" character varying(1000), "type" "public"."users_type_enum" NOT NULL DEFAULT 'company_user', "role" "public"."users_role_enum" NOT NULL DEFAULT 'none', "pass_link_exp" TIMESTAMP WITH TIME ZONE, "pass_token" character varying(40) DEFAULT '', "pass_change_req" boolean NOT NULL DEFAULT false, "last_active" TIMESTAMP WITH TIME ZONE, "tenant_id" uuid, CONSTRAINT "UQ_3d133fabf51893678a5eb0fb2a8" UNIQUE ("user_id", "tenant_id", "deleted"), CONSTRAINT "CHK_f23dfa3b3c83c05fe97f55c2ba" CHECK (("type" = 'company_user' AND "tenant_id" IS NOT NULL) OR ("type" = 'portal_root' AND "tenant_id" IS NULL)), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_927a1c974f8b2e45b771b80969" ON "public"."users" ("slug", "deleted") `);
        await queryRunner.query(`CREATE INDEX "IDX_20bdde4a61b4df5d0122256e60" ON "public"."users" ("id", "deleted") `);
        await queryRunner.query(`CREATE INDEX "IDX_3d133fabf51893678a5eb0fb2a" ON "public"."users" ("user_id", "tenant_id", "deleted") `);
        await queryRunner.query(`CREATE INDEX "IDX_f570cb4017e882532495bc5a57" ON "public"."users" ("user_id", "deleted") `);
        await queryRunner.query(`CREATE TABLE "public"."sec_roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text, "description" character varying(400), "deleted" boolean NOT NULL DEFAULT false, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" character varying, "tenant_id" uuid, CONSTRAINT "PK_2910a4ced1ae2ddb42241a7136f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public"."sec_permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" text, "action" text, "module" text, "resource" text, "description" text, "group" text, "order" integer DEFAULT '1', CONSTRAINT "UQ_5d3aee1170b530c965cbc4c11f5" UNIQUE ("code"), CONSTRAINT "PK_bcf6cf4cb69d68f6f36b78a67e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5d3aee1170b530c965cbc4c11f" ON "public"."sec_permissions" ("code") `);
        await queryRunner.query(`CREATE TABLE "public"."sec_role_permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role_id" uuid, "permission_id" uuid, CONSTRAINT "PK_0a2baed71ee9418024f4e1cd8ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public"."sec_user_roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role_id" uuid, "user_id" uuid, CONSTRAINT "PK_3999555096f715223195bf57278" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public"."onboarding_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text, "slug" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying(50) DEFAULT '00000000-0000-0000-0000-000000000000', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" character varying(50), "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" character varying(50), "deleted" boolean NOT NULL DEFAULT false, "version" integer NOT NULL, "code" character varying(100) NOT NULL, "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "company" character varying(100) NOT NULL DEFAULT '', "email" character varying(100) NOT NULL, "phone" character varying(100) NOT NULL DEFAULT '', "address" character varying(200) NOT NULL DEFAULT '', "message" text NOT NULL DEFAULT '', "status" "public"."onboarding_requests_status_enum" NOT NULL DEFAULT 'unread', CONSTRAINT "PK_ddddb9f1a805840ae5996d9afaf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_327cf47080eaec9af832f6ed25" ON "public"."onboarding_requests" ("slug", "deleted") `);
        await queryRunner.query(`CREATE INDEX "IDX_dea9abacee01d15824fb9e07d5" ON "public"."onboarding_requests" ("id", "deleted") `);
        await queryRunner.query(`CREATE INDEX "IDX_c25d496c75a08ff63d6aa0ac01" ON "public"."onboarding_requests" ("code", "deleted") `);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD CONSTRAINT "FK_109638590074998bb72a2f2cf08" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."sec_roles" ADD CONSTRAINT "FK_c4bb61d4ba67f46a3184dd083a4" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."sec_role_permissions" ADD CONSTRAINT "FK_0009228be75c2184012d6932927" FOREIGN KEY ("role_id") REFERENCES "sec_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."sec_role_permissions" ADD CONSTRAINT "FK_3e84e52d6d57720cb8dd9f7e355" FOREIGN KEY ("permission_id") REFERENCES "sec_permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."sec_user_roles" ADD CONSTRAINT "FK_4bdf3256ec7d5b63ff875a2930c" FOREIGN KEY ("role_id") REFERENCES "sec_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."sec_user_roles" ADD CONSTRAINT "FK_8934d8a0d6f1714bdd15e8343bb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."sec_user_roles" DROP CONSTRAINT "FK_8934d8a0d6f1714bdd15e8343bb"`);
        await queryRunner.query(`ALTER TABLE "public"."sec_user_roles" DROP CONSTRAINT "FK_4bdf3256ec7d5b63ff875a2930c"`);
        await queryRunner.query(`ALTER TABLE "public"."sec_role_permissions" DROP CONSTRAINT "FK_3e84e52d6d57720cb8dd9f7e355"`);
        await queryRunner.query(`ALTER TABLE "public"."sec_role_permissions" DROP CONSTRAINT "FK_0009228be75c2184012d6932927"`);
        await queryRunner.query(`ALTER TABLE "public"."sec_roles" DROP CONSTRAINT "FK_c4bb61d4ba67f46a3184dd083a4"`);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP CONSTRAINT "FK_109638590074998bb72a2f2cf08"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c25d496c75a08ff63d6aa0ac01"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dea9abacee01d15824fb9e07d5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_327cf47080eaec9af832f6ed25"`);
        await queryRunner.query(`DROP TABLE "public"."onboarding_requests"`);
        await queryRunner.query(`DROP TABLE "public"."sec_user_roles"`);
        await queryRunner.query(`DROP TABLE "public"."sec_role_permissions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5d3aee1170b530c965cbc4c11f"`);
        await queryRunner.query(`DROP TABLE "public"."sec_permissions"`);
        await queryRunner.query(`DROP TABLE "public"."sec_roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f570cb4017e882532495bc5a57"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3d133fabf51893678a5eb0fb2a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_20bdde4a61b4df5d0122256e60"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_927a1c974f8b2e45b771b80969"`);
        await queryRunner.query(`DROP TABLE "public"."users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3cb4cfcbd6c6a538ae7e59125f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_25b7efafaed03a5446394e5b10"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d549e4ce75d23035ebc5db766c"`);
        await queryRunner.query(`DROP TABLE "tenants"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a9fec312a0084fd0a5abedd994"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0396f2543cf55b3c1bf44ab057"`);
        await queryRunner.query(`DROP TABLE "public"."base"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dbfb340516e6aad98e9e00d5cb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7bebf5a0c218396dde9ef88a4c"`);
        await queryRunner.query(`DROP TABLE "public"."files_uploads"`);
    }

}
