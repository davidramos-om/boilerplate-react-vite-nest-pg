import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export class InitialMigration1687859091126 implements MigrationInterface {
    name = 'InitialMigration1687859091126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;
        await queryRunner.query(`CREATE TABLE "${schema}"."base" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying(50) DEFAULT '00000000-0000-0000-0000-000000000000', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" character varying(50), "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" character varying(50), "deleted" boolean NOT NULL DEFAULT false, "version" integer NOT NULL, CONSTRAINT "PK_${schema}_ee39d2f844e458c187af0e5383f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a9fec312a0084fd0a5abedd994" ON   "${schema}"."base" ("id", "deleted") `);
        await queryRunner.query(`CREATE TYPE "${schema}"."inspection-points_status_enum" AS ENUM('active', 'deleted', 'banned', 'draft', 'pending', 'read', 'unread', 'revision', 'suspended', 'rejected', 'processing', 'completed', 'cancelled', 'closed', 'approved')`);
        await queryRunner.query(`CREATE TABLE "${schema}"."inspection-points" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying(50) DEFAULT '00000000-0000-0000-0000-000000000000', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" character varying(50), "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" character varying(50), "deleted" boolean NOT NULL DEFAULT false, "version" integer NOT NULL, "code" character varying(25) NOT NULL, "entry_date" TIMESTAMP WITH TIME ZONE NOT NULL, "exit_date" TIMESTAMP WITH TIME ZONE NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL, "loaded" boolean NOT NULL DEFAULT false, "plate_number" character varying(50), "driver_name" character varying(50), "status" "public"."inspection-points_status_enum" NOT NULL DEFAULT 'pending', CONSTRAINT "PK_${schema}_eb7d2fa5fc4a08c43284594780f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a9a1f72a065c9b9c77b52928ab" ON  "${schema}"."inspection-points" ("id", "deleted") `);
        await queryRunner.query(`CREATE INDEX "IDX_dc5e4df7ec55c2395268ba83c3" ON  "${schema}"."inspection-points" ("code", "deleted") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;
        await queryRunner.query(`DROP INDEX "${schema}"."IDX_dc5e4df7ec55c2395268ba83c3"`);
        await queryRunner.query(`DROP INDEX "${schema}"."IDX_a9a1f72a065c9b9c77b52928ab"`);
        await queryRunner.query(`DROP TABLE "${schema}"."inspection-points"`);
        await queryRunner.query(`DROP TYPE "${schema}"."inspection-points_status_enum"`);
        await queryRunner.query(`DROP INDEX "${schema}"."IDX_a9fec312a0084fd0a5abedd994"`);
        await queryRunner.query(`DROP TABLE "${schema}"."base"`);
    }

}
