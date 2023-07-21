import { Mailman, MailMessage } from "@squareboat/nest-mailman";
import { ComposeMail, EmailRecipient } from "../compose-mail.interface";

export interface PasswordChangedEmailProps extends EmailRecipient {
    name: string;
    resetLink: string;
}

export class PasswordChangedEmail implements ComposeMail {

    private name: string;
    private resetLink: string;

    toMail(): MailMessage {

        const mail = MailMessage.init()
            .greeting(`Hola ${this.name}`)
            .line("Te notificamos que tu contraseña ha sido cambiada.")
            .line("Si no haz realizado este cambio o no haz solicitado un cambio de contraseña, comunicate con el administrador de tu cuenta.")
            .line("Adicionalmente puedes elegir la opción de restablecer la contraseña en la página de inicio de sesión.")
            .action("Iniciar sesión", this.resetLink)
            .subject("Información importante sobre tu cuenta");

        return mail;
    }

    async sendMail({ name, to, bcc, cc, resetLink }: PasswordChangedEmailProps) {

        try {
            this.name = name;
            this.resetLink = resetLink;

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
