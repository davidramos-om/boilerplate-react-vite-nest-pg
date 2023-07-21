import { Mailman, MailMessage } from "@squareboat/nest-mailman";

import { LuxonService } from 'src/common/formatters/dates';
import { ComposeMail, EmailRecipient } from "../compose-mail.interface";

export interface ResetPasswordRequestProps extends EmailRecipient {
    name: string;
    resetLink: string;
    expiration: Date;
    token: string;
}

export class ResetPasswordRequest implements ComposeMail {

    private name: string;
    private resetLink: string;
    private expiration: Date;
    private token: string;

    toMail(): MailMessage {

        const formatDate = LuxonService.dateFormatToString(this.expiration, "es", "dd 'de' MMMM 'de' yyyy");
        const formatTime = LuxonService.dateFormatToString(this.expiration, "es", "hh:mm a");

        const mail = MailMessage.init()
            .greeting(`Hola ${this.name}`)
            .line("Una solicitud para restablecer la contraseña de su cuenta ha sido recibida.")
            .line(`Esta solicitud expirará  el ${formatDate} a las ${formatTime}.`)
            .line("El código de reinicio es: " + this.token)
            .action("Reiniciar contraseña", this.resetLink)
            .line("Si el botón no funciona, copie y pegue el siguiente enlace en su navegador.")
            .line(this.resetLink)
            .line("Si no ha realizado esta solicitud, puede ignorar este correo electrónico y la solicitud se cancelará automáticamente.")
            .subject("Información importante sobre tu cuenta");

        return mail;
    }

    async sendMail({ name, to, bcc, cc, expiration, resetLink, token }: ResetPasswordRequestProps) {

        try {
            this.name = name;
            this.resetLink = resetLink;
            this.expiration = expiration;
            this.token = token;

            const mm = Mailman.init();
            mm.to(to);

            if (cc) mm.cc(cc);
            if (bcc) mm.bcc(bcc);

            await mm.send(this.toMail());
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
