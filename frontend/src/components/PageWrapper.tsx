import { Container } from "@mui/material";

import Page from 'src/components/Page';
import AlertMessage from 'src/components/AlertMessage';
import CustomBreadcrumbs, { CustomBreadcrumbsProps } from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';


type CustomBreadcrumbsPropsWrapper = Omit<CustomBreadcrumbsProps, 'heading'>;

type Props = {
    children: React.ReactNode;
    title: string;
    error?: string;
    breadCrumbs: CustomBreadcrumbsPropsWrapper;
}

export default function PageWrapper({ children, error, title, breadCrumbs }: Props) {

    const settings = useSettingsContext();

    return (
        <Page title={title}>
            <Container maxWidth={settings.themeStretch ? false : 'xl'}>
                {error && <AlertMessage type="error" message={error} />}
                <CustomBreadcrumbs
                    sx={{ mb: { xs: 3, md: 5 } }}
                    heading={title}
                    {...breadCrumbs}
                />
                {children}
            </Container>
        </Page>
    );
}