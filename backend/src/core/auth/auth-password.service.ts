import { Injectable } from "@nestjs/common";

import { UsersService } from "src/core/users/users.service";
import { UserModel } from "src/domain/models/user.model";
import { ResetPasswordRequestInput, ResetPasswordConfirmInput } from "src/domain/dtos/auth";
import { createTemporaryPassCode } from "src/common/security/password-hasher";
import { CustomException } from "src/common/exceptions/custom.exception";


@Injectable()
export class AuthPasswordResetService {

    constructor(
        private readonly userService: UsersService
    ) { }

    private getUser(userId: string, tenantId: string): Promise<UserModel> {
        return this.userService.findByUserIdForAuth(userId, tenantId);
    }

    validateUser(user: UserModel) {

        if (!user)
            throw new CustomException(null, "Usuario no encontrado, verifique que el usuario y la empresa/dominio sean correctos", true);

        if (!user.email)
            throw new CustomException(null, "El usuario no tiene un correo electrónico asociado, por favor contacte a su administrador para que le asigne una contraseña", true);

        return true;
    }

    async resetPasswordRequest(input: ResetPasswordRequestInput): Promise<boolean> {

        const user = await this.getUser(input.userId, input.tenantId);
        this.validateUser(user);

        const token = createTemporaryPassCode().toUpperCase();
        const tokenWithHiphen = token.slice(0, 4) + "-" + token.slice(4);

        //* 1 day after today
        const exp = new Date();
        exp.setMinutes(exp.getMinutes() + 30);

        await this.userService.setPasswordTokenReset(user.id, tokenWithHiphen, exp);
        return true;
    }

    async confirmPasswordChange(input: ResetPasswordConfirmInput): Promise<boolean> {

        const { userId, tenantId, token, newPassword } = input;
        const tokenInfo = await this.userService.getPasswordTokenResetInfo(userId, tenantId);

        const msg = "Parte de la información para cambiar la contraseña no es válida o ha expirado, por favor solicite un nuevo cambio de contraseña";
        if (!tokenInfo || !tokenInfo.token)
            throw new CustomException(null, msg, true);

        if (tokenInfo.token != token)
            throw new CustomException(null, msg, true);

        if (tokenInfo.expiration && tokenInfo.expiration < new Date())
            throw new CustomException(null, msg, true);

        this.userService.changePasswordParams({
            userRowId: tokenInfo.userRowId,
            password: newPassword,
            pass_token: null,
            pass_change_req: false,
            pass_link_exp: null,
        },
            null
        );

        return true;
    }
}
