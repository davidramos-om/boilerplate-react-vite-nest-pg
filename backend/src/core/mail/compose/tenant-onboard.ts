import { Mailman, MailMessage } from "@squareboat/nest-mailman";

import { WelcomeOnBoardMail } from 'resources/views/mail/onboard-tenant';
import { ComposeMail, EmailRecipient } from "../compose-mail.interface";

export interface TenantOnboardProps extends EmailRecipient {
    name: string;
    loginLink: string;
    code: string;
    company: string;
    userId: string;
    password: string;
}

export class TenantOnboard implements ComposeMail {

    private name: string;
    private loginLink: string;
    private code: string;
    private company: string;
    private userId: string;
    private password: string;

    toMail(): MailMessage {

        const mail = MailMessage.init()
            .subject("Bienvenido a Bordo")
            .meta({ title: "Bienvenido a Bordo" })
            .view(WelcomeOnBoardMail, {
                name: this.name,
                loginUrl: this.loginLink,
                userId: this.userId,
                password: this.password,
                company: this.company,
                code: this.code
            })

        return mail;
    }

    async sendMail({ name, code, company, userId, password, to, bcc, cc, loginLink }: TenantOnboardProps) {

        try {
            this.name = name;
            this.loginLink = loginLink;
            this.code = code;
            this.company = company;
            this.userId = userId;
            this.password = password;

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
