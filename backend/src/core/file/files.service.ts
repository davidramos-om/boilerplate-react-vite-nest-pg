import { Injectable } from "@nestjs/common";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FileUpload } from "graphql-upload-minimal";
import { v4 as Gen_v4, NIL } from "uuid";
import { plainToClass } from "class-transformer";

import config from "src/config";
import { PublicFileEntity } from "src/domain/entities/public/files.entity";
import { convertFileIntoBuffer } from "src/common/files/converter";
import { FileModel } from "src/domain/models/file.model";
import { s3Client } from './s3'

export type FileFolder = "users" | "settings" | 'tenants';

type S3File = {
  dataBuffer: Buffer;
  filename: string;
  folder: FileFolder;
  contentType: string;
  tenantId: string;
}


@Injectable()
export class FilesService {

  constructor(
    @InjectRepository(PublicFileEntity)
    private fileRepo: Repository<PublicFileEntity>,
  ) { }

  private async saveFile({ key, url, tenantId }: { key: string, url: string, tenantId?: string }) {

    const newFile = this.fileRepo.create({
      key,
      url,
      tenant_id: tenantId || NIL
    });

    return this.fileRepo.save(newFile);
  }

  private async deleteFile(key: string): Promise<boolean> {

    const result = await this.fileRepo.delete({ key: key });
    return result.affected > 0;
  }


  async uploadFile(file: FileUpload, folder: FileFolder, tenantId: string): Promise<FileModel> {

    const { buffer, filename, contentType } = await convertFileIntoBuffer(file);

    const p = await this.uploadPublicFile({
      dataBuffer: buffer,
      filename,
      folder,
      contentType,
      tenantId
    });

    return plainToClass(FileModel, p);
  }

  async uploadPublicFile({ dataBuffer, filename, folder, contentType, tenantId }: S3File): Promise<FileModel> {

    const cf = config();
    const bucket = cf.files.aws.bucket;

    const extension = filename.split(".").reverse()[ 0 ];
    const key = `${folder}/${Gen_v4()}.${extension}`;
    const command = new PutObjectCommand({
      Bucket: bucket,
      ACL: "public-read",
      Key: key,
      Body: dataBuffer,
      ContentType: contentType,
    });

    await s3Client.send(command);
    const url = `https://${bucket}.nyc3.cdn.digitaloceanspaces.com/${key}`;
    const p = await this.saveFile({ key, url, tenantId });
    return plainToClass(FileModel, p);
  }

  async deletePublicFile(url: string): Promise<boolean> {

    try {
      if (!url?.includes("amazonaws.com"))
        return false;

      const arr = url.split("/").reverse();
      const name = arr[ 0 ];

      const folder = arr[ 1 ];
      const key = `${folder}/${name}`;
      const cf = config();
      const Bucket = cf.files.aws.bucket;

      const bucketParams = { Bucket: Bucket, Key: key };
      const data = await s3Client.send(new DeleteObjectCommand(bucketParams));
      console.log(` deletePublicFile : `, data);
      this.deleteFile(key);
      return true;
    }
    catch (error) {
      console.log(`🐛 deletePublicFile : `, error);
      return false;
    }
  }
}
