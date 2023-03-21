import { BigNumber } from 'bignumber.js';

export interface ResponseInterface {
    tokenAddress: string
    price: BigNumber
    symbol: string
    name: string
    balance: BigNumber
}

// [
//     {
//         "tokenAddress": "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
//         "price": 1.0010093677644896,
//         "symbol": "usdt",
//         "name": "Tether2",
//         "balance": "6297057973"
//     },
//     {
//         "tokenAddress": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
//         "price": 0.9986337806971939,
//         "symbol": "usdc",
//         "name": "USD Coin",
//         "balance": "308802989"
//     },
//     {
//         "tokenAddress": "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
//         "price": 1.0010093677644896,
//         "symbol": "usdt",
//         "name": "Tether",
//         "balance": "6297057973"
//     }
// ]