import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, VersionColumn, Index } from "typeorm";
import { NIL } from "uuid";

@Entity("base")
@Index([ "id", "deleted" ])
@Index([ "slug", "deleted" ])
export abstract class BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text", nullable: true, unique: false })
  name: string;

  @Column({ type: "text", nullable: true, unique: false })
  slug: string;

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

  custom_slug: string;

  abstract updateSlug(): void
  abstract createSlug(): void

  //Add constructor to set default values
  constructor() {
    this.deleted = false;
    this.updated_at = new Date();
  }
}
