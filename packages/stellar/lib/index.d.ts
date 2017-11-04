import { Big as BigNumber } from 'big.js';
import { Asset, Wallet } from '@wallet/platform-api';
export declare type PublicWalletData = {
    publicKey: string;
    testnet: boolean;
};
export declare type StellarWallet = Wallet<any, PublicWalletData>;
export declare function getAssets(): Asset[];
export declare function createPrivateKey(): Promise<any>;
export declare type AddressBalanceOptions = {
    testnet?: boolean;
};
export declare function getAddressBalance(address: string, options?: AddressBalanceOptions): Promise<BigNumber>;
export declare function getWalletBalance(wallet: StellarWallet): Promise<BigNumber>;
