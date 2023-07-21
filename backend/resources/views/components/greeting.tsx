import { MjmlText } from "@faire/mjml-react";

export const Greeting = (payload: Record<string, any>) => {
  return (
    <MjmlText key={payload.value} paddingTop={5} paddingBottom={5}>
      <h2>{payload.value}</h2>
    </MjmlText>
  );
};
