import { Big as BigNumber } from 'big.js';
import { Asset } from '@wallet/implementation-api';
export declare function getAssets(): Asset[];
export declare type AddressBalanceOptions = {
    testnet?: boolean;
};
export declare function getAddressBalance(address: string, options?: AddressBalanceOptions): Promise<BigNumber>;
