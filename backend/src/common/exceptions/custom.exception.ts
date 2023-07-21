import { BadRequestException } from "@nestjs/common";

export class CustomException extends BadRequestException {
  constructor(error: any, message: string, handled: boolean) {
    super(
      handled ? null : error,
      handled ? message : "Nos disculpamos por las molestias, estamos trabajando para solucionar el problema lo antes posible."
    );
  }
}
