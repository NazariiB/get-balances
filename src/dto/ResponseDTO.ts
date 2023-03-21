import { BigNumber } from 'bignumber.js';

export interface ResponseInterface {
    tokenAddress: string
    price: BigNumber
    symbol: string
    name: string
    balance: BigNumber
}
