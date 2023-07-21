import Button from '@mui/material/Button';
import Iconify from "src/components/iconify";
import RouterLink from 'src/routes/router-link';

type Props = {
    href: string;
    label: string;
    icon?: string;
}

export default function NewRecordButton(props: Props) {
    const { href, label, icon = 'mingcute:add-line' } = props
    return (
        <Button
            component={RouterLink}
            href={href}
            variant="contained"
            startIcon={<Iconify icon={icon} />}
        >
            {label}
        </Button>
    );
}