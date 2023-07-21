import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("files_uploads", { schema: "public" })
@Index([ "key" ])
export class PublicFileEntity {

  @Index()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  public url: string;

  @Column()
  public key: string;

  @Column()
  tenant_id: string
}
