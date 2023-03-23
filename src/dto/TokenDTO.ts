export interface TokenDTO {
    priority: number
    token_name: string
    decimals: number
    symbol: string
    addresses: {[key:string]: string}
}