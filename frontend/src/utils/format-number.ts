import numeral from 'numeral';
import { TotalizeType } from 'src/types/totalizer';

type InputValue = string | number | null;

export function fNumber(number: InputValue) {
  return numeral(number).format();
}

export function fNumberFloat(number: string | number, fomat: string = '0,0.00') {
  return numeral(number).format(fomat);
}

export function fCurrency(number: InputValue) {
  const format = number ? numeral(number).format('$0,0.00') : '';

  return result(format, '.00');
}

export function fPercent(number: InputValue) {
  const format = number ? numeral(Number(number) / 100).format('0.0%') : '';

  return result(format, '.0');
}

export function fShortenNumber(number: InputValue) {
  const format = number ? numeral(number).format('0.00a') : '';

  return result(format, '.00');
}

export function fData(number: InputValue) {
  const format = number ? numeral(number).format('0.0 b') : '';

  return result(format, '.0');
}

function result(format: string, key = '.00') {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}


export const totalizeRow = (data: any[], column: string, type: TotalizeType) => {

  if (!data || !data.length)
    return 0;

  switch (type) {
    case 'sum':
      return Number(data.reduce((acc, cur) => acc + cur[ column ], 0));
    case 'average':
      if (data.length === 0)
        return 0;
      return Number(data.reduce((acc, cur) => acc + cur[ column ], 0) / data.length);
    case 'max':
      return Number(Math.max(...data.map(item => item[ column ])));
    case 'min':
      return Number(Math.min(...data.map(item => item[ column ])));
    case 'count':
      return Number(data.length || 0);
    default:
  }

  return 0;
}
