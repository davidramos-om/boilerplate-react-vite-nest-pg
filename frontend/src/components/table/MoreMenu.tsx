import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';

import Iconify from "src/components/iconify/iconify";

export type RouteParams = {
  paramName: string,
  fieldName: string
};

export type MoreMenuOption = {
  useLink: boolean,
  label: string,
  route: string,
  visible: boolean,
  routeParams?: RouteParams[],
  icon: string,
  target?: '_blank' | '',
  onClick?: (...args: any[]) => any;
  evalVisibility?: (item: any) => boolean;
}

type UserMoreMenuProps = {
  displayOptions: MoreMenuOption[]
};

export default function UserMoreMenu({ displayOptions }: UserMoreMenuProps) {

  const ref = useRef(null);
  const [ isOpen, setIsOpen ] = useState(false);

  const handleClickItem = (opt: MoreMenuOption) => () => {
    setIsOpen(false);
    if (opt.onClick)
      opt.onClick();
  }

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="majesticons:more-menu" />
      </IconButton>
      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >

        {displayOptions.map((opt) => {
          if (opt.useLink)
            return (

              <MenuItem
                key={opt.label}
                component={RouterLink}
                target={opt.target || ''}
                to={opt.route}
                sx={{ color: 'text.secondary' }}
                onClick={handleClickItem(opt)}
              >
                <ListItemIcon>
                  <Iconify icon={opt.icon || "eva:edit-fill"} />
                </ListItemIcon>
                <ListItemText primary={opt.label} primaryTypographyProps={{ variant: 'body2' }} />
              </MenuItem>
            );
          return (
            <MenuItem key={opt.label} onClick={handleClickItem(opt)} sx={{ color: 'text.secondary' }}>
              <ListItemIcon>
                <Iconify icon={opt.icon || "fluent:delete-48-filled"} />
              </ListItemIcon>
              <ListItemText primary={opt.label} primaryTypographyProps={{ variant: 'body2' }} />
            </MenuItem>
          );
        })}

      </Menu>
    </>
  );
}
