import { paths } from 'src/routes/paths'
import { DataTable, TableColumn } from 'src/components/table/data-table';

const TABLE_HEAD = (): TableColumn[] => ([
  { type: 'link', align: 'left', id: 'name', label: 'Perfil', clickableLink: (row) => paths.dashboard.roles.edit(row.id) },
  { type: 'text', align: 'left', id: 'description', label: 'Descripción' },
  { type: 'text', align: 'left', id: 'role_type', label: 'Tipo' },
  { type: 'text', align: 'center', id: 'tenant.name', label: 'Empresa' },
  { type: 'menu', align: 'right', id: '', label: '' }
]);

type Props = {
  loading: boolean;
  rows: any[];
}

export default function ManageRolesView({ loading, rows }: Props) {

  return (
    <DataTable
      TABLE_HEAD={TABLE_HEAD()}
      TABLE_ROWS={rows}
      orderBy="name"
      filterName="description"
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
