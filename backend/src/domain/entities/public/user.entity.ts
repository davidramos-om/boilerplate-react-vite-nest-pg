import { Entity, BeforeInsert, Column, BeforeUpdate, Index, Unique, JoinColumn, ManyToOne, Check, OneToMany } from "typeorm";
import { Exclude, Expose } from "class-transformer";

import { generatePassword } from "src/common/security/password-hasher";
import { Slugify } from "src/common/formatters/slug";
import { USER_TYPE } from "src/common/enums/user-type";
import { SYSTEM_STATUS } from "src/common/enums/status";
import { BaseEntity } from "./base.entity";
import { TenantEntity } from "./tenant.entity";
import { UserRoleEntity } from "./roles.entity";

@Entity("users", { schema: "public" })
@Index([ "user_id", "deleted" ])
@Unique([ "user_id", "tenant", "deleted" ])
@Index([ "user_id", "tenant", "deleted" ])
@Check(`("type" = '${USER_TYPE.COMPANY_USER}' AND "tenant_id" IS NOT NULL) OR ("type" = '${USER_TYPE.PORTAL_ROOT}' AND "tenant_id" IS NULL)`)
export class UserEntity extends BaseEntity {

  @BeforeUpdate()
  updateSlug() {
    this.slug = this.custom_slug || Slugify(`${this.name}-${this.user_id}`)
  }

  @BeforeInsert()
  createSlug() {
    this.slug = this.custom_slug || Slugify(`${this.name}-${this.user_id}`)
  }

  @Column({ type: "varchar", length: 200, nullable: true })
  @Expose()
  user_id: string;

  @Column({ type: "varchar", length: 200, nullable: true })
  @Expose()
  first_name: string;

  @Column({ type: "varchar", length: 200, nullable: true })
  @Expose()
  last_name: string;

  @Column({ type: "varchar", length: 400, nullable: false })
  @Expose()
  email: string;

  @Column({ type: "varchar", length: 1400, nullable: false, default: '' })
  @Exclude()
  password: string;

  @Column({ type: "varchar", length: 1000, nullable: true })
  @Expose()
  image_url: string;

  @Column({ type: "enum", enum: USER_TYPE, nullable: false, default: USER_TYPE.COMPANY_USER })
  @Expose()
  type: USER_TYPE;

  @Column({ type: "timestamptz", nullable: true })
  @Exclude()
  pass_link_exp: Date;

  @Column({ type: "varchar", length: 40, nullable: true, default: "" })
  @Exclude()
  pass_token: string;

  @Column({ type: "boolean", nullable: false, default: false })
  @Exclude()
  pass_change_req: boolean;

  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  last_active: Date;

  @Expose()
  @JoinColumn({ name: "tenant_id", referencedColumnName: "id" })
  @ManyToOne(() => TenantEntity, e => e.id, { eager: false, nullable: true })
  tenant: TenantEntity;

  @OneToMany(() => UserRoleEntity, ur => ur.user, { nullable: true, cascade: false, eager: false })
  user_role_details: UserRoleEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await generatePassword(this.user_id, this.password);
  }

  @Column({ type: "enum", enum: SYSTEM_STATUS, nullable: false, default: SYSTEM_STATUS.ACTIVE })
  status: SYSTEM_STATUS;
}
