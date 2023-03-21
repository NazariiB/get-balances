import { Router } from "express";
import { getBalancesByAddress } from "../getBalances/getBalancesByAddress";
import Web3 from "web3";
import secret from "../config.json";

const getBalancesRouter = Router();

getBalancesRouter.get("/balance/:address/:network", async (req, res) => {
    try {
        const address = req.params.address;
        const network = req.params.network;

        if (!Web3.utils.isAddress(address) || !secret.suportedNetworks.hasOwnProperty(network)) {
            res.status(400).json({ error: "address or network is not valid" });
            return;
        }

        const balances = await getBalancesByAddress(address, network);

        if (!balances) {
            res.status(500).json({ error: "error getting data" });
            return;
        }

        res.send(balances);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "error geting balances" });
    }
})

export { getBalancesRouter }