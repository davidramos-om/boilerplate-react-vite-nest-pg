import { useEffect, useState } from 'react';
import { matchSorter } from 'match-sorter'
import { Link as RouterLink } from 'react-router-dom';
import { Link, Divider, Card, Table, Stack, Checkbox, TableRow, TableBody, TableCell, Typography, TableContainer, TablePagination, Tooltip, OutlinedInput, InputAdornment, Box } from '@mui/material';
import { Icon } from '@iconify/react';
import { useTheme, styled } from '@mui/material/styles';

import { sentenceCase, shortenUuid } from 'src/utils/format-text';
import { totalizeRow, fPercent, fNumberFloat, fNumber } from 'src/utils/format-number';
import { dateTimeFormat } from "src/utils/format-time";
import { applySortFilter, getComparator } from 'src/utils/sort'

import LoadingList from 'src/components/loaders/loading-list-skeleton';
import Image from 'src/components/image'
import Scrollbar from 'src/components/scrollbar';
import Label from 'src/components/label';
import SearchNotFound from 'src/components/search/search-not-found';

import ListHead from './ListHead';
import MoreMenu, { MoreMenuOption, RouteParams } from './MoreMenu';
import { TableColumn } from './TableColumn';

export type { TableColumn };


type PageInfo = {
  mode?: 'client' | 'server',
  rowsPerPage?: number,
  totalRows?: number,
  showPagination?: boolean,
}

type DataTableProps = {
  title?: string;
  size?: 'small' | 'medium',
  id_field?: string,
  minWidth?: number,
  stickyHeader?: boolean,
  placeholder?: string,
  orderBy?: string,
  orderType?: 'asc' | 'desc',
  filterName: string,
  pagination: PageInfo,
  loader: {
    loading: boolean,
    rows: number,
    columns: number
  },
  showCheckColumn?: boolean,
  showSearch?: boolean,
  showTotaled?: boolean,
  showRefresh?: boolean,
  showFilter?: boolean,
  TABLE_HEAD: TableColumn[],
  TABLE_ROWS: any[],
  menuOptions: MoreMenuOption[],
  row_style?: React.CSSProperties,
  filterComponent?: React.ReactNode,
  tooltipLabel?: string,
  onSearch?: (filterName: string) => void,
  onPageChange?: (page: number) => void,
  onSelectedRowsChange?: (selectedRows: any[]) => void,
  onRefreshData?: () => void,
};

const getReplacedRouteParams = (row: any, route: string, params?: RouteParams[]) => {

  if (!row || !params)
    return route;

  let url = route;
  params?.forEach((p) => {

    if (p.fieldName in row)
      url = url.replace(p.paramName, String(row[ p.fieldName ]).toLowerCase());
  });

  return url
}

