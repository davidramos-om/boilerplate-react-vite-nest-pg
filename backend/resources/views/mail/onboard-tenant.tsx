import { Mjml, MjmlText, MjmlColumn, MjmlSection, MjmlSpacer } from "@faire/mjml-react";

import { MailmanHead } from "../components/head";
import { MailmanHeader } from "../components/header";
import { MailmanBody } from "../components/body";
import { MailmanFooter } from "../components/footer";
import { Greeting } from "../components/greeting";
import { TextLine } from "../components/text";
import { MailmanDivider } from "../components/divider";
import { MailmanButton } from "../components/button";

export const WelcomeOnBoardMail = (payload: Record<string, any>) => {

  return (
    <Mjml>
      <MailmanHead
        title={payload.meta?.title}
        preview={payload.meta?.preview}
      />
      <MailmanBody>
        <>
          <MailmanHeader config={payload._templateConfig} />
          <MjmlSection backgroundColor="#ffffff">
            <MjmlSection padding={0}>
              <MjmlColumn>

                <Greeting value={`Hola ${payload.name}`} />
                <TextLine value="¡Te damos la más cordial bienvenida a nuestra plataforma!" />
                <TextLine value="Estamos emocionados de tenerte como nuevo cliente y esperamos brindarte una excelente experiencia." />
                <TextLine value="A continuación, encontrarás información importante sobre tu cuenta:" />

                <MailmanDivider borderWidth={1} borderColor="#d1deec" />

                <MjmlText fontWeight="bold">
                  Código de cliente:
                </MjmlText>

                <TextLine value={payload.code} />

                <MjmlText fontWeight="bold">
                  Nombre de la empresa:
                </MjmlText>
                <TextLine value={payload.company} />

                <MjmlText fontWeight="bold">
                  Usuario:
                </MjmlText>
                <TextLine value={payload.userId} />

                <MjmlText fontWeight="bold">
                  Contraseña:
                </MjmlText>
                <TextLine value={payload.password} />

                <MailmanDivider borderWidth={1} borderColor="#d1deec" />

                <MjmlSpacer height={25} />
                <TextLine value="En la plataforma, podrás encontrar diferentes características que te permitirán tener una mejor gestión de tus documentos, tales como:" />
                <TextLine value="1. Acceso a su información en cualquier momento y lugar, en tiempo real y desde cualquier dispositivo." />
                <TextLine value="2. Agilidad y eficiencia en el manejo de sus documentos y procesos." />
                <TextLine value="3. Seguridad en el manejo de su información." />
                <TextLine value="4. Gestión de privilegios de acuerdo a los roles de su empresa." />
                <TextLine value="5. Agilidad en la búsqueda de sus bitácoras y generación de reportes." />
                <TextLine value="6. Formatos de auditoría que cumplen con los requerimientos de la certificación C-TPAT" />
                <MjmlText fontWeight="bold" color="#00A76F">
                  * Mas funcionalidades ya listas para ti, y muchas más por venir.
                </MjmlText>
                <MjmlSpacer height={25} />

                <TextLine value="Tu cuenta está activa y lista para ser utilizada, comparte y utiliza el siguiente enlace con tus colaboradores : " />
                <MjmlText
                  fontWeight="bold"
                  color="#078DEE"
                >
                  <a
                    href={payload.loginUrl}
                    target="_blank"
                    style={{
                      color: '#078DEE',
                      textDecoration: 'none',
                      fontWeight: 'bold'
                    }}
                  >
                    {payload.loginUrl}
                  </a>
                </MjmlText>
                <MjmlSpacer height={25} />
                <TextLine value="Para comenzar a utilizar la plataforma, por favor accede al siguiente botón e ingrese las credenciales proporcionadas" />
                <MailmanButton value={{ text: "Iniciar sesión", link: payload.loginUrl }} />

              </MjmlColumn>
            </MjmlSection>
          </MjmlSection>
          <MailmanFooter config={payload._templateConfig} />
        </>
      </MailmanBody>
    </Mjml>
  );
};
