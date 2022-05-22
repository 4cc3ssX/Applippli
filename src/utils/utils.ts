import _ from 'lodash';

export function getCommaDelimit(x: number): string {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function nFormatter(number: string | number): {
  amount: number | string;
  prefix: string | null;
} {
  let num = number;
  num = num?.toString().replace(/[^0-9.]/g, '');
  if (_.toNumber(num) < 1000) {
    return {amount: num ? num : 0, prefix: ''};
  }
  let si = [
    {v: 1e3, s: 'K'},
    {v: 1e6, s: 'M'},
    {v: 1e9, s: 'B'},
    {v: 1e12, s: 'T'},
    {v: 1e15, s: 'P'},
    {v: 1e18, s: 'E'},
  ];
  let index;
  for (index = si.length - 1; index > 0; index--) {
    if (_.toNumber(num) >= si[index].v) {
      break;
    }
  }
  const amount = parseFloat(
    (_.toNumber(num) / si[index].v)
      .toFixed(2)
      .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1'),
  );
  const prefix = si[index].s;
  return {amount: amount, prefix: prefix};
}
