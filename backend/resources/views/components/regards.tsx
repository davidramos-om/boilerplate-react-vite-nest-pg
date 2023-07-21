import { MjmlColumn, MjmlSection, MjmlText } from "@faire/mjml-react";

export const MailmanRegards = (payload: Record<string, any>) => {
  return (
    <MjmlSection padding={0}>
      <MjmlColumn>
        <MjmlText>
          Si necesita ayuda o asistencia, no dude en ponerse en contacto con nosotros al{" "}
          <strong>soporte@portal-ctpat.com</strong>
        </MjmlText>

        <MjmlText lineHeight={40} fontSize={15} padding={"5px 20px"}>
          Gracias,
        </MjmlText>

        <MjmlText fontSize={15} padding={"0px 20px"}>
          Equipo de soporte
        </MjmlText>
      </MjmlColumn>
    </MjmlSection>
  );
};
