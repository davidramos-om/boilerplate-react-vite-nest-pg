import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, VersionColumn, Index } from "typeorm";
import { NIL } from "uuid";

@Entity("base")
@Index([ "id", "deleted" ])
export abstract class TenantedBaseEntity {

  @PrimaryGeneratedColumn("identity")
  id: number;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP", })
  created_at: Date;

  @Column({ type: "varchar", length: 50, nullable: true, default: NIL })
  created_by: string;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;

  @Column({ type: "varchar", length: 50, nullable: true })
  updated_by: string;

  @DeleteDateColumn({ nullable: true, type: "timestamptz" })
  deleted_at: Date;

  @Column({ type: "varchar", length: 50, nullable: true })
  deleted_by: string;

  @Column({ default: false, nullable: false, type: "boolean" })
  deleted: boolean;

  @VersionColumn()
  version: number;

  @Column({ type: "uuid", nullable: true, default: NIL })
  tenant_id: string;
}
