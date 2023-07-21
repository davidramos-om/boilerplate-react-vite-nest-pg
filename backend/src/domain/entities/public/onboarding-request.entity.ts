import { Entity, BeforeInsert, Column, BeforeUpdate, Index } from "typeorm";

import { Slugify } from "src/common/formatters/slug";
import { SYSTEM_STATUS } from "src/common/enums/status";
import { BaseEntity } from "./base.entity";

@Entity("onboarding_requests", { schema: "public" })
@Index([ "code", "deleted" ])
export class OnboardingRequestEntity extends BaseEntity {

    @BeforeUpdate()
    updateSlug() {
        this.slug = this.custom_slug || Slugify(`${this.name}`);
    }

    @BeforeInsert()
    createSlug() {
        this.slug = this.custom_slug || Slugify(`${this.name}`);
    }

    @Column({ type: "varchar", length: 100, nullable: false })
    code: string;

    @Column({ type: "varchar", length: 100, nullable: false })
    first_name: string;

    @Column({ type: "varchar", length: 100, nullable: false })
    last_name: string;

    @Column({ type: "varchar", length: 100, nullable: false, default: '' })
    company: string;

    @Column({ type: "varchar", length: 100, nullable: false })
    email: string;

    @Column({ type: "varchar", length: 100, nullable: false, default: '' })
    phone: string;

    @Column({ type: "varchar", length: 200, nullable: false, default: '' })
    address: string;

    @Column({ type: "text", nullable: false, default: '' })
    message: string;

    @Column({ type: "enum", enum: SYSTEM_STATUS, nullable: false, default: SYSTEM_STATUS.UNREAD })
    status: SYSTEM_STATUS;
}
