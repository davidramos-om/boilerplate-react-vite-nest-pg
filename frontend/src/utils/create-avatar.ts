import { capitalize } from 'lodash';

const PRIMARY_NAME = [ 'A', 'N', 'H', 'L', 'Q', '9', '8' ];
const INFO_NAME = [ 'F', 'G', 'T', 'I', 'J', '1', '2', '3' ];
const SUCCESS_NAME = [ 'K', 'D', 'Y', 'B', 'O', '4', '5' ];
const WARNING_NAME = [ 'P', 'E', 'R', 'S', 'C', 'U', '6', '7' ];
const ERROR_NAME = [ 'V', 'W', 'X', 'M', 'Z' ];

function getFirstCharacter(name: string) {
  return capitalize(name && name.charAt(0));
}

function getAvatarColor(name: string) {
  if (PRIMARY_NAME.includes(getFirstCharacter(name))) return 'primary';
  if (INFO_NAME.includes(getFirstCharacter(name))) return 'info';
  if (SUCCESS_NAME.includes(getFirstCharacter(name))) return 'success';
  if (WARNING_NAME.includes(getFirstCharacter(name))) return 'warning';
  if (ERROR_NAME.includes(getFirstCharacter(name))) return 'error';
  return 'default';
}

export function createAvatar(name: string) {
  return {
    name: getFirstCharacter(name),
    color: getAvatarColor(name)
  } as const;
}

export function getColorName(hex: string) {
  let color;

  switch (hex) {
    case '#00AB55':
      color = 'Green';
      break;
    case '#000000':
      color = 'Black';
      break;
    case '#FFFFFF':
      color = 'White';
      break;
    case '#FFC0CB':
      color = 'Pink';
      break;
    case '#FF4842':
      color = 'Red';
      break;
    case '#1890FF':
      color = 'Blue';
      break;
    case '#94D82D':
      color = 'Greenyellow';
      break;
    case '#FFC107':
      color = 'Orange';
      break;
    default:
      color = hex;
  }

  return color;
}

export function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar({ name, pointer }: { name: string, pointer: boolean }) {

  let first = name.split(' ')[ 0 ] || '';
  first = first.charAt(0);

  // let last = name.split(' ')[ 1 ] || '';
  // last = last.charAt(0);

  return {
    sx: {
      bgcolor: stringToColor(name || Math.random().toString(36).substring(2, 15)),
      color: 'white',
      cursor: pointer ? 'pointer' : 'default',
    },
    children: name ? `${first}` : '',
  };
}
