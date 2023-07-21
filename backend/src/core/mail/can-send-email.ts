import config from "src/config";

const cf = config();

export class EvaluateEmailOutgoing {

    private readonly allowedDomains = cf.mail.emailDomainOutGoingAllowedList || [];

    emailOutGoingAllowed(email: string) {

        // console.group('email-checkpoint : ');
        // console.log(`  email : `, email);

        if (!cf.mail.sendEmails)
            return false;

        const _env = (cf.ENVIRONMENT || '').toLowerCase();
        if (_env === "production" || _env === "live")
            return true;

        const domain = '@' + email.split("@")[ 1 ];
        const canSend = this.allowedDomains.includes(domain);

        // console.groupEnd();
        return canSend;
    }

    filterOutNotAllowedEmailDomains(emails: string) {

        const emailToCheck = (emails || '').split(",");
        const allowedEmails = emailToCheck.filter(e => this.emailOutGoingAllowed(e));

        return allowedEmails.join(",");
    }
}