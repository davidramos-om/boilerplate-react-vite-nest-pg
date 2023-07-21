import { MjmlColumn, MjmlSection } from "@faire/mjml-react";
import { v4 } from 'uuid';

import { MailmanButton } from "./button";
import { MailmanDivider } from "./divider";
import { Greeting } from "./greeting";
import { TextLine } from "./text";
import { MailmanTable } from "./table";

export const MailmanBodyBuilder = (payload: Record<string, any>) => {
  return (
    <MjmlSection backgroundColor="#ffffff">
      <MjmlSection padding={0}>
        <MjmlColumn>
          {payload.fields.map((obj) => {
            return ComponentView(obj);
          })}
        </MjmlColumn>
      </MjmlSection>
    </MjmlSection>
  );
};

const ComponentView = (payload: Record<string, any>) => {

  if (payload.greeting) {
    return <Greeting key={v4()} value={payload.greeting} />;
  }

  if (payload.line) {
    return <TextLine key={v4()} value={payload.line} />;
  }

  if (payload.divider) {
    return <MailmanDivider key={v4()} />;
  }

  if (payload.action) {
    return <MailmanButton key={v4()} value={payload.action} />;
  }

  if (payload.table) {
    return <MailmanTable key={v4()} value={payload.table} />;
  }

  return <></>;
};
