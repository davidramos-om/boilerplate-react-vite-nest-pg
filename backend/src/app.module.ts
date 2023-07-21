import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLFormattedError } from 'graphql';
import * as Joi from 'joi';
import { ConfigService } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MailmanModule } from "@squareboat/nest-mailman";

import { DatabaseModule } from "src/infrastructure/database/database.module";
import { TenancyModule } from "src/core/tenancy/tenancy.module"
import { AuthModule } from "src/core/auth/auth.module"
import { UsersPrivilegesServiceModule } from 'src/core/users/user-privileges.module';
import { AuthorizationModule } from 'src/core/authorization/authorization.module';
import { PublicDataSelectorsModule } from 'src/core/public/public-selectors.module';

import { ManageRBACModule } from "src/core/rbac/manage-rbac.module";
import { UsersModule } from "src/core/users/users.module";
import { TenantsModule } from "src/core/tenants/tenants.module";
import { FilesModule } from "src/core/file/files.module";
import { OnboardingRequestModule } from "src/core/onboarding/onboarding.module";
import { SeedDataModule } from "src/core/seed-data/seed.module";
import { MailModule } from "src/core/mail/mail.module";

import { ENVIRONMENT_FILE } from 'src/common/enums/enviroments';
import configuration from 'src/config';
import mail_configuration from 'src/config-mail';

const cf = configuration();

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: true,
      sortSchema: true,
      csrfPrevention: true,
      context: ({ req }) => ({ req }),
      formatError: (formatedError: GraphQLFormattedError) => {
        Logger.error(formatedError.message, 'GraphQLModule');
        return formatedError;
      },
    }),
    ConfigModule.forRoot({
      envFilePath: [ ENVIRONMENT_FILE[ String(cf.ENVIRONMENT).toLowerCase() ] ],
      load: [ configuration, mail_configuration ],
      isGlobal: true,
      cache: false,
      expandVariables: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        SITE_URL: Joi.string().uri().required(),
        POSTGRES_CNN_NAME: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),

        JWT_SECRETKEY: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().required(),
        APP_SECRET_KEY: Joi.string().required(),
        PG_SCHEMAS_WPSEEDER: Joi.string().required(),

        AWS_REGION: Joi.string().required(),
        AWS_BUCKET: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),

        SEND_EMAILS: Joi.boolean().required(),
        MAIL_HOST: Joi.string().required(),
        MAIL_PORT: Joi.number().required(),
        MAIL_USERNAME: Joi.string().required(),
        MAIL_PASSWORD: Joi.string().required(),
        MAIL_FROM: Joi.string().required(),
        MAIL_DOMAIN_OUTGOING_ALLOWED: Joi.string().required(),
      }),
    }),
    MailmanModule.registerAsync({
      imports: [ ConfigService ],
      useFactory: (config: ConfigService) => {
        const cfMail = config.get("mailman");
        return cfMail;
      },
      inject: [ ConfigService ],
    }),
    DatabaseModule,
    MailModule,
    TenancyModule,
    SeedDataModule,
    AuthModule,
    PublicDataSelectorsModule,
    UsersPrivilegesServiceModule,
    AuthorizationModule,
    FilesModule,
    ManageRBACModule,

    UsersModule,
    TenantsModule,
    OnboardingRequestModule,

  ],
  controllers: [],
  providers: [],
})

export class AppModule { }
