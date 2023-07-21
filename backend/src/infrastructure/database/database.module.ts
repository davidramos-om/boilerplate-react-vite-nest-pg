import { Module, Global } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { Client } from "pg";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from '@nestjs/config';

import config from "src/config";

const API_KEY = "1293asdmk";
const API_KEY_PROD = "PRODK920asdmk";

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ ConfigModule ],
            inject: [ config.KEY ],
            useFactory: (configService: ConfigType<typeof config>) => {
                const { user, host, database, password, port, logging } = configService.postgres;
                return {
                    type: "postgres",
                    host,
                    port,
                    username: user,
                    password,
                    database,
                    synchronize: false,
                    autoLoadEntities: true,
                    cache: false,
                    // cache: {
                    //     type: "database",
                    //     tableName: "_query-result-cache"
                    // },
                    logging: logging === 1 ? true : false
                };
            },
        }),
    ],
    providers: [
        {
            provide: "API_KEY",
            useValue: process.env.NODE_ENV === "prod" ? API_KEY_PROD : API_KEY,
        },
        {
            provide: "PG",
            useFactory: (configService: ConfigType<typeof config>) => {
                const { user, host, database, password, port } = configService.postgres;
                const client = new Client({
                    user,
                    host,
                    database,
                    password,
                    port,
                });
                client.connect();
                return client;
            },
            inject: [ config.KEY ],
        },
    ],
    exports: [ "API_KEY", "PG", TypeOrmModule ],
})
export class DatabaseModule { }