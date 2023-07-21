import { MjmlImage } from "@faire/mjml-react";

export const MailmanImage = (payload: Record<string, any>) => {
  return (
    <MjmlImage width={300} src={payload.value.src} alt={payload.value.alt} />
  );
};
