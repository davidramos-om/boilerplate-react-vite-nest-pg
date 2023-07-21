import { paths } from 'src/routes/paths'
import Label from "src/components/label";
import { DataTable, TableColumn } from 'src/components/table/data-table';
import { getStatusTranslation } from "src/types/status";

const TABLE_HEAD = (): TableColumn[] => ([
  { type: 'link', align: 'left', id: 'code', label: 'Código', clickableLink: (row) => paths.dashboard.onboarding_requests.view(row.id) },
  { type: 'text', align: 'center', id: 'company', label: 'Empresa' },
  { type: 'text', align: 'center', id: 'fullName', label: 'Contacto' },
  { type: 'text', align: 'center', id: 'email', label: 'Email' },
  { type: 'text', align: 'center', id: 'phone', label: 'Teléfono' },
  {
    type: 'status', align: 'center', id: 'status', label: 'Estado',
    renderCell: ({ row }) => (
      <Label
        component="tr"
        key={row?.id}
        variant={row?.status === 'UNREAD' ? 'filled' : 'soft'}
        color={row?.status === 'UNREAD' ? 'error' : 'success'}
      >
        {getStatusTranslation(row?.status)}
      </Label>
    )
  },
  { type: 'datetime', align: 'center', id: 'created_at', label: 'Fecha' },
  { type: 'menu', align: 'right', id: '', label: '' }
]);


type Props = {
  loading: boolean;
  rows: any[];
}

export default function OnboardingRequestView({ loading, rows }: Props) {

  return (
    <DataTable
      TABLE_HEAD={TABLE_HEAD()}
      TABLE_ROWS={rows}
      orderBy="created_at"
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
