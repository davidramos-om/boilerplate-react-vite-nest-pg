# C - Graph API


## Generate resources

```bash
      nest g module TheName
      nest g co TheName
      nest g service TheName
      nest g res modules/The-Name #Crud scaffolding
```

## Working with migrations
```bash

    # Run for public schema
    npm run migrations:public:generate -name=<NAME-OF-MIGRATION>
    npm run migrations:public:run
    npm run migrations:public:show

    # Run for tenanted schema (Only to create since it will be runned when the tenant is created or during the application startup)
    # REMEMBER TO SET THE SCHEMA NAME IN THE MIGRATION FILE, FOR NAMES, UQ, FK, ETC
    npm run migrations:tenanted:generate -name=<NAME-OF-MIGRATION>
    npm run migrations:tenanted:run
    npm run migrations:tenanted:show

    # empty migration : scope = public or tenanted  
    typeorm migration:<SCOPE>:create src/infrastructure/database/migrations/<SCOPE>/<NAME-OF-MIGRATION>    
```

### Modify migrations for tenant scope
```ts
    // Modify the migration file to include the schema name in the file, for example:

    import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

    export class InitialMigrationX implements MigrationInterface {

        public async up(queryRunner: QueryRunner): Promise<void> {

            const { schema } = queryRunner.connection.options as PostgresConnectionOptions;        
            await queryRunner.query(`CREATE INDEX "IDX_a9fec312a0084fd0a5abedd994" ON   "${schema}"."base" ("id", "deleted") `);
        }

        public async down(queryRunner: QueryRunner): Promise<void> {
        
            const { schema } = queryRunner.connection.options as PostgresConnectionOptions;
            await queryRunner.query(`DROP INDEX "${schema}"."IDX_a9fec312a0084fd0a5abedd994"`);
        }
    }
```


## Run postgresql with docker
```bash
    docker run -itd -e POSTGRES_USER=ndbxxfji -e POSTGRES_PASSWORD=nNss80ZFMDgMNnQMAeu3utbzpMngf43d -p 5432:5432 --name pg-ctpad postgres
```
```
