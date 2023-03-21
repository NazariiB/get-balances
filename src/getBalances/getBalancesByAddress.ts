import Web3 from "web3";
import { AbiItem } from 'web3-utils';
import TokenModel from "../models/TokenModel";
import secret from "../config.json";
import contractAbi from "./contractAbi.json"
import { ResponseInterface } from "../dto/ResponseDTO";
import { TokenInterface } from "../dto/TokenDTO";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { BigNumber } from 'bignumber.js';

export async function getBalancesByAddress(address: string, network: string) {
    try {
        const tokensCursor = TokenModel.collection.find().sort({ priority: 1 });
        const tokens: TokenInterface[] = await tokensCursor.toArray() as any;

        const web3 = new Web3(secret.suportedNetworks[network as keyof typeof secret.suportedNetworks][0]);
        const response: ResponseInterface[] = [];

        const moralisChainName = secret.suportedNetworks[network as keyof typeof secret.suportedNetworks][1];
        const chain = EvmChain[moralisChainName as keyof typeof EvmChain] as EvmChain;

        for (let i = 0; i < tokens.length; i += 10) {
            await Promise.all(tokens.slice(i, i + 10).map(async (token) => {
                const tokenAddress = token.addresses[network];
                const contract = new web3.eth.Contract(contractAbi as AbiItem[], token.addresses[network]);
                const [tokenPriceResult, tokenBalance, tokenDecimals] = await Promise.all([
                    Moralis.EvmApi.token.getTokenPrice({
                        address: token.addresses[network],
                        chain,
                    }), BigNumber(await contract.methods.balanceOf(address).call()),
                    BigNumber(await contract.methods.decimals().call())
                ])
                const tokenPrice = BigNumber(tokenPriceResult.toJSON().usdPrice);
                if (tokenBalance.comparedTo(0)) {
                    response.push({
                        tokenAddress: tokenAddress as string,
                        price: tokenPrice,
                        symbol: token.symbol,
                        name: token.token_name,
                        balance: BigNumber(tokenBalance.dividedBy(BigNumber(10).pow(tokenDecimals)).multipliedBy(tokenPrice).toFixed(2))
                    })
                }
            }))
        }

        return response;
    } catch (error) {
        console.log(error);
    }
}
