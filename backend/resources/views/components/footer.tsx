import {
  MjmlColumn,
  MjmlDivider,
  MjmlSection,
  MjmlSocial,
  MjmlSocialElement,
  MjmlSpacer,
  MjmlText,
  MjmlWrapper,
} from "@faire/mjml-react";
import { v4 } from 'uuid';

export const MailmanFooter = (payload: Record<string, any>) => {

  const appName = payload.config.appName;
  const socialMedia = payload.config.socialMedia;
  const contactEmail = payload.config.contactEmail;

  return (
    <>
      <MjmlWrapper className="footer" key={v4()}>
        <MjmlSection padding={0}>
          <MjmlColumn>
            <MjmlSocial
              icon-size="28px"
              mode="horizontal"
              align="center"
              padding="20px"
            >
              {socialMedia?.map((a: any) => (
                <MjmlSocialElement
                  key={v4()}
                  name={a.name}
                  href={a.href}
                  backgroundColor="#DCDCDC"
                  color="darkgrey"
                />
              ))}
            </MjmlSocial>
          </MjmlColumn>
        </MjmlSection>

        <MjmlSection padding={0}>
          <MjmlColumn padding={0}>
            <MjmlDivider borderWidth={1} borderColor="#d1deec" />
          </MjmlColumn>
        </MjmlSection>

        <MjmlSection padding={0}>
          <MjmlColumn>
            {contactEmail && (
              <MjmlText align="center">Contáctenos: {contactEmail}</MjmlText>
            )}

            <MjmlText align="center">
              © {new Date().getFullYear()} {appName}
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
      </MjmlWrapper>
      <MjmlSpacer height={50} />
    </>
  );
};
