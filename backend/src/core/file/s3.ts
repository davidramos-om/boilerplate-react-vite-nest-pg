import { S3 } from "@aws-sdk/client-s3";
import appConfigFile from 'src/config';

const appConfig = appConfigFile();

const s3Client = new S3({
    forcePathStyle: false, // Configures to use subdomain/virtual calling format.
    endpoint: appConfig.files.aws.endpoint,
    region: appConfig.files.aws.region,
    credentials: {
        accessKeyId: appConfig.files.aws.accessKeyId,
        secretAccessKey: appConfig.files.aws.secretAccessKey
    }
});

export { s3Client };
