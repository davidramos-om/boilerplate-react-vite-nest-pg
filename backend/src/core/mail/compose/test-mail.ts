import { Mailman, MailMessage } from "@squareboat/nest-mailman";
import { ComposeMail, EmailContent } from "../compose-mail.interface";

export class TestmailService implements ComposeMail {

    private subject: string;
    private body: string;

    toMail() {
        const mail = MailMessage.init()
            .greeting("Correo de prueba 🧪")
            .line(this.body)
            .subject(this.subject);

        return mail;
    }

    async sendMail({ to, cc, bcc, subject, body }: EmailContent) {

        try {
            this.subject = subject;
            this.body = body;

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

