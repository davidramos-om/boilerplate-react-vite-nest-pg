import { useMemo } from 'react';

import { paths } from 'src/routes/paths';
import SvgColor from 'src/components/svg-color';

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};



export function useNavData() {
  const data = useMemo(
    () => [
      // OVERVIEW
      {
        subheader: 'panorama',
        items: [
          { title: 'Inicio', path: paths.dashboard.root, icon: ICONS.dashboard, uac_permission: '*' },
          { title: 'Empresas', path: paths.dashboard.tenants.root, icon: ICONS.tour, uac_permission: 'TENANTS_PAGE' },
          { title: 'Solicitudes', path: paths.dashboard.onboarding_requests.root, icon: ICONS.chat, uac_permission: 'ONBOARDING_PAGE' },
        ],
      },
      // MANAGEMENT
      {
        subheader: 'Administración',
        items: [
          {
            title: 'Seguridad',
            path: paths.dashboard.group.root,
            icon: ICONS.user,
            uac_permission: '*',
            children: [
              { title: 'Usuarios', path: paths.dashboard.users.root, uac_permission: 'USERS_PAGE' },
              { title: 'Roles', path: paths.dashboard.roles.root, uac_permission: 'ROLES_PAGE' },
              { title: 'five', path: paths.dashboard.group.five, uac_permission: '*' },
              { title: 'six', path: paths.dashboard.group.six, uac_permission: '*' },
            ],
          },
        ],
      },
    ],
    []
  );

  return data;
}
