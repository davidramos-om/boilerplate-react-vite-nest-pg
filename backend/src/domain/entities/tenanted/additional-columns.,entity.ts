import { Column } from "typeorm";

import { TenantedBaseEntity } from "./tenanted-base.entity";

//! Extend additional columns that behave like hidden (in-form)
export abstract class ExtensionColumnsWithTenantEntity extends TenantedBaseEntity {

    @Column({ type: "varchar", length: 200, nullable: true })
    column_1: string;

    @Column({ type: "varchar", length: 200, nullable: true })
    column_2: string;

    @Column({ type: "varchar", length: 200, nullable: true })
    column_3: string;

    @Column({ type: "varchar", length: 200, nullable: true })
    column_4: string;

    @Column({ type: "varchar", length: 200, nullable: true })
    column_5: string;

    @Column({ type: "varchar", length: 200, nullable: true })
    column_6: string;

    @Column({ type: "varchar", length: 200, nullable: true })
    column_7: string;

    @Column({ type: "varchar", length: 200, nullable: true })
    column_8: string;

    @Column({ type: "varchar", length: 200, nullable: true })
    column_9: string;

    @Column({ type: "varchar", length: 200, nullable: true })
    column_10: string;

    @Column({ type: "varchar", length: 200, nullable: true })
    column_11: string;

    @Column({ type: "varchar", length: 200, nullable: true })
    column_12: string;
}