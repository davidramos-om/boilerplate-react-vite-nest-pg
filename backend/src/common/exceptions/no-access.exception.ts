import { UnauthorizedException } from "@nestjs/common";


export class NoAccessException extends UnauthorizedException {
  constructor() {
    super(null, "Parece que no tiene suficientes permisos para realizar esta acción.");
  }
}
