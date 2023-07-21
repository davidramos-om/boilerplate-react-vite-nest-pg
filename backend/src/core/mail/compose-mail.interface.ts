import { MailMessage } from "@squareboat/nest-mailman";

export interface EmailRecipient {
    to: string;
    cc?: string;
    bcc?: string;
}

export interface EmailContent extends EmailRecipient {
    subject: string;
    body: string;
}

export interface ComposeMail {
    toMail(): MailMessage;
    sendMail(recipients: EmailRecipient): Promise<boolean>;

}
