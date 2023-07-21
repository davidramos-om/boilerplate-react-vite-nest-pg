import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

import config from "src/config";
import { JwtPayloadDto, UserContextDto } from "src/domain/dtos/auth";
import { AuthService } from "./auth.service";

const cf = config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cf.JWT_SECRETKEY
    });
  }

  async validate(payload: JwtPayloadDto): Promise<UserContextDto | false> {

    const date = new Date(parseInt(payload[ "exp" ]) * 1000);

    if (date < new Date())
      return false;

    return this.authService.getUserContext(payload.userId, payload.tenantId);
  }
}
