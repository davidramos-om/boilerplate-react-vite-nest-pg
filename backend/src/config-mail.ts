import { registerAs } from "@nestjs/config";
import { MailmanOptions } from "@squareboat/nest-mailman";
import { GenericMail } from "resources/views/mail";

import config from 'src/config';
const cf = config();

export default registerAs(
    "mailman",
    () =>
    ({
        host: process.env.MAIL_HOST,
        port: +process.env.MAIL_PORT,
        username: process.env.MAIL_USERNAME,
        password: process.env.MAIL_PASSWORD,
        from: process.env.MAIL_FROM,
        templateConfig: {
            baseComponent: GenericMail,
            templateOptions: {
                socialMedia: [
                    {
                        name: "linkedin-noshare",
                        href: cf.company.logo_url,
                    },
                    {
                        name: "web-noshare",
                        href: cf.company.logo_url,
                    },
                ],
                appLogoSrc: cf.company.logo_url,
                appName: cf.company.app_name,
                contactEmail: cf.company.contact_email,
            },
        },
    } as MailmanOptions)
);