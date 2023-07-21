import { Entity, Column, Index } from "typeorm";

import { TenantedBaseEntity } from "./tenanted-base.entity";


@Entity("table-configurations")
@Index([ "table_name", "deleted" ])
export class TableConfigurationsEntity extends TenantedBaseEntity {

    @Column({ type: "varchar", length: 50, nullable: false })
    table_name: string;

    @Column({ type: "varchar", length: 50, nullable: false })
    table_column: string;

    @Column({ type: "varchar", length: 50, nullable: false })
    column_label: string;

    @Column({ default: false, nullable: false, type: "boolean" })
    hidden: boolean;

    /* 
    text : open text
    textarea : open text multiline
    select : dropdown, single select
    multiselect : dropdown, multiple select
    checkbox : yes/no
    radio: single select
    date : only dates
    time : only time
    datetime : date and time
    */

    @Column({ type: "varchar", length: 50, nullable: false, default: 'text' })
    input_type: 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'date' | 'time' | 'datetime';

    @Column({ type: "text", nullable: false, default: '' })
    input_options: string;
}


