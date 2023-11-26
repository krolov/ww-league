import BigNumber from 'bignumber.js';

export type BigNumberLike = BigNumber.Value;

export const toBN = (n: BigNumberLike): BigNumber =>
  n instanceof BigNumber ? n : new BigNumber(n);

export const formatPercent = (n: BigNumberLike): number =>
  parseFloat(toBN(n).times(100).toFixed(1));

export const formatInt = (n: BigNumberLike): number =>
  parseInt(toBN(n).toString());
