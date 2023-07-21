import { Mailman, MailMessage } from "@squareboat/nest-mailman";

import { NewUserMail } from 'resources/views/mail/onboard-user';
import { ComposeMail, EmailRecipient } from "../compose-mail.interface";

export interface UserOnboardProps extends EmailRecipient {
    name: string;
    isAssociated: boolean;
    loginLink: string;
    company: string;
    userId: string;
    password: string;
}

export class UserOnboard implements ComposeMail {

    private name: string;
    private isAssociated: boolean;
    private loginLink: string;
    private company: string;
    private userId: string;
    private password: string;

    toMail(): MailMessage {

        const mail = MailMessage.init()
            .subject("Nueva cuenta de usuario creada")
            .view(NewUserMail, {
                name: this.name,
                isAssociated: this.isAssociated,
                loginUrl: this.loginLink,
                userId: this.userId,
                password: this.password,
                company: this.company,
            })

        return mail;
    }

    async sendMail({ name, isAssociated, company, userId, password, to, bcc, cc, loginLink }: UserOnboardProps) {

        try {
            this.name = name;
            this.isAssociated = isAssociated;
            this.loginLink = loginLink;
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
