import { paths } from 'src/routes/paths'
import { DataTable, TableColumn } from 'src/components/table/data-table';
import Label from "src/components/label/label";
import { getStatusTranslation } from "src/types/status";

const TABLE_HEAD = (): TableColumn[] => ([
  {
    type: 'picture', align: 'left', id: 'fullName', label: 'Nombre',
    pictureFieldName: 'image_url', pictureAsLink: true, pictureVariant: 'circular',
    clickableLink: (row) => paths.dashboard.users.edit(row.id),
    sx: { m: 0.5 }
  },
  { type: 'text', align: 'center', id: 'email', label: 'Correo' },
  { type: 'text', align: 'center', id: 'user_id', label: 'Usuario' },
  {
    type: 'app_status', align: 'center', id: 'type', label: 'Tipo de usuario', renderCell: ({ row }) => (
      <Label
        variant="soft"
        color={row?.type === 'COMPANY_USER' ? 'secondary' : 'info'}
      >
        {row?.type === 'COMPANY_USER' ? 'Corporativo' : 'Admin Portal'}
      </Label>
    )
  },
  { type: 'text', align: 'center', id: 'tenant.name', label: 'Empresa' },
  { type: 'datetime', align: 'center', id: 'created_at', label: 'Fecha' },
  {
    type: 'app_status', align: 'center', id: 'type', label: 'Estado', renderCell: ({ row }) => (
      <Label
        variant="soft"
        color={row?.status === 'ACTIVE' ? 'success' : 'error'}
      >
        {getStatusTranslation(row?.status)}
      </Label>
    )
  },
  { type: 'menu', align: 'right', id: '', label: '' }
]);

type Props = {
  loading: boolean;
  rows: any[];
}

export default function ManageUsersView({ loading, rows }: Props) {

  return (
    <DataTable
      TABLE_HEAD={TABLE_HEAD()}
      TABLE_ROWS={rows}
      orderBy="created_at"
      filterName="fullName"
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
