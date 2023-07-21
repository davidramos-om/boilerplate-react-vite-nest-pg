import { Entity, Column, Index } from "typeorm";

import { SYSTEM_STATUS } from "src/common/enums/status";
import { TenantedBaseEntity } from "./tenanted-base.entity";

@Entity("doc-inspection-points")
@Index([ "code", "deleted" ])
export class InspectionPointsEntity extends TenantedBaseEntity {

    @Column({ type: "varchar", length: 25, nullable: false })
    code: string;

    @Column({ type: "timestamptz" })
    entry_date: Date;

    @Column({ type: "timestamptz" })
    exit_date: Date;

    @Column({ type: "timestamptz" })
    date: Date;

    @Column({ default: false, nullable: false, type: "boolean" })
    loaded: boolean;

    @Column({ type: "varchar", length: 50, nullable: true })
    plate_number: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    driver_name: string;

    @Column({ type: "enum", enum: SYSTEM_STATUS, nullable: false, default: SYSTEM_STATUS.PENDING })
    status: SYSTEM_STATUS;
}