function getValueFromField(field: string, row: Record<string, any>): any {

  const fieldParts = field.split('.');

  return fieldParts.reduce((value, part) => {
    if (value && typeof value === 'object' && part in value) {
      return value[ part ];
    }
    return undefined;
  }, row);
}

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create([ 'box-shadow', 'width' ], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[ 500 ]} !important`
  }
}));

export const DataTable = ({
  loader: { loading, columns: loadingColumns, rows: loadingRows },
  pagination: {
    mode: paginationMode = 'client',
    rowsPerPage: rpp = 25,
    totalRows = 0,
    showPagination = true,
  },
  size = 'medium',
  title = 'report',
  id_field = 'id',
  minWidth = 800,
  stickyHeader = false,
  showCheckColumn = true,
  showSearch = true,
  showFilter = true,
  showRefresh = true,
  showTotaled = false,
  placeholder = "Buscar...",
  orderBy: ob = "created_at",
  filterName: filterField,
  orderType = 'desc',
  TABLE_HEAD,
  TABLE_ROWS,
  menuOptions,
  row_style = {},
  tooltipLabel = 'Editar',
  filterComponent,
  onSearch,
  onPageChange,
  onSelectedRowsChange,
  onRefreshData,
}: DataTableProps) => {

  const theme = useTheme();

  const [ page, setPage ] = useState(0);
  const [ dataCollection, setDataCollection ] = useState<any[]>([]);
  const [ order, setOrder ] = useState<'asc' | 'desc'>(orderType);
  const [ orderBy, setOrderBy ] = useState(ob);
  const [ selected, setSelected ] = useState<string[]>([]);
  const [ filterValue, setFilterValue ] = useState('');
  const [ rowsPerPage, setRowsPerPage ] = useState(rpp);
  const [ columns, setColumns ] = useState<TableColumn[]>([]);
  const [ tableSize, setTableSize ] = useState(size);

  const isServerMode = paginationMode === 'server';

  useEffect(() => {
    setTableSize(size);
  }, [ size ]);


  useEffect(() => {
    setDataCollection(TABLE_ROWS);
  }, [ TABLE_ROWS ])


  useEffect(() => {
    setColumns(TABLE_HEAD);
  }, [ TABLE_HEAD ]);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked: boolean) => {

    if (checked) {
      const newSelecteds = dataCollection.map((n: any) => n.id);
      setSelected(newSelecteds);
      onSelectedRowsChange?.(newSelecteds);
      return;
    }

    setSelected([]);
    onSelectedRowsChange?.([]);
  };

  const handleClick = (id: string) => {

    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    }
    else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    }
    else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    }
    else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
    onSelectedRowsChange?.(newSelected);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePagechange = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, _page: number) => {

    if (isServerMode) {
      setPage(_page)
      if (onPageChange)
        onPageChange(_page + 1);
    }
    else {
      setPage(_page)
    }
  }

  // const handleDownload = () => {
  //   try {

  //     const slug = slugify(title);

  //     const _columns: ExportColumn[] = columns.filter(c => !c.hidden && c.id).map((c) => {

  //       let _type = 'string';
  //       switch (c.type) {
  //         case 'number':
  //           _type = 'number';
  //           break;
  //         case 'boolean':
  //           _type = 'boolean';
  //           break;
  //         default:
  //           _type = 'string';
  //       }

  //       return {
  //         fieldName: c.id,
  //         format: c.totalizeFormat || '',
  //         value: c.label,
  //         type: _type
  //       };
  //     });

  //     const dataExport = dataToRender.map((item) => {

  //       const _data: any = {};

  //       _columns.forEach((c, index) => {

  //         let _value = item[ c.fieldName ];

  //         switch (c.type) {
  //           case 'number':
  //             _value = fNumberFloat(Number(_value || 0), c.format);
  //             break;
  //           case 'boolean':
  //             _value = _value ? 'YES' : 'NO';
  //             break;
  //           default:
  //             _value = _value || '';
  //         }

  //         _data[ `${index + 1}_${c.fieldName}` ] = _value;
  //       });

  //       return _data;
  //     });

  //     exportTo(slug, _columns, dataExport, 'export');
  //   }
  //   catch (error) {
  //     consoleLog("error when exporting : ", error);
  //   }
  // }

  const _cols = columns.map(c => c.id);
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataCollection.length) : 0;
  const matches = matchSorter(dataCollection, filterValue, { keys: _cols, keepDiacritics: false, threshold: matchSorter.rankings.MATCHES });
  const filteredData = applySortFilter(matches, '', getComparator(order, orderBy), '');
  const DataNotFound = filterValue.length > 0 && filteredData.length <= 0;

  const dataToRender = isServerMode ? filteredData : filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  return (
    <Card
      sx={{ p: 4 }}
    >
      {showSearch && (
        <>
          <SearchStyle
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder={placeholder}
            startAdornment={
              <InputAdornment position="start">
                <Box
                  component={Icon}
                  icon="search-fill"
                  sx={{ color: 'text.disabled' }}
                />
              </InputAdornment>
            }
          />
          <Box sx={{ mb: 2 }} />
        </>
      )}
      <Scrollbar>
        {loading ?
          <LoadingList columns={loadingColumns} rows={loadingRows} /> :
          <TableContainer
            sx={{
              minWidth,
              maxHeight: stickyHeader ? 440 : -1,
              position: 'relative',
              overflow: 'unset'
            }}

          >
            <Table
              size={tableSize}
              stickyHeader={stickyHeader}
            >
              <ListHead
                order={order}
                orderBy={orderBy}
                headLabel={columns}
                row_style={row_style}
                rowCount={dataCollection.length}
                numSelected={selected.length}
                showCheckColumn={showCheckColumn}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />

              <TableBody>
                <TableRow style={{ height: 10 }} />

                {dataToRender?.map((row) => {

                  const id = row[ id_field || 'id' ];
                  const isItemSelected = selected.indexOf(id) !== -1;

                  return (
                    <TableRow
                      id={`table-row-${id}`}
                      key={`TableRow-${id}`}
                      hover
                      tabIndex={-1}
                      role="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                      style={row_style}
                    >
                      {showCheckColumn &&
                        <TableCell key="TableCell-checkbox" padding="checkbox">
                          <Checkbox checked={isItemSelected} onClick={() => handleClick(id)} />
                        </TableCell>
                      }
                      {columns.filter((c => !c.hidden)).map((c) => {

                        const field = c.id;
                        const cellNode = c.renderCell ? c.renderCell({ theme, row, column: String(c.id) }) : null;
                        const cellStyle = c.cell_style ? c.cell_style : {};
                        const value = field.indexOf('.') > 0 ? getValueFromField(field, row) : row[ field ];

                        if (c.type === 'picture')
                          return (
                            <TableCell
                              id={`table-cell-row-${c.id}`}
                              key={`TableCell-${c.id}`}
                              component="th"
                              scope="row"
                              padding="none"
                              style={{ ...cellStyle, paddingLeft: 10, cursor: 'pointer' }}
                            >
                              {cellNode || <Stack direction="row" alignItems="center" alignContent="center" spacing={2}>
                                <Image
                                  src={row[ c.pictureFieldName || '' ]}
                                  alt={value}
                                  // minHeight={50}
                                  maxWidth={60}
                                  width="auto"
                                  borderRadius={getBorderRadius(c)}
                                  sx={c.sx}
                                />

                                {c.pictureAsLink ?
                                  <Tooltip title={tooltipLabel} arrow >
                                    <Link
                                      aria-label={tooltipLabel}
                                      variant="subtitle2"
                                      component={RouterLink}
                                      style={{ cursor: 'pointer' }}
                                      to={c.clickableLink ? c.clickableLink(row) : '#'}
                                      onClick={c.clickableLink ? undefined : () => { c.onInteractiveClick?.(row); }}
                                    >
                                      {value || 'N/D'}
                                    </Link>
                                  </Tooltip>
                                  :
                                  <Typography variant="subtitle2" noWrap>
                                    {value || 'N/D'}
                                  </Typography>
                                }
                              </Stack>
                              }
                            </TableCell>
                          );

                        if (c.type === 'link') {
                          return (
                            <TableCell
                              key={`TableCell-${c.id}`}
                              align={c.align}
                              style={{ ...cellStyle, cursor: 'pointer' }}
                              onClick={c.clickableLink ? undefined : () => { c.onInteractiveClick?.(row); }}
                            >
                              {cellNode || <Tooltip title={tooltipLabel} arrow >
                                <Link
                                  aria-label={tooltipLabel}
                                  variant="subtitle2"
                                  component={RouterLink}
                                  style={{ cursor: 'pointer' }}
                                  to={c.clickableLink ? c.clickableLink(row) : '#'}
                                >
                                  {value || 'N/D'}
                                </Link>
                              </Tooltip>
                              }
                            </TableCell>
                          )
                        }

                        if (c.type === 'uuid')
                          return cellNode || (
                            <TableCell
                              key={`TableCell-${c.id}`}
                              align={c.align}
                              style={cellStyle}
                            >
                              <Tooltip title={String(value || '')} >
                                <p>
                                  {shortenUuid(value)}
                                </p>
                              </Tooltip>
                            </TableCell>
                          );

                        if (c.type === 'text')
                          return cellNode || (
                            <TableCell
                              key={`TableCell-${c.id}`}
                              align={c.align}
                              style={cellStyle}
                            >
                              {value}
                            </TableCell>
                          );

                        if (c.type === 'datetime')
                          return cellNode || (
                            <TableCell
                              key={`TableCell-${c.id}`}
                              align={c.align}
                              style={cellStyle}
                            >
                              {dateTimeFormat(value, c.dateFormat || 'dd MMMM yyyy hh:mm aaaa')}
                            </TableCell>
                          );


                        if (c.type === 'number')
                          return cellNode || (
                            <TableCell
                              key={`TableCell-${c.id}`}
                              align={c.align}
                              style={cellStyle}
                            >
                              {fNumberFloat(value || 0, c.totalizeFormat)}
                            </TableCell>
                          );

                        if (c.type === 'boolean')
                          return (
                            <TableCell key={`TableCell-${c.id}`} align={c.align} style={cellStyle}>
                              {cellNode || <Checkbox disabled checked={value || false} />}
                            </TableCell>
                          );

                        if (c.type === 'app_status') {

                          return (
                            <TableCell key={`TableCell-${c.id}`} align={c.align} style={cellStyle}>
                              {cellNode}
                            </TableCell>
                          );
                        }

                        if (c.type === 'status') {

                          const color = c.getStatusColor ? c.getStatusColor(value) : 'default';
                          return (
                            cellNode || <TableCell key={`TableCell-${c.id}`} align={c.align} style={cellStyle}>
                              <Label
                                variant={theme.palette.mode === 'light' ? 'soft' : 'filled'}
                                color={color}
                              >
                                {sentenceCase(value || null)}
                              </Label>
                            </TableCell>
                          );
                        }

                        return null
                      })}
                      {menuOptions.length <= 0 ? null :
                        <TableCell key="TableCell-menuOptions" align="right">
                          <MoreMenu
                            displayOptions={menuOptions.filter((m) => m.evalVisibility ? m.evalVisibility(row) : m.visible).map((m) => ({
                              ...m,
                              route: m.useLink ? getReplacedRouteParams(row, m.route, m.routeParams) : m.route,
                              onClick: (args: any) => m?.onClick ? m.onClick(args, row) : null
                            }))}
                          />

                        </TableCell>
                      }
                    </TableRow>
                  );
                })}

                {!isServerMode && emptyRows > 0 && (
                  <TableRow key="TableRow-emptyRows" style={{ height: 53 * emptyRows }}>
                    <TableCell key="TableCell-colSpan" colSpan={6}>
                      No hay mas registros
                    </TableCell>
                  </TableRow>
                )}

                {DataNotFound && (
                  <TableRow key="TableRow-filterName">
                    <TableCell key="TableCell-filterName" align="center" colSpan={6} sx={{ py: 3 }}>
                      <SearchNotFound query={filterValue} />
                    </TableCell>
                  </TableRow>
                )}

              </TableBody>

            </Table>
            {showTotaled &&
              <>
                <Divider />
                <TableContainer>
                  <Table size={size}>
                    <TableBody>
                      <TableRow style={row_style} key="t-row-totalize">
                        {columns.filter((c => !c.hidden)).map((c) => {

                          const cellStyle = c.cell_style ? c.cell_style : {};
                          let str_value = '';
                          let value = 0;
                          if (c.totalizable) {
                            value = totalizeRow(filteredData, c.id, c.totalizeType || 'sum');
                            switch (c.totalizeType) {
                              case 'sum':
                                str_value = fNumberFloat(value);
                                break;
                              case 'count':
                                str_value = `Cant: ${fNumber(value)}`;
                                break;
                              case 'average':
                                str_value = fPercent(value);
                                break;
                              case 'max':
                                str_value = `Max: ${fNumberFloat(value)}`;
                                break;
                              case 'min':
                                str_value = `Min: ${fNumberFloat(value)}`;
                                break;
                              default:
                                str_value = '';
                            }
                          }

                          const width = document.getElementById(`table-cell-header-${c.id}`)?.clientWidth || 0;
                          return (
                            <TableCell
                              id={`tc-total-${c.id}`}
                              key={`tc-total ${c.id}`}
                              align={c.align || 'left'}
                              style={{ ...cellStyle, minWidth: width }}>
                              <b>{str_value} </b>
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            }
          </TableContainer>
        }
      </Scrollbar>

      {showPagination &&
        <TablePagination
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          labelRowsPerPage={`Registros por página: `}
          rowsPerPageOptions={isServerMode ? [ rowsPerPage ] : [ 5, 10, 25, 50, 100 ]}
          component="div"
          count={isServerMode ? totalRows : dataCollection.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePagechange}
          onRowsPerPageChange={handleChangeRowsPerPage}
        >
          Página
        </TablePagination>
      }
    </Card>
  );
}

function getBorderRadius(c: TableColumn) {

  switch (c.pictureVariant) {
    case 'circular':
      return '50%';
    case 'rounded':
      return 1;

    default:
      return 0;
  }
}
