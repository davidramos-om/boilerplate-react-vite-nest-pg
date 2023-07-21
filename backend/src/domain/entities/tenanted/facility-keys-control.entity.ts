import { Entity, Column, Index } from "typeorm";

import { ExtensionColumnsWithTenantEntity } from "./additional-columns.,entity";

//! Control de llaves de instalaciones y unidades

@Entity("doc-facility-keys-control")
@Index([ "code", "deleted" ])
export class FalicityKeysControl extends ExtensionColumnsWithTenantEntity {

    @Column({ type: "varchar", length: 25, nullable: false })
    code: string;

    @Column({ type: "timestamptz" })
    date: Date;

    @Column({ type: "varchar", length: 100, nullable: true })
    key_name: string;

    @Column({ type: "varchar", length: 200, nullable: true })
    location: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    person_in_charge: string;

    @Column({ type: "text", nullable: true })
    signature: string;
}