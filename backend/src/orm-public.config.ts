import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

import appConfigFile from 'src/config';
import { ENVIRONMENT_FILE } from "src/common/enums/enviroments";
import { SnakeNamingStrategy } from "./snake-naming.strategy";

const appConfig = appConfigFile();
const envPath = ENVIRONMENT_FILE[ String(appConfig.ENVIRONMENT).toLowerCase() ];

//* Load enviroment variables
config({ path: envPath, debug: false });
const configService = new ConfigService();

const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: configService.get('POSTGRES_PORT'),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    logging: configService.get('POSTGRES_DEBUG_QUERIES') === 1 ? true : false,
    schema: "public",
    migrationsTableName: "_migrations",
    namingStrategy: new SnakeNamingStrategy(),
    applicationName: "web-portal-ctpat-mxl",
    entities: [ `${__dirname}/domain/entities/public/**/*{entity.js,entity.ts}` ],
    migrations: [ `${__dirname}/infrastructure/database/migrations/public/**/*{.js,.ts}` ],
}

const cnn = new DataSource(dataSourceOptions);

export { dataSourceOptions }
export default cnn;
