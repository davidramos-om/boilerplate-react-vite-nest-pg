import {
  MjmlColumn,
  MjmlImage,
  MjmlSection,
  MjmlSpacer,
} from "@faire/mjml-react";

export const MailmanHeader = (payload: Record<string, any>) => {

  const appLogoSrc = payload.config.appLogoSrc;
  const appName = payload.config.appName;

  return (
    <>
      <MjmlSection>
        <MjmlColumn>
          <MjmlSpacer height={10} />
        </MjmlColumn>
      </MjmlSection>

      <MjmlSection className="header">
        <MjmlColumn>
          <MjmlImage
            src={appLogoSrc}
            alt={appName}
            align="center"
            width={200}
            padding={0}
          />
        </MjmlColumn>
      </MjmlSection>
    </>
  );
};
