import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { PublicFileEntity } from "src/domain/entities/public/files.entity";
import { FilesService } from "./files.service";
import { FileResolver } from "./files.resolver";

@Module({
  imports: [ ConfigModule, TypeOrmModule.forFeature([ PublicFileEntity ]) ],
  providers: [ FileResolver, FilesService ],
  exports: [ FilesService ]
})
export class FilesModule { }
