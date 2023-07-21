import { NestFactory } from '@nestjs/core';
import { HttpStatus, ValidationPipe } from "@nestjs/common";
import { graphqlUploadExpress } from "graphql-upload-minimal";
import { config } from 'dotenv';
// import { config as AwsConfig } from 'aws-sdk';
import { hostname, version } from 'os';

import { QueryExceptionFilter } from 'src/common/filters/query-exception.filter';
import { ENVIRONMENT_FILE } from 'src/common/enums/enviroments';
import { tenancyMiddleware } from "src/common/middleware/tenancy.middleware";
import { AppModule } from './app.module';
import appConfigFile from './config';

const appConfig = appConfigFile();
const envPath = ENVIRONMENT_FILE[ String(appConfig.ENVIRONMENT).toLowerCase() ];
config({ path: envPath, override: false, debug: false });

async function bootstrap() {

  const app = await NestFactory.create(AppModule, { snapshot: true });

  const isProductionEnv = appConfig.ENVIRONMENT.toLowerCase() === 'production';

  app.use(tenancyMiddleware);
  app.useGlobalFilters(new QueryExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.PRECONDITION_FAILED,
      forbidNonWhitelisted: true,
      skipMissingProperties: true,
      disableErrorMessages: false,
      transformOptions: {
        enableImplicitConversion: false,
      },
      exceptionFactory: (errors) => {
        console.error("PRECONDITION_FAILED.: exceptionFactory", errors);
        return new Error(errors[ 0 ].constraints[ Object.keys(errors[ 0 ].constraints)[ 0 ] ]);
      }
    }),
  );

  //* Upload files up to 5MB
  app.use(graphqlUploadExpress({ maxFileSize: (5 * 1000 * 1000), maxFiles: 10 }));
  // const aws_key = appConfig.files.aws.accessKeyId;
  // const aws_secret = appConfig.files.aws.secretAccessKey;
  // const aws_region = appConfig.files.aws.region;
  // AwsConfig.update({ accessKeyId: aws_key, secretAccessKey: aws_secret, region: aws_region });

  //! Mind the "/" at the end of the url
  const allowlist = [
    'http://127.0.0.1:9998',
    'http://localhost:5555',
    'http://localhost:5555/graphql/',
    'https://ctpat-portal.vercel.app',
    'https://ctpat-portal.vercel.app/graphql',
  ];

  app.enableCors({
    origin: (origin, callback) => {

      if (!origin)
        return callback(null, true);

      const index = allowlist.indexOf(origin);
      if (index !== -1) {
        callback(null, true);
      }
      else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  });

  await app.listen(appConfig.PORT, () => {

    try {

      const result = {
        enviroment: appConfig.ENVIRONMENT,
        hostname: hostname(),
        host: appConfig.HOST,
        port: appConfig.PORT,
        isProduction: isProductionEnv,
        url: `http://${appConfig.HOST}:${appConfig.PORT}/graphql`,
        version: version(),
        ongoingEmails: appConfig.mail.sendEmails,
      };

      console.table(result);
    }
    catch (error) {
      console.log("TCL: bootstrap -> error", error)
    }
  });
}

bootstrap();
