import { paths } from 'src/routes/paths'
import { DataTable, TableColumn } from 'src/components/table/data-table';

const TABLE_HEAD = (): TableColumn[] => ([
  {
    type: 'picture', align: 'center', id: 'code', label: 'Código',
    pictureFieldName: 'logo_url', pictureVariant: 'rounded', pictureAsLink: true,
    clickableLink: (row) => paths.dashboard.tenants.edit(row.id)
  },
  { type: 'text', align: 'center', id: 'name', label: 'Empresa', totalizable: true, totalizeType: 'count', totalizeFormat: 'number' },
  { type: 'text', align: 'center', id: 'contact_name', label: 'Contacto' },
  { type: 'number', align: 'right', id: 'total_cost', label: 'Total Servicio', totalizeFormat: '0,0.00', totalizable: true, totalizeType: 'sum' },
  { type: 'boolean', align: 'center', id: 'access_enabled', label: 'Acceso Activo' },
  { type: 'datetime', align: 'center', id: 'created_at', label: 'Fecha' },
  { type: 'menu', align: 'right', id: '', label: '' }
]);

type Props = {
  loading: boolean;
  rows: any[];
}

export default function TenantsView({ loading, rows }: Props) {

  return (
    <DataTable
      showTotaled
      TABLE_HEAD={TABLE_HEAD()}
      TABLE_ROWS={rows}
      filterName="name"
      pagination={{
        rowsPerPage: 25,
        mode: 'client',
        showPagination: true,
        totalRows: 0
      }}
      showCheckColumn={false}
      loader={{
        loading,
        rows: 5,
        columns: 6
      }}
      menuOptions={[]}
    />
  );
}
