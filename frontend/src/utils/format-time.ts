import { format, getTime, formatDistanceToNow } from 'date-fns';

type InputValue = Date | string | number | null | undefined;

export function fDate(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date: InputValue) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date: InputValue) {
  return date
    ? formatDistanceToNow(new Date(date), {
      addSuffix: true,
    })
    : '';
}

export const dateFormat = (date: Date, fmt = 'MM/dd/yyyy') => {

  if (date == null || !date || date === undefined)
    return '';

  const result = format(new Date(date), fmt, { weekStartsOn: 1, });
  return result;
}


export const dateTimeFormat = (date: Date, strFormat = 'dd MMM yyyy  hh:mm aaaa') => dateFormat(date, strFormat)