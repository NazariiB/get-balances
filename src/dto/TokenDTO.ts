export interface TokenInterface {
    priority: number
    token_name: string
    decimals: number
    symbol: string
    addresses: {[key:string]: string}
}