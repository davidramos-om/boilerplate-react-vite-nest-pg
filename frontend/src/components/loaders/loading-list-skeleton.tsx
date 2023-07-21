import { Stack, Divider, Skeleton } from '@mui/material';

type Props = {
    columns: number;
    rows: number;
};

export default function LoadingList({ columns = 5, rows = 5 }: Props) {

    const percentage = `${Math.round((100 / columns)).toFixed(2).toLowerCase()}%`;
    const dataRows = Array.from({ length: rows }, (_, i) => i + 1);
    const dataColumns = Array.from({ length: columns }, (_, i) => i + 1);

    return (
        <div>
            <Stack spacing={2} p={2} direction="row" justifyContent="space-around" alignItems="center">
                {dataColumns.map((c) => <Skeleton key={c} variant="rectangular" width={percentage} height={40} />)}
            </Stack>
            <Stack sx={{ pl: 2, pr: 2 }}>
                <Divider />
            </Stack>
            <Stack sx={{ pl: 2, pr: 2 }} justifyContent="space-around" alignItems="center">
                {dataRows.map((r) => <Skeleton key={r} variant="text" width="100%" height={40} />)}
            </Stack>
        </div>
    );
}
