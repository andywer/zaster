import { Big as BigNumber } from 'big.js';
import { Server } from 'stellar-sdk';
export declare function getHorizonServer({testnet}: {
    testnet: boolean;
}): Server;
export declare function useNetwork({testnet}: {
    testnet: boolean;
}): void;
export declare function retrieveAccountData(address: string, options?: {
    testnet?: boolean;
}): Promise<BigNumber>;
