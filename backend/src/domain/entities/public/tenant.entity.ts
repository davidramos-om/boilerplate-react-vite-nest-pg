import { Entity, BeforeInsert, Column, BeforeUpdate, Index, Unique } from "typeorm";

import { Slugify } from "src/common/formatters/slug";
import { SYSTEM_STATUS } from "src/common/enums/status";
import { AddressModel } from "src/domain/models/address.model";
import { BaseEntity } from "./base.entity";

@Entity("tenants", { schema: "public" })
@Index([ "code", "deleted" ])
@Unique([ "slug", "deleted" ])
export class TenantEntity extends BaseEntity {

    @Column({ type: "varchar", length: 25, nullable: false })
    code: string;

    @Column({ type: "text", nullable: true, default: "" })
    description: string;

    @Column({ type: "varchar", length: 500, default: "" })
    address: string;

    @Column({ type: "varchar", length: 100, default: "" })
    contact_name: string;

    @Column({ type: "varchar", length: 100, default: "" })
    contact_email: string;

    @Column({ type: "varchar", length: 100, default: "" })
    contact_phone: string;

    @Column({ type: "numeric", nullable: false, default: 0 })
    subscription_cost: number;

    @Column({ type: "numeric", nullable: false, default: 0 })
    additional_cost: number;

    @Column({ default: false, nullable: false, type: "boolean" })
    access_enabled: boolean;

    @Column({ type: "varchar", length: 1000, nullable: true })
    logo_url: string;

    @Column({ type: "jsonb", nullable: true, default: null })
    billing_address: AddressModel;

    @Column({ default: false, nullable: false, type: "boolean" })
    schema_populated: boolean

    @Column({ type: "text", nullable: true })
    schema_error: string;

    @Column({ type: "timestamptz", nullable: true })
    last_active: Date;

    @Column({ type: "enum", enum: SYSTEM_STATUS, nullable: false, default: SYSTEM_STATUS.ACTIVE })
    status: SYSTEM_STATUS;

    @BeforeUpdate()
    updateSlug() {
        // var partial = createTemporaryPassCode();
        // this.slug = this.custom_slug || Slugify(`${this.name}-${this.code}-${partial}`)
        this.slug = this.custom_slug || Slugify(this.code)
    }

    @BeforeInsert()
    createSlug() {
        // var partial = createTemporaryPassCode();
        // this.slug = this.custom_slug || Slugify(`${this.name}-${this.code}-${partial}`)
        this.slug = this.custom_slug || Slugify(this.code)
    }

}


