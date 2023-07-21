import { Mailman, MailMessage } from "@squareboat/nest-mailman";
import { ComposeMail, EmailRecipient } from "../compose-mail.interface";

export interface UserDeactivatedProps extends EmailRecipient {
    name: string;
}

export class UserDeactivated implements ComposeMail {

    private name: string;

    toMail(): MailMessage {

        const mail = MailMessage.init()
            .greeting(`Hola ${this.name}`)
            .line("Te notificamos que tu cuenta ha sido cerrada.")
            .line("Por favor contacta al administrador de tu cuenta para más información si crees que esto es un error.")
            .subject("Tu cuenta ha sido cerrada");

        return mail;
    }

    async sendMail({ name, to, bcc, cc }: UserDeactivatedProps) {

        try {
            this.name = name;

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
