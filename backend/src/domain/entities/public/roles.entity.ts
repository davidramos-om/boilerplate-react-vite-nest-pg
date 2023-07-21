import { Entity, Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Index, UpdateDateColumn } from "typeorm";

import { ROLE_TYPE } from "src/common/enums/roles";
import { TenantEntity } from "./tenant.entity";
import { UserEntity } from "./user.entity";

@Entity("sec_roles", { schema: "public" })
export class RoleEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "text", nullable: true, unique: false })
    code: string;

    @Column({ type: "text", nullable: true, unique: false })
    name: string;

    @Column({ type: "varchar", length: 400, nullable: true })
    description: string;

    @JoinColumn({ name: "tenant_id", referencedColumnName: "id" })
    @ManyToOne(() => TenantEntity, e => e.id, { eager: false, nullable: true })
    tenant: TenantEntity;

    @Column({ default: false, nullable: false, type: "boolean" })
    deleted: boolean;

    @Column({ type: "enum", enum: ROLE_TYPE, nullable: false, default: ROLE_TYPE.CUSTOM })
    role_type: ROLE_TYPE;

    @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    updated_at: Date;

    @Column({ nullable: true })
    updated_by: string;
}

@Entity("sec_permissions", { schema: "public" })
@Index([ "code" ])
export class PermissionEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "text", nullable: true, unique: true })
    code: string;

    @Column({ type: "text", nullable: true, unique: false })
    action: string;

    @Column({ type: "text", nullable: true, unique: false })
    module: string;

    @Column({ type: "text", nullable: true, unique: false })
    resource: string;

    @Column({ type: "text", nullable: true, unique: false })
    name: string;

    @Column({ type: "text", nullable: true, unique: false })
    description: string;

    @Column({ type: "text", nullable: true, unique: false })
    group: string;

    @Column({ type: "integer", nullable: true, unique: false, default: 1 })
    order: number

    @Column({ type: "integer", nullable: true, unique: false, default: 1 })
    resource_order: number
}

@Entity("sec_role_permissions", { schema: "public" })
export class RolePermissionEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @JoinColumn({ name: "role_id", referencedColumnName: "id" })
    @ManyToOne(() => RoleEntity, e => e.id, { eager: false, nullable: true })
    role: RoleEntity;

    @JoinColumn({ name: "permission_id", referencedColumnName: "id" })
    @ManyToOne(() => PermissionEntity, e => e.id, { eager: false, nullable: true })
    permission: PermissionEntity;
}

@Entity("sec_user_roles", { schema: "public" })
export class UserRoleEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @JoinColumn({ name: "role_id", referencedColumnName: "id" })
    @ManyToOne(() => RoleEntity, e => e.id, { eager: false, nullable: true })
    role: RoleEntity;

    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    @ManyToOne(() => UserEntity, e => e.id, { eager: false, nullable: true })
    user: UserEntity;
}
