import { ArgumentsHost, Catch } from "@nestjs/common";
import { GqlExceptionFilter } from "@nestjs/graphql";
import { QueryFailedError } from "typeorm";

@Catch(QueryFailedError)
export class QueryExceptionFilter implements GqlExceptionFilter {

  // @InjectRepository(EntitylogEntity)
  // private logRepo: Repository<EntitylogEntity>

  public catch(exception: any, host: ArgumentsHost) {
    console.error(` exception : `, exception);
    // console.log("QueryExceptionFilter . any", exception?.message);
    // this.logRepo = new Repository<EntitylogEntity>();

    // const gqlHost = GqlArgumentsHost.create(host);
    // console.log("QueryExceptionFilter . any", exception?.message);
    // console.log("QueryExceptionFilter . query :", exception?.query);
    // return exception;
    // this.logRepo = new Repository<EntitylogEntity>();
    // console.log("QueryExceptionFilter . this.logRepo", this.logRepo);
    // const log = this.logRepo.create();
    // log.name = "catch";
    // log.table = "product";
    // log.field = "query";
    // log.old_value = "old error";
    // log.new_value = "new error";

    // this.logRepo.save(log);

    return new Error("Nos disculpamos por las molestias, Encontramos un error en el formato de la consulta, el error ha sido reportado, por favor intente de nuevo.");
  }
}
