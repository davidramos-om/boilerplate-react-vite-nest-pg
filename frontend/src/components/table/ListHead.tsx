import { useEffect, useState } from 'react';
import { Box, Checkbox, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';

import { TableColumn } from "src/components/table/TableColumn";

const visuallyHidden = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: -1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
} as const;


type UserListHeadProps = {
  order: 'asc' | 'desc';
  orderBy: string;
  rowCount: number;
  headLabel: TableColumn[];
  numSelected: number;
  showCheckColumn?: boolean;
  row_style?: React.CSSProperties,
  onRequestSort: (id: string) => void;
  onSelectAllClick: (checked: boolean) => void;
};

export default function ListHead({
  order,
  orderBy,
  rowCount,
  headLabel,
  numSelected,
  showCheckColumn = true,
  row_style = {},
  onRequestSort,
  onSelectAllClick
}: UserListHeadProps) {


  const [ columns, setColumns ] = useState<TableColumn[]>([]);

  useEffect(() => {
    const visibles = headLabel.filter(item => !item.hidden);
    setColumns(visibles);
  }, [ headLabel ]);


  return (
    <TableHead>
      <TableRow style={row_style}>
        {showCheckColumn ?
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                onSelectAllClick(event.target.checked)
              }
            />
          </TableCell>
          : null
        }
        {columns.map((headCell) => (
          <TableCell
            id={`table-cell-header-${headCell.id}`}
            key={headCell.id}
            align={headCell.align || 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={headCell.cell_style}
          >
            <TableSortLabel
              hideSortIcon
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={() => onRequestSort(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box sx={{ ...visuallyHidden }}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
