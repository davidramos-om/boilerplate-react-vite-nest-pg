import { UseGuards } from "@nestjs/common";
import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { GraphQLUpload, FileUpload } from "graphql-upload-minimal";

import { JwtAuthGuard } from "src/core/authorization";
import { FileModel } from "src/domain/models/file.model";
import { FileFolder, FilesService } from "./files.service"

@Resolver(() => FileModel)
@UseGuards(JwtAuthGuard)
export class FileResolver {

  constructor(
    private readonly fileServices: FilesService
  ) { }


  @Mutation(() => FileModel, { nullable: false })
  async uploadPublicFile(
    @Args({ name: "file", type: () => GraphQLUpload }) file: FileUpload,
    @Args({ name: "folder", type: () => String }) folder: string,
    @Args({ name: "tenantId", nullable: true, type: () => String }) tenantId: string
  ): Promise<FileModel> {

    if (!folder)
      throw new Error("Folder is required");

    if (!file)
      throw new Error("File is required");

    const _folder = folder as FileFolder;
    if (!_folder)
      throw new Error("Folder is invalid");

    return this.fileServices.uploadFile(file, _folder, tenantId);
  }
}
