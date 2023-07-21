import { registerAs } from "@nestjs/config";
import { ENVIRONMENT } from "./common/enums/enviroments";

function combinePath(root: string, sublink: string) {
  return `${root}${sublink}`;
}

export default registerAs("config", () => {

  const siteUrl = String(process.env.SITE_URL || "https://ctpat-portal.vercel.app");
  const frontendAuthPath = combinePath(siteUrl, '/auth/guest/');

  return {
    ROUND_PRECISION: 2,
    ENVIRONMENT: String(process.env.NODE_ENV || ENVIRONMENT.DEVELOPMENT),
    LOGGER: false,
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 7777,
    HOST: "localhost",
    GEN_DOCS: true,
    JWT_SECRETKEY: String(process.env.JWT_SECRETKEY || "CT-c1k6fT7P8gOlWVKUcrtgj-na-UayfdBxcuZGaFMnZBRBuRbrBB4ofo/net/.fer"),
    JWT_EXPIRES_IN: String(process.env.JWT_EXPIRES_IN || "1w"),
    PG_SCHEMAS_WPSEEDER: String(process.env.PG_SCHEMAS_WPSEEDER || ""),
    SITE_URL: String(process.env.SITE_URL || "https://ctpat-portal.vercel.app"),
    APP_SECRET_KEY: String(process.env.APP_SECRET_KEY || "./Io-78kiw-i2nsk-/.<?/>"),
    links: {
      site_url: siteUrl,
      portalLogin: combinePath(frontendAuthPath, "portal"),
      tenantLogin: (slug: string) => combinePath(frontendAuthPath, "company?slug=" + slug),
      resetpassword: (tenantId: string, token: string, userId: string) => combinePath(frontendAuthPath, `reset-password?tenant=${tenantId}&token=${token}&user=${userId}`),
    },
    mail: {
      sendEmails: process.env.SEND_EMAILS ? Boolean(process.env.SEND_EMAILS) : false,
      emailDomainOutGoingAllowedList: String(process.env.MAIL_DOMAIN_OUTGOING_ALLOWED || "").split(","),
    },
    company: {
      nameforDocs: "NF Inc.",
      nameForEmails: "NF Inc.",
      NameForNotifications: "Portal-CTPAT",
      contact_email: "info@portal-ctpat.com",
      app_name: "Portal CTPAT | Gestión de Documentos",
      logo_url: "https://ctpat-portal.vercel.app/logo/logo_single.png"
    },
    files: {
      aws: {
        endpoint: String(process.env.AWS_ENDPOINT),
        bucket: String(process.env.AWS_BUCKET),
        region: String(process.env.AWS_REGION),
        accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
        secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
      }
    },
    postgres: {
      name: String(process.env.POSTGRES_CNN_NAME),
      host: String(process.env.POSTGRES_HOST),
      port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
      user: String(process.env.POSTGRES_USER),
      password: String(process.env.POSTGRES_PASSWORD),
      database: String(process.env.POSTGRES_DB),
      synchronize: false,
      logging: process.env.POSTGRES_DEBUG_QUERIES ? parseInt(process.env.POSTGRES_DEBUG_QUERIES) : 0
    }
  };
});
