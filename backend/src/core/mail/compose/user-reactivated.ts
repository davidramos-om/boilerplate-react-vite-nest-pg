import { Mailman, MailMessage } from "@squareboat/nest-mailman";
import { ComposeMail, EmailRecipient } from "../compose-mail.interface";

export interface UserReactivatedProps extends EmailRecipient {
    name: string;
    loginLink: string;
}

export class UserReactivated implements ComposeMail {

    private name: string;
    private loginLink: string;

    toMail(): MailMessage {

        const mail = MailMessage.init()
            .greeting(`Hola ${this.name}`)
            .line("Te notificamos que tu cuenta ha sido reactivada.")
            .line("Puedes iniciar sesión con tu cuenta haciendo clic en el botón de abajo.")
            .action("Iniciar sesión", this.loginLink)
            .subject("Tu cuenta ha sido reactivada");

        return mail;
    }

    async sendMail({ name, to, bcc, cc, loginLink }: UserReactivatedProps) {
        try {

            this.name = name;
            this.loginLink = loginLink;


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
