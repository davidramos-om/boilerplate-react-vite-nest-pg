import { SxProps } from '@mui/material';
import { Theme } from '@mui/material/styles';

import { TotalizeType } from 'src/types/totalizer';
import { LabelColor } from 'src/components/label';

export type TableColumn = {
    type: 'text' | 'link' | 'number' | 'picture' | 'status' | 'app_status' | 'boolean' | 'menu' | 'datetime' | 'uuid';
    pictureVariant?: 'circular' | 'rounded' | 'square';
    pictureAsLink?: boolean;
    id: string;
    label: string;
    align: "center" | "inherit" | "left" | "right" | "justify" | undefined;
    pictureFieldName?: string;
    hidden?: boolean;
    cell_style?: React.CSSProperties;
    clickableLink?: (row: any) => string;
    onInteractiveClick?: (row: any) => void;
    renderCell?: (event: RenderCellEvent) => React.ReactNode;
    getStatusColor?: (status: any) => LabelColor;
    totalizable?: boolean;
    totalizeType?: TotalizeType;
    totalizeFormat?: string;
    dateFormat?: string;
    sx?: SxProps<Theme>;
};

export type RenderCellEvent = {
    theme: Theme,
    row: any;
    column: string;
}
