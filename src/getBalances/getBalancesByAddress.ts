import Web3 from "web3";
import { AbiItem } from 'web3-utils';
import TokenModel from "../models/TokenModel";
import secret from "../config.json";
import contractAbi from "./contractAbi.json"
import { ResponseInterface } from "../dto/ResponseDTO";
import { TokenInterface } from "../dto/TokenDTO";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";


export async function getBalancesByAddress(address: string, network: string) {
    try {
        const tokensCursor = TokenModel.collection.find().sort({ priority: 1 });
        const tokens: any = await tokensCursor.toArray();

        const web3 = new Web3(secret.suportedNetworks[network as keyof typeof secret.suportedNetworks][0]);
        const response: ResponseInterface[] = [];

        const moralisChainName = secret.suportedNetworks[network as keyof typeof secret.suportedNetworks][1];
        const chain = EvmChain[moralisChainName as keyof typeof EvmChain] as EvmChain;

        for (const token of tokens as TokenInterface[]) {
            const tokenAddress = token.addresses[network];
            
            const tokenPriceResult = await Moralis.EvmApi.token.getTokenPrice({
                address: token.addresses["ethereum"],
                chain,
            });
            const tokenPrice = tokenPriceResult.toJSON().usdPrice as number;

            const contract = new web3.eth.Contract(contractAbi as AbiItem[], token.addresses[network]);
            const tokenBalance = await contract.methods.balanceOf(address).call() as number;

            if (tokenBalance > 0) {
                response.push({
                    tokenAddress: tokenAddress as string,
                    price: tokenPrice,
                    symbol: token.symbol,
                    name: token.token_name,
                    balance: tokenBalance
                })
            }
        }

        return response;
    } catch (error) {
        console.log(error);
    }
}
