import { Mjml } from "@faire/mjml-react";

import { MailmanHead } from "../components/head";
import { MailmanHeader } from "../components/header";
import { MailmanBody } from "../components/body";
import { MailmanFooter } from "../components/footer";
import { MailmanBodyBuilder } from "../components/bodyBuilder";

export const GenericMail = (payload: Record<string, any>) => {
  return (
    <Mjml>
      <MailmanHead
        title={payload.meta?.title}
        preview={payload.meta?.preview}
      />

      <MailmanBody>
        <>
          <MailmanHeader config={payload._templateConfig} />
          <MailmanBodyBuilder
            config={payload._templateConfig}
            fields={payload.genericFields}
          />
          <MailmanFooter config={payload._templateConfig} />
        </>
      </MailmanBody>
    </Mjml>
  );
};
