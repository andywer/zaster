import { Server } from 'stellar-sdk';
export declare function getHorizonServer({testnet}: {
    testnet: boolean;
}): Server;
export declare function useNetwork({testnet}: {
    testnet: boolean;
}): void;
