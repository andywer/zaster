import { Big as BigNumber } from 'big.js';
import { Asset, Wallet } from '@wallet/implementation-api';
export declare function getAssets(): Asset[];
export declare type AddressBalanceOptions = {
    testnet?: boolean;
};
export declare function getAddressBalance(address: string, options?: AddressBalanceOptions): Promise<BigNumber>;
export declare function getWalletBalance(wallet: Wallet): Promise<BigNumber>;
