import { Mjml, MjmlText, MjmlColumn, MjmlSection, MjmlSpacer } from "@faire/mjml-react";

import { MailmanHead } from "../components/head";
import { MailmanHeader } from "../components/header";
import { MailmanBody } from "../components/body";
import { MailmanFooter } from "../components/footer";
import { Greeting } from "../components/greeting";
import { TextLine } from "../components/text";
import { MailmanDivider } from "../components/divider";
import { MailmanButton } from "../components/button";

export const NewUserMail = (payload: Record<string, any>) => {

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
                                <TextLine value="Hemos creado un usuario para nuestra en la plataforma" />

                                {payload.isAssociated && (
                                    <>
                                        <MjmlText fontWeight="bold">
                                            El usuario esta asociado a la empresa :
                                        </MjmlText>
                                        <TextLine value={payload.company} />
                                    </>
                                )}

                                <MjmlSpacer height={25} />
                                <TextLine value="Información importante sobre tu cuenta:" />
                                <MailmanDivider borderWidth={1} borderColor="#d1deec" />

                                <MjmlText fontWeight="bold">
                                    Nombre de usuario:
                                </MjmlText>
                                <TextLine value={payload.userId} />

                                <MjmlText fontWeight="bold">
                                    Contraseña temporal:
                                </MjmlText>
                                <TextLine value={payload.password} />


                                <MailmanDivider borderWidth={1} borderColor="#d1deec" />

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
